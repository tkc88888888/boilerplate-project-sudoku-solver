'use strict';

module.exports = function (app) {
  const SudokuSolver = require('../controllers/sudoku-solver.js');
  let solver = new SudokuSolver();
  const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
  

  app.route('/api/check')
    .post((req, res) => {
      //coordinate and value check
      if (!req.body.puzzle ||  !req.body.value || !req.body.coordinate){
        console.log({ error: "Required field(s) missing" });
        return res.json({ error: "Required field(s) missing" });
      } else {
        //console.log("test");
        //console.log(req.body.puzzle);
        let validateresponse = solver.validate(req.body.puzzle);

        if (validateresponse.hasOwnProperty("error")){
          console.log("validateresponse");
          console.log(validateresponse);
          return res.json(validateresponse);
        } else if(!req.body.value.match(/^[1-9]$/)){
          console.log({"error":"Invalid value"});
          return res.json({"error":"Invalid value"})
        } else if(!req.body.coordinate.match(/^[ABCDEFGHI][1-9]$/i)){
          console.log({"error":"Invalid coordinate"});
          return res.json({"error":"Invalid coordinate"})
        } else {

          var rows = "ABCDEFGHI".split("");
          let row = rows.indexOf(req.body.coordinate[0]);
          let column = parseInt(req.body.coordinate[1]) - 1;
          //console.log(typeof row);
          //console.log(typeof column);


          let conflict = [];
            
          let rowOK = solver.checkRowPlacement(req.body.puzzle, row, column, req.body.value);
          if (!rowOK){
            conflict.push('row');
            //console.log("!rowOK");
            //console.log(conflict);
          }
          let colOK = solver.checkColPlacement(req.body.puzzle, row, column, req.body.value);
          if (!colOK){
            conflict.push('column');
            //console.log("!colOK");
            //console.log(conflict);
          }
          let regionOK = solver.checkRegionPlacement(req.body.puzzle, row, column, req.body.value);
          if (!regionOK){
            conflict.push('region');
           // console.log("!regionOK");
            //console.log(conflict);
          }
          if (!conflict.length){
            //console.log({valid :true});
            return res.json({valid :true})
          } else {
            //console.log({valid :true, conflict});
            return res.json({valid :false, conflict})
          };
        };
      };
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      //solve textbox string
      if (!req.body.puzzle){
          console.log({ error: "Required field missing" });
          return res.json({ error: "Required field missing" });
      } else {
        let validateresponse = solver.validate(req.body.puzzle);
        if (validateresponse.hasOwnProperty("error")){
          console.log(validateresponse);
          return res.json(validateresponse);
        } else {
          let solveresponse = solver.solve(req.body.puzzle);
          if (solveresponse){
            console.log({solution :solveresponse});
            return res.json({solution :solveresponse})
          } else {
            console.log({error: "Puzzle cannot be solved" });
            return res.json({error: "Puzzle cannot be solved" });
          };
        };
      };
    });
};
