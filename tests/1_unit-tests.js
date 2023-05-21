const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();
const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;


var regex = /^[0-9.]*$/;

var rows = "ABCDEFGHI";


let badstr = puzzles[0][0];

suite('Unit Tests', function() {
  //Logic handles a valid puzzle string of 81 characters
  test('81 characters', function(done) {
    for (let i=0; i < puzzles.length; i++){
      assert.lengthOf(puzzles[i][0], 81);
    };
    done();
  });

  //Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('invalid characters', function(done) {
    assert.deepEqual(solver.validate(regex.test(badstr.replace('.', 'a'))), { "error": "Invalid characters in puzzle" });
    done();
  });

  //Logic handles a puzzle string that is not 81 characters in length
  test('not 81 characters', function(done) {
    assert.deepEqual(solver.validate(badstr.replace('.', '..')), { "error": "Expected puzzle to be 81 characters long" });
    done();
  });

  //Logic handles a valid row placement
  test('valid row placement', function(done) {
    assert.isTrue(solver.checkRowPlacement(puzzles[0][0], 0, 1, '3'));
    done();
  });
  //Logic handles an invalid row placement
  test('invalid row placement', function(done) {
    assert.isFalse(solver.checkRowPlacement(puzzles[0][0], 0, 3, '2'));
    done();
  });
  //Logic handles a valid column placement
  test('valid column placement', function(done) {
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], 0, 1, '8'));
    done();
  });
  //Logic handles an invalid column placement
  test('invalid column placement', function(done) {
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], 0, 3, '6'));
    done();
  });
  //Logic handles a valid region (3x3 grid) placement
  test('valid region placement', function(done) {
    assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], 0, 1, '7'));
    done();
  });
  //Logic handles an invalid region (3x3 grid) placement
  test('invalid region placement', function(done) {
    assert.isFalse(solver.checkRegionPlacement(puzzles[0][0], 3, 0, '7'));
    done();
  });
  //Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', function(done) {
    assert.equal(solver.solve(puzzles[0][0]), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    done();
  });
  //Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', function(done) {
    assert.isFalse(solver.solve(badstr.replace('.', '..')));
    done();
  });
  //Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    assert.equal(solver.solve(badstr.replace('1', '.')), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    done();
  });
});