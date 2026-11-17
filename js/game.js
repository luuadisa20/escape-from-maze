window.Game = (() => {
  const layouts = {
    easy:["#########","#S..#...#","#.#.#.#.#","#.#...#H#","#.###.#.#","#...#...#","###.#.###","#H....F.#","#########"],
    medium:["#########","#S..#...#","#.#.#.#H#","#.#...#.#","#.###.#.#","#...#...#","#H#.#.###","#....F..#","#########"],
    hard:["#########","#S..#...#","#.#.#.#H#","#.#...#.#","#.###.#.#","#H..#...#","###.#.#.#","#....F..#","#########"]
  };
  const config={easy:{label:"Mudah",count:5,lives:3},medium:{label:"Sedang",count:7,lives:3},hard:{label:"Sulit",count:9,lives:2}};
  let state={},onFinish=()=>{},onUpdate=()=>{},onQuestion=()=>{};
  function start(level,student,callbacks){
    onFinish=callbacks.finish;onUpdate=callbacks.update;onQuestion=callbacks.question;
    const rows=layouts[level].map(r=>r.split(""));
    const qs=[...QUESTION_BANK].sort(()=>Math.random()-.5).slice(0,config[level].count);
    let startPos,finishPos,hackers=[];
    rows.forEach((row,y)=>row.forEach((v,x)=>{if(v==="S")startPos={x,y};if(v==="F")finishPos={x,y};if(v==="H")hackers.push({x,y,used:false})}));
    state={level,student,rows,player:{...startPos},finish:finishPos,hackers,questions:qs,questionIndex:0,score:0,correct:0,wrong:0,lives:config[level].lives,answered:new Set(),started:Date.now(),pending:null,finished:false,saved:false};
    render();update();
  }
  function render(){
    const el=document.getElementById("maze");el.innerHTML="";
    state.rows.forEach((row,y)=>row.forEach((cell,x)=>{
      const d=document.createElement("div");d.className="maze-cell";
      if(cell==="#")d.classList.add("wall");
      else if(x===state.player.x&&y===state.player.y){d.classList.add("player");d.textContent="🧑‍🚀"}
      else if(x===state.finish.x&&y===state.finish.y){d.classList.add("finish");d.textContent="🏁"}
      else {const h=state.hackers.find(h=>h.x===x&&h.y===y&&!h.used);if(h){d.classList.add("hacker");d.textContent="👾"}}
      el.appendChild(d);
    }));
  }
  function update(){document.getElementById("gameScore").textContent=state.score;document.getElementById("lives").textContent="❤️".repeat(state.lives)+"🖤".repeat(config[state.level].lives-state.lives);document.getElementById("progressText").textContent=`${state.questionIndex}/${state.questions.length}`;document.getElementById("progressBar").style.width=`${state.questionIndex/state.questions.length*100}%`;onUpdate(state)}
  function move(dir){
    if(!state.rows||state.finished||state.pending)return;
    const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!delta)return;
    const x=state.player.x+delta[0],y=state.player.y+delta[1];
    if(!state.rows[y]||state.rows[y][x]==="#"){SoundFX.click();return}
    const hacker=state.hackers.find(h=>h.x===x&&h.y===y&&!h.used);
    if(hacker){state.pending=hacker;onQuestion(state.questions[state.questionIndex%state.questions.length],state.questionIndex+1,state.questions.length);return}
    state.player={x,y};SoundFX.click();render();update();
    if(x===state.finish.x&&y===state.finish.y)finish(true);
  }
  function answer(isCorrect){
    if(!state.pending)return;
    if(isCorrect){
      state.correct++;state.score+=10;state.pending.used=true;state.questionIndex++;state.player={x:state.pending.x,y:state.pending.y};SoundFX.correct();
      state.pending=null;render();update();
      if(state.questionIndex>=state.questions.length){/* all questions completed; exit remains */}
      return {correct:true};
    }
    state.wrong++;state.lives--;SoundFX.wrong();state.pending=null;update();
    if(state.lives<=0){finish(false)}
    return {correct:false};
  }
  function finish(won){
    if(state.finished)return;state.finished=true;
    if(won)state.score+=50;
    const total=state.correct+state.wrong,accuracy=total?Math.round(state.correct/total*100):0;
    const result={id:"run-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),name:state.student.name,studentClass:state.student.studentClass,date:new Date().toISOString(),level:config[state.level].label,score:state.score,correct:state.correct,wrong:state.wrong,accuracy,duration:Math.round((Date.now()-state.started)/1000),status:won?"Menang":"Kalah"};
    if(won)SoundFX.win();else SoundFX.lose();onFinish(result);
  }
  return {start,move,answer,getState:()=>state,quit:()=>finish(false)};
})();