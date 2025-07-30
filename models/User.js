const db =  require('../config/db');

const userModel = {
    //Tim user theo id
    findById: async (id) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0]; // Return the first user found
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    //Tim user theo username
    findByUsername: async (username) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0]; // Return the first user found
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    //tim user theo email (kiem tra xem email da ton tai chua)
    findByEmail: async (email) => {
        try {
            const [rows] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0]; // Return the first user found
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    //Tao user moi
    create: async (userData) => {
        try {
            const { username, password, email, role = 'user' } = userData;
            const [result] = await db.pool.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, role]); //mat khau chua duoc ma hoa
            return result.insertId; // Return the ID of the newly created user
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    //cap nhat user
    update: async (id, userData) => {
        try {
            const { username, email, phone_number } = userData;
            const [result] = await db.pool.query('UPDATE users SET username = ?, email = ?, phone_number = ? WHERE id = ?', [username, email, phone_number, id]);
            return result.affectedRows > 0; 
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

}

module.exports = userModel;