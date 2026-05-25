import categoryService from '../services/categoryService.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ status: 'success', data: category });
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getById(id);
    res.status(200).json({ status: 'success', data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await categoryService.update(id, name);
    res.status(200).json({ status: 'success', message: 'Category updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(200).json({ status: 'success', message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};