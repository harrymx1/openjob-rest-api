import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Kriteria 2: Kredensial Redis disimpan di environment variables REDIS_HOST
// Format createClient untuk node-redis v4 menerima parameter socket atau url
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis connected'));

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

export const setCache = async (key, value, expiresInSeconds = 3600) => {
  try {
    await connectRedis();
    await client.set(key, JSON.stringify(value), { EX: expiresInSeconds });
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const getCache = async (key) => {
  try {
    await connectRedis();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await connectRedis();
    await client.del(key);
  } catch (error) {
    console.error('Error deleting cache:', error);
  }
};

export const deleteCacheByPattern = async (pattern) => {
  try {
    await connectRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Error deleting cache by pattern:', error);
  }
};

export default client;
