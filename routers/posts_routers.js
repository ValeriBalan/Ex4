const { Router } = require('express');
const { posts_controller } = require('../controllers/posts_controller.js');

const postsRouter = new Router();
postsRouter.get('/getAllPosts', posts_controller.getPosts);
postsRouter.post('/updatePreference', posts_controller.updatePreference);
postsRouter.post('/addPreference', posts_controller.addPreference);
postsRouter.post('/calculatePreferences', posts_controller.calculateVacationResults);

module.exports = { postsRouter };