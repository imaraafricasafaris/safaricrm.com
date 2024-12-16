interface Config {
  baseUrl: string;
  apiUrl: string;
  isDevelopment: boolean;
}

const development: Config = {
  baseUrl: 'http://localhost:5173',
  apiUrl: 'http://localhost:5173/api',
  isDevelopment: true,
};

const production: Config = {
  baseUrl: 'https://safaricrm.com',
  apiUrl: 'https://safaricrm.com/api',
  isDevelopment: false,
};

const config: Config = import.meta.env.DEV ? development : production;

export default config;
