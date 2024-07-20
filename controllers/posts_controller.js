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
    async addPreference(req, res, values) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const query = `
                INSERT INTO tbl_22_vacations (user_id, start_date, end_date, location, vacationType)
                VALUES (?, ?, ?, ? ,?)
            `;
            const [result] = await connection.execute(query, values);
            connection.end();
            res.json({ success: true, message: 'Preference added successfully!' });
        } catch (error) {
            console.error('Error booking vacation:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};