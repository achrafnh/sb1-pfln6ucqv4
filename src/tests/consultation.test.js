const request = require('supertest');
const app = require('../server');
const { query } = require('../config/database');
const { generateToken } = require('../utils/auth.utils');
const { ROLES, CONSULTATION_STATUS } = require('../utils/constants');

describe('Consultation API', () => {
  let clientToken;
  let lawyerToken;
  let testLawyerId;
  let testClientId;

  beforeAll(async () => {
    // Create test users and generate tokens
    const lawyerResult = await query(
      'INSERT INTO users (email, role) VALUES (?, ?)',
      ['test.lawyer@example.com', ROLES.LAWYER]
    );
    testLawyerId = lawyerResult.insertId;
    lawyerToken = generateToken({ id: testLawyerId, role: ROLES.LAWYER });

    const clientResult = await query(
      'INSERT INTO users (email, role) VALUES (?, ?)',
      ['test.client@example.com', ROLES.CLIENT]
    );
    testClientId = clientResult.insertId;
    clientToken = generateToken({ id: testClientId, role: ROLES.CLIENT });
  });

  afterAll(async () => {
    // Clean up test data
    await query('DELETE FROM consultations WHERE client_id = ?', [testClientId]);
    await query('DELETE FROM users WHERE id IN (?, ?)', [testLawyerId, testClientId]);
  });

  describe('POST /api/consultations/request', () => {
    it('should create a consultation request', async () => {
      const response = await request(app)
        .post('/api/consultations/request')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          lawyerId: testLawyerId,
          description: 'Test consultation request',
          preferredDates: [new Date(Date.now() + 86400000).toISOString()],
          preferredContactMethod: 'email'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('consultationId');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/consultations/request')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PATCH /api/consultations/:id/status', () => {
    let consultationId;

    beforeEach(async () => {
      const result = await query(
        `INSERT INTO consultations 
         (client_id, lawyer_id, status, description) 
         VALUES (?, ?, ?, ?)`,
        [testClientId, testLawyerId, CONSULTATION_STATUS.PENDING, 'Test']
      );
      consultationId = result.insertId;
    });

    it('should update consultation status', async () => {
      const response = await request(app)
        .patch(`/api/consultations/${consultationId}/status`)
        .set('Authorization', `Bearer ${lawyerToken}`)
        .send({ status: CONSULTATION_STATUS.SCHEDULED });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});