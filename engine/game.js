export default class Game {
  constructor(size) {
    this.size = size;
    this.callOnMove = [];
    this.callOnWin = [];
    this.callOnLose = [];
    this.checkingAvailableMoves = false;
    this.gameState = {
      board: new Array(size * size).fill(0),
      score: 0,
      won: false,
      over: false
    };

  this.setupNewGame();
  }
  toString() {
    let s = "";
    for (let i = 0; i < this.gameState.board.length; i++) {
      if (i % this.size == 0) {
        s += "\n";
      }
      s += this.gameState.board[i] + " ";
    }
    s += "\n\n";
    s += "Score: " + this.gameState.score + "\n";
    s += "Won: " + this.gameState.won + "\n";
    s += "Over: " + this.gameState.over + "\n";

    return s;
  }
  setupNewGame() {
    this.tiles = this.makeNewArray(this.size, this.size, null);
    this.gameState = {
      board: new Array(this.size * this.size).fill(0),
      score: 0,
      won: false,
      over: false
    };
    this.addNewNumber();
    this.addNewNumber();
    this.update();
  }
  loadGame(gameState) {
    this.gameState = gameState;
  }
  move(direction) {
    
    this.tiles = this.makeArray(this.size,this.size,null);
    if(this.gameState.over){return false}
    let countDownFrom, yIncr, xIncr;
    switch (direction) {
      case "up":
        countDownFrom = 0;
       
        yIncr = -1;
        xIncr = 0;
        break;
      case "down":
        countDownFrom = this.size*this.size -1;
        yIncr = 1;
        xIncr = 0;
        break;
      case "left":
        countDownFrom = 0;
        yIncr = 0;
        xIncr = -1;
        break;
      case "right":
        countDownFrom = this.size * this.size - 1;
        yIncr = 0;
        xIncr = 1;
        break;
    }
    let moved = false;
    for (let i = 0; i < this.size * this.size; i++) {
      let j = Math.abs(countDownFrom - i);

      let r = Math.floor(j / this.size);
      let c = j % this.size;

      if (this.tiles[r][c] === null) {
        continue;
      }

      let nextR = r + yIncr;
      let nextC = c + xIncr;

      while (
        nextR >= 0 &&
        nextR < this.size &&
        nextC >= 0 &&
        nextC < this.size
      ) {
        let next = this.tiles[nextR][nextC];
        let current = this.tiles[r][c];
        if (next === null) {
          if (this.checkingAvailableMoves) {
            return true;
          }
          this.tiles[nextR][nextC] = current;
          this.tiles[r][c] = null;
          r = nextR;
          c = nextC;
          nextR += yIncr;
          nextC += xIncr;
          moved = true;
        } else if (next.canMergeWith(current)) {
          if (this.checkingAvailableMoves) {
            return true;
          }
          let value = next.mergeWith(current);
          this.gameState.score += value;
          this.tiles[r][c] = null;
          moved = true;
          break;
        } else {
          break;
        }
      }
    }
    if (moved) {
      this.addNewNumber();
      this.update();
      if(this.callOnMove.length > 0){
      this.callOnMove.forEach(x=>x(this.gameState));
    }}

    this.clearMerged();
    return moved;
  }
  onMove(callback) {
    this.callOnMove.push(callback);
  }
  onWin(callback) {
    this.callOnWin.push(callback);
  }
  onLose(callback) {
    this.callOnLose.push(callback);
  }
  getGameState() {
    return this.gameState;
  }

  clearMerged() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j] != null) {
          this.tiles[i][j].setMerged(false);
        }
      }
    }
  }

  addNewNumber() {
    let pos = Math.floor(Math.random() * this.size * this.size);
    let col, row;
    do {
      pos = (pos + 1) % (this.size * this.size);
      row = Math.floor(pos / this.size);
      col = pos % this.size;
    } while (this.tiles[row][col] != null);
    let value = Math.random() < 0.9 ? 2 : 4;
    this.tiles[row][col] = new Tile(value);
  }

  makeNewArray(w,h,val){
    var arr = [];
    for (let i = 0; i < h; i++) {
      arr[i] = [];
      for (let j = 0; j < w; j++) {
          arr[i][j] = val;
      }
    }
    return arr;
  }
  
  makeArray(w, h, val) {
    let index = 0;
    var arr = [];
    for (let i = 0; i < h; i++) {
      arr[i] = [];
      for (let j = 0; j < w; j++) {
        if(this.gameState.board[index]==0){
          arr[i][j] = val;
        }else{
        arr[i][j] = new Tile(this.gameState.board[index]);
        }
        index++;
      }
    }
    return arr;
  }
  update() {
    let arr = [].concat.apply([],this.tiles);
    this.gameState.board = arr.map(x => {
      return x == null ? 0 : x.value;
    });
    if (this.gameState.board.some(x => x === 2048 )) {
      if(this.callOnWin.length > 0){
      this.callOnWin.forEach(x=>x(this.gameState))
      }
      this.gameState.won = true;
    }
    if(!this.movesAvailable()){
      this.gameState.over = true;
      if(this.callOnLose.length >0){
      this.callOnLose.forEach(x=>x(this.gameState));
    }}
  }
  

  movesAvailable() {
    this.checkingAvailableMoves = true;
    let hasMoves =
      this.move("left") ||
      this.move("right") ||
      this.move("up") ||
      this.move("down");
    this.checkingAvailableMoves = false;
    return hasMoves;
  }
}

class Tile {
  constructor(value) {
    this.value = value;
    this.merged = false;
  }

  setMerged(merged) {
    this.merged = merged;
  }

  canMergeWith(other) {
    return (
      !this.merged &&
      other != null &&
      !other.merged &&
      this.value == other.value
    );
  }
  mergeWith(other) {
    if (this.canMergeWith(other)) {
      this.value += other.value;
      this.merged = true;
      return this.value;
    }
    return -1;
  }
}
  