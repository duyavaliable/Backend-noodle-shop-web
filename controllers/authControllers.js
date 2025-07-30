const userModel = require('../models/User');

const authControllers = {
    //Dang nhap user
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            //xac thuc dau vao 
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            //tim user theo username va kiem tra password
            const user = await userModel.findByUsername(username); 
            if (!user || password !== user.password) {
                return res.status(401).json({ message: 'Invalid login information' });
            }   

            // Here you would typically generate a token and send it back 
            res.status(200).json({ message: 'Login successful', userId: user.id, username: user.username, role: user.role, email: user.email });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //Dang ky user moi
    SignUpUser: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            //xac thuc dau vao
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, password, and email are required' });
            }

            //kiem tra xem username da ton tai chua
            const existingUser = await userModel.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }

            //kiem tra xem email da ton tai chua
            const existingEmail = await userModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            

            //tao user moi
            const newUserId = await userModel.create({ username, password, email });
            res.status(201).json({ message: 'User created successfully', userId: newUserId });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //Dang ky nhan vien
    SignUpStaff: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            //xac thuc dau vao
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, password, and email are required' });
            }

            //kiem tra xem username da ton tai chua
            const existingUser = await userModel.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }

            //kiem tra xem email da ton tai chua
            const existingEmail = await userModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            //tao user moi
            const newUserId = await userModel.create({ username, password, email, role: 'staff' });
            res.status(201).json({ message: 'User created successfully', userId: newUserId });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //Dang ky admin
    SignUpAdmin: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            //xac thuc dau vao
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, password, and email are required' });
            }

            //kiem tra xem username da ton tai chua
            const existingUser = await userModel.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }

            //kiem tra xem email da ton tai chua
            const existingEmail = await userModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            //tao user moi
            const newUserId = await userModel.create({ username, password, email, role: 'admin' });
            res.status(201).json({ message: 'User created successfully', userId: newUserId });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const {username, email, phone_number} = req.body;

            if (!username || !email) {
                return res.status(400).json({ error: 'Username and email are required' });
            }
    
            // Update user in the database
            const updated = await userModel.update(id, { username, email, phone_number });
            if (updated) {
                res.status(200).json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found or no changes made' });
            }
        } catch (error) {
            console.error('Error in updateUser controller:', error);
            res.status(500).json({ error: 'Error updating user' });
        }
    },
    //lay thong tin user
    getUserInfo: async (req, res) => {
        try {
            const { id } = req.params;

            // Find user by ID
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error in getUserInfo controller:', error);
            res.status(500).json({ error: 'Error getting user information' });
        }
    }
};

module.exports = authControllers;