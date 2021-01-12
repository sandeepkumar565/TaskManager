const express = require('express');
require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post('/users', (req, res) => {
    //console.log(req.body, req.query);
    const user = new User(req.query);
    user.save().then(() => {
        res.status(201).send('Done!');
    }).catch((err) => {
        res.status(400).send();
        console.log(err);
    })
});

app.post('/tasks', (req, res) => {
    //console.log(req.body, req.query);
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send('Done!');
    }).catch((err) => {
        res.status(400).send();
        console.log(err);
    })
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((err) => {
        res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id).then((user) => {
        if (!user)
            return res.status(404).send('User not found');
        res.send(user);
    }).catch((err) => {
        res.status(500).send();
    });
});

app.get('/tasks', (req, res) => {
    Task.find({}).then((task) => {
        res.send(task);
    }).catch((err) => {
        res.status(500).send();
    });
});

app.get('/tasks/:id', (req, res) => {
    console.log(req.params.id);
    Task.findById(req.params.id).then((task) => {
        if (!task)
            return res.status(404).send('Task not found');
        res.send(task);
    }).catch((err) => {
        res.status(500).send();
    })
})

app.listen(port, () => {
    console.log('Server is up and listening!')
})