const { Router } = require('express');
const { posts_controller } = require('../controllers/posts_controller.js');

const postsRouter = new Router();
postsRouter.get('/getAllPosts', posts_controller.getPosts);
postsRouter.post('/updatePreference', posts_controller.updatePreference);
//usersRouter.get('/generateUniqueAccessCode', users_controller.generateUniqueAccessCode);
//usersRouter.get('/generateAccessCode', users_controller.generateAccessCode);
 ;
module.exports = { postsRouter };