const { query } = require('../config/database');

class LawyerModel {
  static async create(lawyerData) {
    const sql = `
      INSERT INTO lawyer_profiles (
        user_id, bar_number, bar_association,
        law_firm_name, consultation_price,
        first_consultation_free, primary_specialties
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      lawyerData.userId,
      lawyerData.barNumber,
      lawyerData.barAssociation,
      lawyerData.lawFirmName,
      lawyerData.consultationPrice,
      lawyerData.firstConsultationFree,
      JSON.stringify(lawyerData.primarySpecialties)
    ]);
    
    return result.insertId;
  }

  static async findById(id) {
    const sql = `
      SELECT lp.*, 
        JSON_OBJECT(
          'id', u.id,
          'firstName', u.first_name,
          'lastName', u.last_name,
          'email', u.email
        ) as user_details
      FROM lawyer_profiles lp
      LEFT JOIN users u ON lp.user_id = u.id
      WHERE lp.user_id = ?
    `;
    
    const lawyers = await query(sql, [id]);
    return lawyers[0];
  }

  static async search(filters = {}) {
    let sql = `
      SELECT lp.*, 
        JSON_OBJECT(
          'id', u.id,
          'firstName', u.first_name,
          'lastName', u.last_name
        ) as user_details
      FROM lawyer_profiles lp
      LEFT JOIN users u ON lp.user_id = u.id
      WHERE u.status = 'active'
    `;
    
    const params = [];
    
    if (filters.specialty) {
      sql += ' AND JSON_CONTAINS(lp.primary_specialties, ?)';
      params.push(JSON.stringify(filters.specialty));
    }
    
    if (filters.maxPrice) {
      sql += ' AND lp.consultation_price <= ?';
      params.push(filters.maxPrice);
    }
    
    sql += ' ORDER BY lp.average_rating DESC';
    
    return query(sql, params);
  }

  static async updateProfile(userId, profileData) {
    const sql = `
      UPDATE lawyer_profiles
      SET 
        bar_association = ?,
        law_firm_name = ?,
        consultation_price = ?,
        first_consultation_free = ?,
        primary_specialties = ?
      WHERE user_id = ?
    `;
    
    return query(sql, [
      profileData.barAssociation,
      profileData.lawFirmName,
      profileData.consultationPrice,
      profileData.firstConsultationFree,
      JSON.stringify(profileData.primarySpecialties),
      userId
    ]);
  }
}