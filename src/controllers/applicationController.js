import applicationService from '../services/applicationService.js';

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.create(req.body);
    res.status(201).json({ status: 'success', data: application });
  } catch (err) {
    next(err);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getAll();
    res.status(200).json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await applicationService.getById(id);
    res.status(200).json({ status: 'success', data: application });
  } catch (err) {
    next(err);
  }
};

export const getApplicationsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const applications = await applicationService.getByUserId(userId);
    res.status(200).json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await applicationService.getByJobId(jobId);
    res.status(200).json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await applicationService.updateStatus(id, status);
    res.status(200).json({ status: 'success', message: 'Application status updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await applicationService.deleteApplication(id);
    res.status(200).json({ status: 'success', message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
};