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
        const vacationPreferences = require('../data/vacation_preferences.json');
        const { user_id, access_code, start_date, end_date, location, type_of_vacation } = req.body;

        if (!user_id || !access_code || !start_date || !end_date || !location || !type_of_vacation) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        try {
            const connection = await dbConnection.createConnection();

            const [users] = await connection.execute('SELECT user_id FROM tbl_26_users WHERE user_id = ? AND access_code = ?', [user_id, access_code]);
            if (users.length === 0) {
                connection.end();
                return res.status(404).json({ success: false, message: 'User not found in database' });
            }

            if (!vacationPreferences.locations.includes(location)) {
                connection.end();
                return res.status(400).json({ success: false, message: 'Invalid location' });
            }

            if (!vacationPreferences.vacation_types.includes(type_of_vacation)) {
                connection.end();
                return res.status(400).json({ success: false, message: 'Invalid vacation type' });
            }
            console.log(req.body);
            const query = `UPDATE tbl_26_posts
                           SET start_date = ?, end_date = ?, location = ?, type_of_vacation = ?
                           WHERE user_id = ?`;
            const values = [user_id, start_date, end_date, location, type_of_vacation];
            console.log(query);
            console.log(values);

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