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
    async calculateVacationResults() {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const [members] = await connection.execute('SELECT * FROM tbl_22_vacations');
            connection.end();
            const allPreferencesFilled =  members.every(member => member.place && member.vacationType && member.startDate && member.endDate);
            console.log('Members:', members);
            if (!allPreferencesFilled && members.length != 5) {
                return res.status(400).json({ success: false, message: "We have to wait for everyone's preferences." });
            }
            const validateDate = (date) => {
                return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
            };
    
            const invalidDates = members.filter(member => !validateDate(member.start_date.toISOString().split('T')[0]) || !validateDate(member.end_date.toISOString().split('T')[0]));
            if (invalidDates.length > 0) {
                console.log('Invalid Date Entries:', invalidDates);
                return res.status(400).json({ success: false, message: "Invalid date values provided." });
            }
            const placeCount = {};
            members.forEach(member => {
                if (member.place) {
                    if (placeCount[member.place]) {
                        placeCount[member.place]++;
                    } else {
                        placeCount[member.place] = 1;
                    }
                }
            });
            const places = Object.keys(placeCount);
            let chosenplace;
            if (places.length > 0) {
                chosenplace = places.reduce((a, b) => placeCount[a] > placeCount[b] ? a : b);
            } else {
                members.sort((a, b) => a.vacation_code - b.vacation_code);
                chosenplace = members[0].place;
            }
            const typeCount = {};
            members.forEach(member => {
                if (member.vacationType) {
                    if (typeCount[member.vacationType]) {
                        typeCount[member.vacationType]++;
                    } else {
                        typeCount[member.vacationType] = 1;
                    }
                }
            });
            const vacationTypes = Object.keys(typeCount);
            let chosenVacationType;
            if (vacationTypes.length > 0) {
                chosenVacationType = vacationTypes.reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);
            } else {
                chosenVacationType = members[0].vacationType;
            }
            const startDates = members.map(member => new Date(member.start_date));
        const endDates = members.map(member => new Date(member.end_date));
        let startDate = new Date(Math.max(...startDates));
        let endDate = new Date(Math.min(...endDates));
        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "Invalid date range." });
        }
        startDate = startDate.toISOString().split('T')[0];
        endDate = endDate.toISOString().split('T')[0];
            res.json({
                success: true,
                place: chosenplace,
                vacationType: chosenVacationType,
                startDate: startDate,
                endDate: endDate
            });
        } catch (error) {
            console.error('Error fetching vacations:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};
