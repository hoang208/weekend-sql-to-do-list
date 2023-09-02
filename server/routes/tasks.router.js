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
    });
});

// POST
tasksRouter.post('/',  (req, res) => {
    let newTask = req.body;
    let task = req.body.task;
    let isComplete = req.body.isComplete

    console.log(`Adding task`, newTask);
  
    let queryText = `INSERT INTO "tasks" ("task", "isComplete")
                     VALUES ($1, $2);`;

    pool.query(queryText, [task,isComplete])
      .then(result => {
        res.sendStatus(201);
      })
      .catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
      });
  });

  module.exports = tasksRouter;