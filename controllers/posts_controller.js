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
    async addPreference(req, res) {
        const { dbConnection } = require('../db_connection');
        const vacationPreferences = require('../data/vacation_preferences.json');
        const { access_code, start_date, end_date, location, type_of_vacation } = req.body;

        try {
            const connection = await dbConnection.createConnection();
            const [users] = await connection.execute('SELECT user_id FROM tbl_26_users WHERE access_code = ?', [access_code]);
            if (users.length === 0) {
                connection.end();
                return res.status(400).json({ success: false, message: 'Invalid access code' });
            }

            const user_id = users[0].user_id;

            if (!vacationPreferences.locations.includes(location)) {
                connection.end();
                return res.status(400).json({ success: false, message: 'Invalid location' });
            }

            if (!vacationPreferences.vacation_types.includes(type_of_vacation)) {
                connection.end();
                return res.status(400).json({ success: false, message: 'Invalid vacation type' });
            }

            const [result] = await connection.execute(
                'INSERT INTO tbl_26_posts (user_id, start_date, end_date, location, type_of_vacation) VALUES (?, ?, ?, ?, ?)',
                [user_id, start_date, end_date, location, type_of_vacation]
            );
            connection.end();

            res.json({ success: true, message: 'Post inserted successfully', post_id: result.insertId });
        } catch (error) {
            console.error('Error inserting post:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};