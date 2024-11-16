const devConfig = {
  breederUrl: "http://localhost:8080/api/v1/breeders",
  customerUrl: "http://localhost:8081/api/v1/customers",
};

const prodConfig = {
  breederUrl: "https://breeder-661348528801.us-central1.run.app/api/v1/breeders",
  customerUrl: "https://customer-661348528801.us-central1.run.app/api/v1/customers",
};

const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default config;
