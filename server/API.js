const express = require('express');
const router = express.Router();
const { db , Friends } = require('../db/index.js');

router.put('/friends/:id', async (req,res,next) => {
    const friendToEditArr = await Friends.findAll({
        where: {
            id: req.params.id
        }
    });
    const friendToEdit = friendToEditArr[0];
    friendToEdit.rating = req.body.rating;
    await friendToEdit.save();
    await db.sync();
    res.json({ 'rating': friendToEdit.rating});
});

router.delete('/friends/:id', async (req,res,next) => {
    console.log('made it to delete')
    const friendToDeleteArr = await Friends.findAll({
        where: {
            id: req.params.id
        }
    });
    const friendToDelete = friendToDeleteArr[0];
    await friendToDelete.destroy();
    await db.sync();
    res.json({});
});

router.post('/friends', async (req,res,next) => {
    console.log('request made it!');
    await Friends.create({ name: req.body.newFriend, rating: 5});
    await db.sync();
    res.json({});
});


router.get('/friends', async(req,res,next) => {
    res.json(await Friends.findAll());
});

module.exports = router;