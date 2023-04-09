const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { body, validationResult } = require('express-validator');
const {Op} = require("sequelize");

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                where: {
                    deletedAt: null,
                    role_id: {
                        [Op.ne]: 1
                    }
                },
                attributes: ['id', 'name', 'email', 'role_id']
            });
            res.status(200).json({ users });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id,
                    deletedAt: null,
                    role_id: {
                        [Op.ne]: 1
                    }
                }
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found or You are not Authorized to access it' });
            }
            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static async createUser(req, res) {
        try {
            await body('name').notEmpty().withMessage('Name is required').run(req);
            await body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').run(req);
            await body('password').notEmpty().withMessage('Password is required').run(req);
            await body('role_id').notEmpty().withMessage('Role ID is required').isInt().withMessage('Invalid role ID').run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);

            const user = await User.create({
                ...req.body,
                is_active: 1
            });

            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateUser(req, res) {
        const { name, email, password, role_id, is_active, phone_number } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) updates.password = password;
        if (role_id) updates.role_id = role_id;
        if (is_active) updates.is_active = is_active;
        if (phone_number) updates.phone_number = phone_number;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'At least one field is required to update.' });
        }
        // Check if authenticated user is authorized to update the user with the specified id
        if (parseInt(req.user.id) !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        try {
            const [updatedRowsCount] = await User.update(
                updates,
                { where: { id: req.params.id , role_id: 1 , deletedAt: null} }
            );
            if (updatedRowsCount > 0) {
                const updatedUser = await User.findOne({ where: { id: req.params.id } });
                return res.status(200).json(updatedUser);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static async deleteUser(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        try {
            const user = await User.findOne({
                where: {
                    id,
                    role_id: 2,
                    deletedAt: null
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.update({ deletedAt: new Date() });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static generateToken(user) {
        return jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });
    }

    static async login(req, res) {
        const { email, password } = req.body;

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Both email and password are required' });
        }

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const payload = { id: user.id };
            const token = jwt.sign(payload, config.jwtSecret);
            return res.json({ token });
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async register(req, res) {
        const { name, email, password, role_id } = req.body;

        // Check if required parameters are present
        if (!name || !email || !password || !role_id) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        try {
            // Check if user already exists
            const user = await User.findOne({ where: { email: email } });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword, is_active: 1, role_id: role_id});

            return res.json(newUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = UserController;
