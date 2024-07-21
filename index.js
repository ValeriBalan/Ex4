require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8081;
const { usersRouter } = require('./routers/users_routers.js');
const { postsRouter } = require('./routers/posts_routers.js');
const vacation_preferences = require('./data/vacation_preferences.json');

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
app.get("/api/vacation_preferences", (req,res) =>{
    res.json(vacation_preferences);
    console.log(vacation_preferences);
});
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
    console.error('Path not found:', req.path);
    res.status(400).send('something is broken!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/calculate-vacation-results', async (req, res) => {
    const result = await posts_controller.calculateVacationResults();
    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});