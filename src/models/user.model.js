const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const sql = `
      INSERT INTO users (
        email, password_hash, first_name, last_name,
        phone, role, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'active')
    `;
    
    const result = await query(sql, [
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.role
    ]);
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0];
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0];
  }

  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
    return query(sql, [id]);
  }
}