import applicationModel from '../models/applicationModel.js';

const applicationService = {
  create: async (data) => {
    return applicationModel.create({
      userId: data.user_id,
      jobId: data.job_id,
      status: data.status || 'pending'
    });
  },

  getAll: async () => applicationModel.findAll(),

  getById: async (id) => {
    const app = await applicationModel.findById(id);
    if (!app) throw new Error('Application not found');
    return app;
  },

  getByUserId: async (userId) => applicationModel.findByUserId(userId),

  getByJobId: async (jobId) => applicationModel.findByJobId(jobId),

  updateStatus: async (id, status) => {
    const app = await applicationModel.findById(id);
    if (!app) throw new Error('Application not found');
    return applicationModel.updateStatus(id, status);
  },

  deleteApplication: async (id) => {
    const app = await applicationModel.findById(id);
    if (!app) throw new Error('Application not found');
    await applicationModel.delete(id);
  }
};

export default applicationService;