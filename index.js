require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { usersRouter } = require('./routers/users_routers.js');
const { postsRouter } = require('./routers/posts_routers.js');
const vacation_preferences = require('./data/vacation_preferences.json');

const port = process.env.PORT || 8081;
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE",
        'Content-Type': 'application/json'
    });
    next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the User Management API');
});

app.get("/api/vacation_preferences", (req, res) => {
    res.json(vacation_preferences);
});

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
    console.error('Path not found:', req.path);
    res.status(404).send('Path not found!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});