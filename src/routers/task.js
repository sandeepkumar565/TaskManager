const express = require('express');
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

const app = express();
const router = new express.Router();

router.post('/tasks', auth, async(req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send('Done!');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/tasks', auth, async(req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    } catch (err) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOp = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOp)
        return res.status(400).send('Invalid updates')

    try {
        const task = await Task.findone({ _id: req.params.id, owner: req.user._id });

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task)
            return res.status(404).send('Task not found');
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task)
            return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;