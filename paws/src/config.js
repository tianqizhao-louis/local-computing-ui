const devConfig = {
  breederUrl: "http://localhost:8080/api/v1/breeders",
  customerUrl: "http://localhost:8081/api/v1/customers",
  waitlistUrl: "http://localhost:8001/api/v1/customers",
  compositeUrl: "http://localhost:8004/api/v1/composites",
  petUrl: "http://localhost:8082/api/v1/pets",
  authUrl: "http://localhost:8084/api/v1/auth",
};

const prodConfig = {
  breederUrl:
    "https://breeder-661348528801.us-central1.run.app/api/v1/breeders",
  customerUrl: "http://34.70.67.71:8081/api/v1/customers",
  waitlistUrl: "http://34.70.67.71:8081/api/v1/customers",
  compositeUrl:
    "https://composite-661348528801.us-central1.run.app/api/v1/composites",
  petUrl: "http://34.136.146.98:8082/api/v1/auth",
  authUrl: "https://composite-661348528801.us-central1.run.app/api/v1/auth",
};

const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default config;
