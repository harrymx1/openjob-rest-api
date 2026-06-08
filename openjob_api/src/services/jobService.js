import jobModel from '../models/jobModel.js';

const jobService = {
  create: async (data, userId) => {
    return jobModel.create({ ...data, created_by: userId });
  },

  getAll: async (query) => {
    return jobModel.findAll(query);
  },

  getById: async (id) => {
    const job = await jobModel.findById(id);
    if (!job) throw new Error('Job not found');
    return job;
  },

  getByCompanyId: async (companyId) => {
    return jobModel.findByCompanyId(companyId);
  },

  getByCategoryId: async (categoryId) => {
    return jobModel.findByCategoryId(categoryId);
  },

  update: async (id, data) => {
    const existing = await jobModel.findById(id);
    if (!existing) throw new Error('Job not found');
    return jobModel.update(id, data);
  },

  deleteJob: async (id) => {
    const existing = await jobModel.findById(id);
    if (!existing) throw new Error('Job not found');
    await jobModel.delete(id);
  }
};

export default jobService;