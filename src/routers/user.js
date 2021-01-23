const express = require('express');
const User = require('../models/users')
const auth = require('../middleware/auth')
const app = express();
const router = new express.Router();

router.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send();
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCreds(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send();
    }
});

router.post('users/logout', auth, async(req, res) => {
    try {
        req.user.tokens.splice(req.user.tokens.indexOf(req.token), 1);
        await user.save();
        res.send();
    } catch (err) {
        res.status(500).send()
    }
});

router.post('users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await user.save();
        res.send();
    } catch (err) {
        res.status(500).send()
    }
});

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOp = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOp)
        return res.status(400).send('Invalid updates')

    try {
        const user = await User.findById(req.user._id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(user);
    } catch (err) {
        res.status(400).send();
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        await Task.deleteMany({ owner: req.user._id });
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
})

module.exports = router;