const path = require('path');

const isProdEnv = process.env.NODE_ENV === 'production';
const envPath = isProdEnv ? '../.env.production' : '../.env';

require('dotenv').config({ path: path.resolve(__dirname, envPath) });

module.exports = {
  isProdEnv,
  envPath,
};
