exports.usersController = {
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
    }};
