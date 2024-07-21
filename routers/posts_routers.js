const express = require('express');
const postsRouter = express.Router();
const posts_controller = require('../controllers/posts_controller');

postsRouter.get('/getAllPosts', posts_controller.getPosts);
postsRouter.post('/updatePreference', posts_controller.updatePreference);
postsRouter.post('/addPreference', posts_controller.addPreference);
postsRouter.get('/calculateVacationResults', async (req, res) => {
    const result = await posts_controller.calculateVacationResults();
    res.json(result);
});
module.exports = { postsRouter };