const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
//*
suite('Functional Tests', () => {
  suite('Routing tests', () => {
    suite('POST request to /api/solve', () => {
      //Solve a puzzle with valid puzzle string: POST request to /api/solve
      //{"solution":"769235418851496372432178956174569283395842761628713549283657194516924837947381625"}
      test('Solve a puzzle with valid puzzle string', function(done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
            done();
          });
      });

      //Solve a puzzle with missing puzzle string: POST request to /api/solve
      //{ "error": "Required field missing" }
      test('Solve a puzzle with missing puzzle string', function(done) {
        chai
          .request(server)
          .post('/api/solve')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field missing");
            done();
          });
      });
      //Solve a puzzle with invalid characters: POST request to /api/solve
      //{ "error": "Invalid characters in puzzle" }
      test('Solve a puzzle with invalid characters', function(done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: "q.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      }); 
      //Solve a puzzle with incorrect length: POST request to /api/solve
      //{ "error": "Expected puzzle to be 81 characters long" }
      test('Solve a puzzle with incorrect length', function(done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
      }); 
      //Solve a puzzle that cannot be solved: POST request to /api/solve
      //{ "error": "Puzzle cannot be solved" }
      test('Solve a puzzle that cannot be solved', function(done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: "..98.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Puzzle cannot be solved");
            done();
          });
      }); 
    });

    suite('POST request to /api/check', () => {
      //Check a puzzle placement with all fields: POST request to /api/check
      //{"valid": true}
      test('Check a puzzle placement with all fields', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "7"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isTrue(res.body.valid);
            done();
          });
      }); 
      //Check a puzzle placement with single placement conflict: POST request to /api/check
      //{"valid":false,"conflict":["region"]}
      test('Check a puzzle placement with single placement conflict', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "2"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.include(res.body.conflict, "region");
            assert.lengthOf(res.body.conflict,  1);
            done();
          });
      });  
      //Check a puzzle placement with multiple placement conflicts: POST request to /api/check
      //{"valid":false,"conflict":["column","region"]}
      test('Check a puzzle placement with multiple placement conflicts', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A2",
            value: "4"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.include(res.body.conflict, "column");
            assert.include(res.body.conflict, "region");
            assert.lengthOf(res.body.conflict, 2);
            done();
          });
      }); 
      //Check a puzzle placement with all placement conflicts: POST request to /api/check
      //{"valid":false,"conflict":["row","column","region"]}
      test('Check a puzzle placement with all placement conflicts', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "1"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isFalse(res.body.valid);
            assert.include(res.body.conflict, "row");
            assert.include(res.body.conflict, "column");
            assert.include(res.body.conflict, "region");
            assert.lengthOf(res.body.conflict, 3);
            done();
          });
      }); 
      //Check a puzzle placement with missing required fields: POST request to /api/check
      //{ "error": "Required field missing" }
      test('Check a puzzle placement with missing required fields', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "q.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "",
              value: ""
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
      }); 
      //Check a puzzle placement with invalid characters: POST request to /api/check
      //{"error":"Invalid value"}
      test('Check a puzzle placement with invalid characters', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "d"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });     
      //Check a puzzle placement with incorrect length: POST request to /api/check
      //{"error":"Expected puzzle to be 81 characters long"}
      test('Check a puzzle placement with incorrect length', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...671...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "7"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
      });     
      //Check a puzzle placement with invalid placement coordinate: POST request to /api/check
      //{"error":"Invalid coordinate"}
      test('Check a puzzle placement with invalid placement coordinate', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "Z1",
              value: "3"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
      });    
      //Check a puzzle placement with invalid placement value: POST request to /api/check
      //{"error":"Invalid value"}
      test('Check a puzzle placement with invalid placement value', function(done) {
        chai
          .request(server)
          .post('/api/check')
          .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate: "A1",
              value: "666"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });       
    
    });  

  });
});
//*/
