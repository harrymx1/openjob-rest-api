import companyModel from '../models/companyModel.js';

const companyService = {
  create: async (data, userId) => {
    const { name, location = '', description = '' } = data;
    const company = await companyModel.create({ name, location, description, createdBy: userId });
    return company;
  },
  getAll: async () => companyModel.findAll(),
  getById: async (id) => {
    const company = await companyModel.findById(id);
    if (!company) throw new Error('Company not found');
    return company;
  },
  update: async (id, data, userId) => {
    const existing = await companyModel.findById(id);
    if (!existing) throw new Error('Company not found');
    const { name, location = '', description = '' } = data;
    const updated = await companyModel.update(id, { name, location, description });
    return updated;
  },
  deleteCompany: async (id) => {
    const existing = await companyModel.findById(id);
    if (!existing) throw new Error('Company not found');
    await companyModel.delete(id);
  }
};

export default companyService;