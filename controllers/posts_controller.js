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
        const { fetchUser } = users_controller;
        const vacationPreferences = require('../data/vacation_preferences.json');
        const { user_name, access_code, start_date, end_date, location, type_of_vacation } = req.body;

        if (!user_name || !access_code || !start_date || !end_date || !location || !type_of_vacation) {
            console.log(req.body);
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays >= 7) {
            return res.status(400).json({ success: false, message: 'Vacation period should be less than 7 days' });
        }
        
        try {
            const connection = await dbConnection.createConnection();
            const [users] = await fetchUser(user_name, access_code);
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

            const query = `UPDATE tbl_26_posts
                           SET start_date = ?, end_date = ?, location = ?, type_of_vacation = ?
                           WHERE access_code = ?`;
            const values = [start_date, end_date, location, type_of_vacation, access_code];
            console.log(values);
            const [result] = await connection.execute(query, values);
            connection.end();

            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Preference details updated successfully' });
            } else {
                console.error('No preference found for the user:', user_name);
                res.status(404).json({ success: false, message: 'No preference found for the user' });
            }
        } catch (error) {
            console.error('Error updating preference:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    
};
