exports.users_controller = {
    async getUser(req, res) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const [users] = await connection.execute('SELECT * FROM tbl_26_users');
            connection.end();
            res.json({ success: true, users });
                
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    async fetchUser(user_id, access_code) {
        try {
            const connection = await dbConnection.createConnection();
            const [users] = await connection.execute('SELECT * FROM tbl_26_users WHERE user_id = ? AND access_code = ?', [user_id, access_code]);
            connection.end();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    async addUser(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        const { users_controller } = require('./users_controller');
        const { generateUniqueAccessCode } = users_controller;
        const { body } = req;
        try {
            let [accessCode] = await generateUniqueAccessCode(connection);
    
            const result = await connection.execute(
                `INSERT INTO tbl_26_users (user_name, user_password, access_code) 
                 VALUES (?, ?, ?)`,
                [body.user_name, body.user_password, accessCode]
            );
    
            connection.end();
            res.send(true);
        } catch (error) {
            console.error('Error inserting user:', error);
            res.status(500).send(false);
        }
    },
    async generateUniqueAccessCode(connection) {
        const { users_controller } = require('./users_controller');
        const { generateAccessCode } = users_controller;
        while (true) {
            const [accessCode] = await generateAccessCode();
    
            const [rows] = await connection.execute(
                `SELECT COUNT(*) AS count FROM tbl_26_users WHERE access_code = ?`,
                [accessCode]
            );
    
            if (rows[0].count === 0) {
                return accessCode; 
            }
        }
    },
    async generateAccessCode() {
        const randomString = Math.random().toString(36).substring(2, 10);
        return randomString;
    }
};

