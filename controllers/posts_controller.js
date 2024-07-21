
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
    },
    async addPreference(req, res) {
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

            const query =  `INSERT INTO tbl_26_posts ( access_code, start_date, end_date, location, type_of_vacation)
                            VALUES ( ?, ?, ?, ?, ?)`;
            const values = [ access_code, start_date, end_date, location, type_of_vacation];
            console.log(values);
            const [result] = await connection.execute(query, values);
            connection.end();

            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Preference details added successfully' });
            } else {
                console.error('Failed to add preference for the user:', user_name);
                res.status(404).json({ success: false, message: 'Failed to add preference for the user' });
            }
        } catch (error) {
            console.error('Error adding preference:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    async  calculateVacationResults() {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
    
            const [usersWithoutPreferences] = await connection.execute(`
                SELECT u.access_code 
                FROM tbl_26_users u 
                LEFT JOIN tbl_26_posts p ON u.access_code = p.access_code
                WHERE p.access_code IS NULL
            `);
    
            if (usersWithoutPreferences.length > 0) {
                return { success: false, message: "We have to wait for everyone's preferences." };
            }
            console.log(true);
        } catch (error) {
            console.error('Error calculating vacation results:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    }
};
