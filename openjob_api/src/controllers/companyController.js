import companyService from '../services/companyService.js';
import { getCache, setCache, deleteCache, deleteCacheByPattern } from '../lib/redis.js';

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body, req.user.id);
    await deleteCacheByPattern('companies:*');
    res.status(201).json({ status: 'success', data: company });
  } catch (err) {
    next(err);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const cacheKey = 'companies:all';
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { companies: cachedData } });
    }

    const companies = await companyService.getAll();
    await setCache(cacheKey, companies, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { companies } });
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `companies:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: cachedData });
    }

    const company = await companyService.getById(id);
    await setCache(cacheKey, company, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: company });
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await companyService.update(id, req.body, req.user.id);
    await deleteCache(`companies:${id}`);
    await deleteCache('companies:all');
    res.status(200).json({ status: 'success', message: 'Company updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    await companyService.deleteCompany(id);
    await deleteCache(`companies:${id}`);
    await deleteCache('companies:all');
    res.status(200).json({ status: 'success', message: 'Company deleted' });
  } catch (err) {
    next(err);
  }
};