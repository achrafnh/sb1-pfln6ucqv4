const LawyerModel = require('../models/lawyer.model');
const NotificationService = require('./notification.service');
const logger = require('../config/logger');

class LawyerService {
  static async createProfile(userId, profileData) {
    try {
      const existingProfile = await LawyerModel.findById(userId);
      if (existingProfile) {
        throw { status: 409, message: 'Profile already exists' };
      }

      const profileId = await LawyerModel.create({
        userId,
        ...profileData
      });

      return this.getProfile(userId);
    } catch (error) {
      logger.error('Error in createProfile service:', error);
      throw error;
    }
  }

  static async updateProfile(userId, profileData) {
    const existingProfile = await LawyerModel.findById(userId);
    if (!existingProfile) {
      throw { status: 404, message: 'Profile not found' };
    }

    await LawyerModel.updateProfile(userId, profileData);
    return this.getProfile(userId);
  }

  static async getProfile(userId) {
    const profile = await LawyerModel.findById(userId);
    if (!profile) {
      throw { status: 404, message: 'Profile not found' };
    }
    return profile;
  }

  static async searchLawyers(filters) {
    return LawyerModel.search(filters);
  }

  static async addSpecialties(userId, specialties) {
    const profile = await LawyerModel.findById(userId);
    if (!profile) {
      throw { status: 404, message: 'Profile not found' };
    }

    const currentSpecialties = JSON.parse(profile.primary_specialties || '[]');
    const updatedSpecialties = [...new Set([...currentSpecialties, ...specialties])];

    await LawyerModel.updateProfile(userId, {
      ...profile,
      primarySpecialties: updatedSpecialties
    });

    return { specialties: updatedSpecialties };
  }

  static async removeSpecialty(userId, specialtyId) {
    const profile = await LawyerModel.findById(userId);
    if (!profile) {
      throw { status: 404, message: 'Profile not found' };
    }

    const currentSpecialties = JSON.parse(profile.primary_specialties || '[]');
    const updatedSpecialties = currentSpecialties.filter(id => id !== specialtyId);

    await LawyerModel.updateProfile(userId, {
      ...profile,
      primarySpecialties: updatedSpecialties
    });
  }
}