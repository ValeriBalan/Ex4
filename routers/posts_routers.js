const { Router } = require('express');
const router = express.Router();
const { posts_controller } = require('../controllers/posts_controller.js');

const postsRouter = new Router();
postsRouter.get('/getAllPosts', posts_controller.getPosts);
postsRouter.post('/updatePreference', posts_controller.updatePreference);
postsRouter.post('/addPreference', posts_controller.addPreference);
postsRouter.get('/calculate-vacation-results', async (req, res) => {
    const result = await posts_controller.calculateVacationResults();
    res.json(result);
});
module.exports = { postsRouter };