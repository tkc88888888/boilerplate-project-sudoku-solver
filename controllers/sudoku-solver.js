var regex = /^[0-9.]*$/;
/*
var textBox = document.querySelectorAll('#text-input');
var solveButton = document.querySelectorAll('#solve-button');
var coord = document.querySelectorAll('#coord');
var val = document.querySelectorAll('#val');
var checkButton = document.querySelectorAll('#check-button');
var error = document.querySelectorAll('#error');
*/


class SudokuSolver {
  

  validate(puzzleString) {
    if (!regex.test(puzzleString)){
      console.log('{ error: "Invalid characters in puzzle" }');
      return ({ error: "Invalid characters in puzzle" });
    }
    else if (puzzleString.split('').length != 81 ){
      console.log('{ error: "Expected puzzle to be 81 characters long" }');
      return ({ error: "Expected puzzle to be 81 characters long" });
    } else {
      console.log("validate true");
      return (true);
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzlelist = puzzleString.split('');
    let rowcol = row * 9 + column ;
    for (let i = row * 9 ; i <  row * 9 + 9; i++){
      if (i != rowcol && puzzlelist[i] == value){
        //console.log(value);
        return false;
      };
    };
    return true;
  };

  checkColPlacement(puzzleString, row, column, value) {
    let puzzlelist = puzzleString.split('');
    let rowcol = row * 9 + column ;

    for (let i = 0 ; i < 9; i++){
      if (i * 9 + column != rowcol && puzzlelist[i * 9 + column] == value){
        //console.log(value);
        return false;
      };
    };
    return true;
  };

  checkRegionPlacement(puzzleString, row, column, value) {
    let puzzlelist = puzzleString.split('');
    let rowcol = row * 9 + column ;

    let startRow = Math.floor(row / 3) * 3;
    let startColumn = Math.floor(column / 3) * 3;
    for (let i = startRow ; i < startRow + 3; i++){
      for (let j = startColumn; j < startColumn + 3; j++){
        if (i * 9 + j != rowcol && puzzlelist[i * 9 + j] == value){
          //console.log(value);
          return false;
        };
      };
    };
    return true;
  }

  solve(puzzleString) {
    /*
    if (!this.validate(puzzleString).hasOwnProperty("error")){
      console.log("!this.validate(puzzleString)");
      return false;    
    };
    */
    let puzzlelist = puzzleString.split('');
   
    
    let n = puzzlelist.indexOf('.');
    if (n == -1){
      console.log("puzzleString");
      console.log(puzzleString);
      return puzzleString;
    };
    for (n=n ; n < puzzlelist.length; n++){
      //console.log(puzzleString);
      if (puzzlelist[n] != '.'){
        continue;
      }
      for (let i = 1 ; i < 10; i++){
        //console.log("i");
        //console.log(i);
        let row = Math.floor(n / 9);
        let column = Math.floor(n % 9);
        //console.log("n,row,column:"+n+' '+row+' '+column);
        if (this.checkRowPlacement(puzzleString, row, column, i) && 
         this.checkColPlacement(puzzleString, row, column, i) && 
         this.checkRegionPlacement(puzzleString, row, column, i)){
          puzzlelist[n] = i;
          let updatedString = this.solve(puzzlelist.join(''));
          if (updatedString){
            //console.log("updatedString");
            return updatedString;
          } else {
            //console.log("puzzlelist[n] = '.'");
            puzzlelist[n] = '.';
          };
        };
      };
      //console.log("for loop 0-9 tried, no solution");
      return false;
    }
  }
}
module.exports = SudokuSolver;

