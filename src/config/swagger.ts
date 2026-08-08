import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Vault API",
      version: "1.0.0",
      description:
        "Vault API documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    path.resolve(
      process.cwd(),
      "src/docs/**/*.swagger.ts"
    ),
  ],
};

export const swaggerSpec =
  swaggerJSDoc(options);