const { Router } = require('express');
const { posts_controller } = require('../controllers/posts_controller.js');

const PostsRouter = new Router();
PostsRouter.get('/getAllPosts', posts_controller.getPosts);
//usersRouter.post('/add', users_controller.addUser);
//usersRouter.get('/generateUniqueAccessCode', users_controller.generateUniqueAccessCode);
//usersRouter.get('/generateAccessCode', users_controller.generateAccessCode);

module.exports =  {PostsRouter} ;