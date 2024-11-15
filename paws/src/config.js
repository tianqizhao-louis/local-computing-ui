const devConfig = {
  breederUrl: 'http://localhost:8000/api/v1/breeders',
};

const prodConfig = {
  breederUrl: 'https://api.yourdomain.com',
};

const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

export default config;
