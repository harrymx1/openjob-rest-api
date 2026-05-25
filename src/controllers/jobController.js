import jobService from '../services/jobService.js';

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.create(req.body, req.user.id);
    res.status(201).json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const { title, 'company-name': companyName } = req.query;
    const filters = {};
    if (title) filters.title = title;
    if (companyName) filters['company-name'] = companyName;
    const jobs = await jobService.getAll(filters);
    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.getById(id);
    res.status(200).json({ status: 'success', data: job });
  } catch (err) {
    next(err);
  }
};

export const getJobsByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const jobs = await jobService.getByCompanyId(companyId);
    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (err) {
    next(err);
  }
};

export const getJobsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const jobs = await jobService.getByCategoryId(categoryId);
    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await jobService.update(id, req.body);
    res.status(200).json({ status: 'success', message: 'Job updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await jobService.deleteJob(id);
    res.status(200).json({ status: 'success', message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};