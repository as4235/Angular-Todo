const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');  // refering the mongoose connection we made in mongoose.js
const { List, Task } = require('./db/models');  // refering the location of each database tables

// adding this middleware code to avoid CORS error
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const bodyParser = require('body-parser');  // to initialize the body-parser
app.use(bodyParser.json());     // Load middleware
 
app.use(express.urlencoded({ extended: true }));  

/* List Routes*/
app.get('/Lists', (req, res) => {   // get all the tasks
    List.find({}).then((List) => {        // ({}) contains the condition. Here we have to show all so no condition 
        res.send(List);
    })
});

app.post('/lists', (req, res) => {   // create a task
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((List) => {  // we just need to pass a parameter. then('List') could be anything
        res.send(List);
    })
})

app.patch('/lists/:id', (req, res) => {   // updates a task
    List.findByIdAndUpdate({ _id: req.params.id }, {  // find by the id that is obtained by req.params.id (/id in URL)
        $set: req.body          // $set is mongoDB function. Update the List with what you got from req.body
    }).then(() => {
        res.sendStatus(200);       // this status gives a 'OK' reply
    });
});

/* in patch, you've given a try and catch. But in delete if you put .then outside app.delete, you're only giving
try and not catch. So put .then inside app.delete */
app.delete('/lists/:id', (req, res) => {   // to delete a list
    List.deleteOne({ _id: req.params.id }).then(() => {
        res.sendStatus(200);
    });
});

/* Task routes */
app.get('/lists/:listId/tasks', (req, res) => { // show all tasks under a list
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);  
    })
});

app.get('/lsits/:listId/tasks/taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((singletask) => {
        res.send(singletask)
    });
});

app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId  // problem
    });
    newTask.save().then((newTask) => {
        res.send(newTask);
    });
});

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findByIdAndUpdate({ 
        _id: req.params.taskId,
        _listId: req.params.listId       
    }, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated Successfully'}); 
    })
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.deleteOne({ 
        _id: req.params.taskId,
        _listId: req.params.listId   
    }).then(() => {
        res.sendStatus(200);
    })
});


app.listen(3000, () => {
    console.log('express works')
});