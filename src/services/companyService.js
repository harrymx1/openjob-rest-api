import companyModel from '../models/companyModel.js';

const companyService = {
  create: async (data, userId) => {
    // Untuk create, memberikan nilai default string kosong ('') sangat aman 
    // karena ini adalah entri data baru.
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
    
    // PERBAIKAN: Gunakan data baru jika dikirim, jika tidak ada (undefined), gunakan data lama
    const updatedName = data.name !== undefined ? data.name : existing.name;
    const updatedLocation = data.location !== undefined ? data.location : existing.location;
    const updatedDescription = data.description !== undefined ? data.description : existing.description;
    
    const updated = await companyModel.update(id, { 
      name: updatedName, 
      location: updatedLocation, 
      description: updatedDescription 
    });
    return updated;
  },
  deleteCompany: async (id) => {
    const existing = await companyModel.findById(id);
    if (!existing) throw new Error('Company not found');
    await companyModel.delete(id);
  }
};

export default companyService;