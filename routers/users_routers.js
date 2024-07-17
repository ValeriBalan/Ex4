const { Router } = require('express');
const { users_controller } = require('../controllers/users_controller.js');

const usersRouter = new Router();
usersRouter.get('/', users_controller.getUser);

module.exports = { usersRouter };