import dotenv from 'dotenv';
dotenv.config();

const _config = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
};

export const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.error(`The ${key} is not found. Make sure pass correct environment variable`);
      process.exit();
    }
    return _config[key];
  },
};
