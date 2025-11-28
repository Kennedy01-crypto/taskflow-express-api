import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", //specify OpenAPI version
    info: {
      //title, version and description of your api
      title: "TaskFlow API",
      version: "1.0.0",
      description: "A simple RESTful API for managing tasks.",
    },
    servers: [
      {
        url: "http:///localhost:3000/api", // Base URL for your API endpoints
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"], //Files to scan for Swagger annotations
  // In our case, we'll put annotations in route files.
  // We might also scan model files if we define schemas there using annotations directly.
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
