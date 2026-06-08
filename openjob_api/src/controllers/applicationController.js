import applicationService from '../services/applicationService.js';
import { getCache, setCache, deleteCache } from '../lib/redis.js';
import { publishMessage } from '../lib/rabbitmq.js';

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.create({ ...req.body, user_id: req.user.id });
    await deleteCache(`applications:user:${application.user_id}`);
    await deleteCache(`applications:job:${application.job_id}`);
    
    await publishMessage('application_queue', { application_id: application.id });

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
    const cacheKey = `applications:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: cachedData });
    }

    const application = await applicationService.getById(id);
    await setCache(cacheKey, application, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: application });
  } catch (err) {
    next(err);
  }
};

export const getApplicationsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cacheKey = `applications:user:${userId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { applications: cachedData } });
    }

    const applications = await applicationService.getByUserId(userId);
    await setCache(cacheKey, applications, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const cacheKey = `applications:job:${jobId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { applications: cachedData } });
    }

    const applications = await applicationService.getByJobId(jobId);
    await setCache(cacheKey, applications, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await applicationService.updateStatus(id, status);
    await deleteCache(`applications:${id}`);
    await deleteCache(`applications:user:${updated.user_id}`);
    await deleteCache(`applications:job:${updated.job_id}`);
    res.status(200).json({ status: 'success', message: 'Application status updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const app = await applicationService.getById(id);
    await applicationService.deleteApplication(id);
    await deleteCache(`applications:${id}`);
    await deleteCache(`applications:user:${app.user_id}`);
    await deleteCache(`applications:job:${app.job_id}`);
    res.status(200).json({ status: 'success', message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
};