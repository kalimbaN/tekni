const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const AuthService = {
  async register(data) {
    const existingUser = await User.findByEmail(data.email);
    if (existingUser) throw new Error('User already exists');

    const hashed = await hashPassword(data.password);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
    });

    return user;
  },

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = generateToken({ id: user.id });

    return { user, token };
  },
};

module.exports = AuthService;