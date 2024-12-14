const { query } = require('../config/database');
const { CONSULTATION_STATUS } = require('../utils/constants');

class ConsultationModel {
  static async create(consultationData) {
    const sql = `
      INSERT INTO consultations (
        client_id, lawyer_id, description, 
        preferred_dates, preferred_contact_method, status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      consultationData.clientId,
      consultationData.lawyerId,
      consultationData.description,
      JSON.stringify(consultationData.preferredDates),
      consultationData.preferredContactMethod,
      CONSULTATION_STATUS.PENDING
    ]);
    
    return result.insertId;
  }

  static async findById(id) {
    const sql = `
      SELECT c.*, 
        JSON_OBJECT(
          'id', l.id,
          'firstName', l.first_name,
          'lastName', l.last_name,
          'email', l.email
        ) as lawyer,
        JSON_OBJECT(
          'id', cl.id,
          'firstName', cl.first_name,
          'lastName', cl.last_name,
          'email', cl.email
        ) as client
      FROM consultations c
      LEFT JOIN users l ON c.lawyer_id = l.id
      LEFT JOIN users cl ON c.client_id = cl.id
      WHERE c.id = ?
    `;
    
    const consultations = await query(sql, [id]);
    return consultations[0];
  }

  static async updateStatus(id, status) {
    const sql = `
      UPDATE consultations 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    return query(sql, [status, id]);
  }

  static async findByLawyer(lawyerId, filters = {}) {
    let sql = `
      SELECT c.*, 
        JSON_OBJECT(
          'id', cl.id,
          'firstName', cl.first_name,
          'lastName', cl.last_name,
          'email', cl.email
        ) as client
      FROM consultations c
      LEFT JOIN users cl ON c.client_id = cl.id
      WHERE c.lawyer_id = ?
    `;
    
    const params = [lawyerId];
    
    if (filters.status) {
      sql += ' AND c.status = ?';
      params.push(filters.status);
    }
    
    sql += ' ORDER BY c.created_at DESC';
    
    return query(sql, params);
  }
}