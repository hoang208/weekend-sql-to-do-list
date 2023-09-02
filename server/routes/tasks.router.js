const express = require('express');
const tasksRouter = express.Router();
const pool = require('../modules/pool.js');
// DB CONNECTION

//GET
tasksRouter.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks" ORDER BY "id" DESC';
        
    pool.query(queryText).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log('error getting tasks', error);
        res.sendStatus(500);
    })
});

// POST
tasksRouter.post('/',  (req, res) => {
    let newTask = req.body;
    let task = req.body.task;
    let isComplete = req.body.isComplete;
    let dateAdded = req.body.task.dateAdded;
    let timeAdded = req.body.task.timeAdded;
    let dateCompleted = req.body.task.dateCompleted;
    let timeCompleted = req.body.task.timeCompleted

    console.log(`Adding task`, newTask);
  
    let queryText = `INSERT INTO "tasks" ("task", "isComplete", "dateAdded", "timeAdded", "dateComplered", "timeComplered")
                     VALUES ($1, $2, $3, $4, $5, $6);`;

    pool.query(queryText, [task,isComplete, dateAdded, timeAdded, dateCompleted, timeCompleted])
      .then(result => {
        res.sendStatus(201);
      }).catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
      });
  })

//PUT
tasksRouter.put('/:id', (req, res) => {
  let idToUpdate = req.params.id;
  let newDateCompleted = req.body.dateCompleted;
  let newTimeCompleted = req.body.timeCompleted;

  console.log(newDateCompleted)

  let mySqlQuery = `
  UPDATE "tasks" SET "isComplete" = true, "dateCompleted" = $2, "timeCompleted" = $3 WHERE id = $1;
  `;

  console.log (mySqlQuery)

  pool.query(mySqlQuery, [idToUpdate, newDateCompleted, newTimeCompleted])
      .then(response => {
              console.log("Update request successful", idToUpdate);
              res.sendStatus(200);
      }).catch(error => {
          console.log(`Update request failed: ${idToUpdate}`, error);
          res.sendStatus(500);
      })
});

//DELETE

tasksRouter.delete('/:id', (req, res) => {
  let idToDelete = req.params.id;

  let mySqlQuery = `
  DELETE FROM "tasks" WHERE id = $1;
  `
  pool.query(mySqlQuery, [idToDelete])
      .then(response => {
              console.log("delete request successful", idToDelete);
              res.sendStatus(202);
      }).catch(error => {
          console.log(`delete request failed: ${idToDelete}`, error);
          res.sendStatus(500);
      })
});

module.exports = tasksRouter;