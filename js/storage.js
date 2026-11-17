window.Store = {
  key:"escapeMazeResults",
  get(){try{return JSON.parse(localStorage.getItem(this.key)||"[]")}catch{return []}},
  save(item){const rows=this.get();rows.unshift(item);localStorage.setItem(this.key,JSON.stringify(rows));},
  remove(id){localStorage.setItem(this.key,JSON.stringify(this.get().filter(x=>x.id!==id)))},
  clear(){localStorage.removeItem(this.key)}
};