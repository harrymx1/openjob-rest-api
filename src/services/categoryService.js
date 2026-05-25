import categoryModel from '../models/categoryModel.js';

const categoryService = {
  create: async (data) => {
    return categoryModel.create({ name: data.name });
  },

  getAll: async () => categoryModel.findAll(),

  getById: async (id) => {
    const cat = await categoryModel.findById(id);
    if (!cat) throw new Error('Category not found');
    return cat;
  },

  update: async (id, name) => {
    const existing = await categoryModel.findById(id);
    if (!existing) throw new Error('Category not found');
    return categoryModel.update(id, name);
  },

  deleteCategory: async (id) => {
    const existing = await categoryModel.findById(id);
    if (!existing) throw new Error('Category not found');
    await categoryModel.delete(id);
  }
};

export default categoryService;