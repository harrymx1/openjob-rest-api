import companyService from '../services/companyService.js';

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body, req.user.id);
    res.status(201).json({ status: 'success', data: company });
  } catch (err) {
    next(err);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAll();
    res.status(200).json({ status: 'success', data: { companies } });
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await companyService.getById(id);
    res.status(200).json({ status: 'success', data: company });
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await companyService.update(id, req.body, req.user.id);
    res.status(200).json({ status: 'success', message: 'Company updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    await companyService.deleteCompany(id);
    res.status(200).json({ status: 'success', message: 'Company deleted' });
  } catch (err) {
    next(err);
  }
};