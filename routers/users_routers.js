const { Router } = require('express');
const { users_controller } = require('../controllers/users_controller.js');

const usersRouter = new Router();
usersRouter.get('/', users_controller.getUser);
usersRouter.post('/', users_controller.addUser);
usersRouter.get('/', users_controller.generateUniqueAccessCode);
usersRouter.get('/', users_controller.generateAccessCode);

module.exports =  {usersRouter} ;