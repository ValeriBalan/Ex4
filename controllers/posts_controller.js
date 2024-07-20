exports.posts_controller = {
    async getPosts(req, res) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const [posts] = await connection.execute('SELECT * FROM tbl_26_posts');
            connection.end();
            res.json({ success: true, posts });
                
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    async updatePreference(req, res) {
        const { dbConnection } = require('../db_connection');
        const { users_controller } = require('./users_controller');
        const { getUser } = users_controller;
        const { vacationType, location, startDate, endDate, user } = req.body;
        if (!vacationType || !location || !startDate || !endDate || !user) {
            return res.status(400).json({ success: false, message: 'Access code and updated values are required' });
        }
        try {
            const connection = await dbConnection.createConnection();
            const userInDatabase = await getUser(user.name, user.access_code);
             if (!userInDatabase) {
                 return res.status(404).json({ success: false, message: 'User not found in database' });
                  }
            if (user.length === 0) {
                connection.end();
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            const query = `
                UPDATE tbl_26_posts
                SET start_date = ?, end_date = ?, location = ?, vacationType = ?
                WHERE user_name = ?`;
            const values = [location,startDate, endDate,vacationType, user.name];
            const [result] = await connection.execute(query, values);
            connection.end();
            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Preference details updated successfully' });
            } else {
                res.status(404).json({ success: false, message: 'No preference found for the user' });
            }
        } catch (error) {
            console.error('Error updating preference:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};