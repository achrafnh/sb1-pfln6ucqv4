const { query } = require('../../config/database');

async function up() {
  // Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(20),
      role VARCHAR(50) CHECK (role IN ('lawyer', 'client', 'admin')),
      verified BOOLEAN DEFAULT FALSE,
      verification_token VARCHAR(255),
      reset_password_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP,
      status VARCHAR(50) DEFAULT 'active'
    )
  `);

  // Lawyer profiles table
  await query(`
    CREATE TABLE IF NOT EXISTS lawyer_profiles (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id),
      bar_number VARCHAR(50) UNIQUE,
      bar_association VARCHAR(255),
      law_firm_name VARCHAR(255),
      total_cases INT DEFAULT 0,
      average_rating DECIMAL(3,2) DEFAULT 0,
      total_reviews INT DEFAULT 0,
      consultation_price DECIMAL(10,2),
      first_consultation_free BOOLEAN DEFAULT FALSE,
      primary_specialties JSON,
      documents_verified BOOLEAN DEFAULT FALSE
    )
  `);

  // Consultations table
  await query(`
    CREATE TABLE IF NOT EXISTS consultations (
      id SERIAL PRIMARY KEY,
      client_id INT REFERENCES users(id),
      lawyer_id INT REFERENCES users(id),
      description TEXT,
      preferred_dates JSON,
      preferred_contact_method VARCHAR(50),
      status VARCHAR(50) CHECK (
        status IN ('pending', 'scheduled', 'completed', 'cancelled')
      ),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Reviews table
  await query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      lawyer_id INT REFERENCES users(id),
      client_id INT REFERENCES users(id),
      consultation_id INT REFERENCES consultations(id),
      rating INT CHECK (rating BETWEEN 1 AND 5),
      review_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function down() {
  await query('DROP TABLE IF EXISTS reviews');
  await query('DROP TABLE IF EXISTS consultations');
  await query('DROP TABLE IF EXISTS lawyer_profiles');
  await query('DROP TABLE IF EXISTS users');
}

module.exports = { up, down };