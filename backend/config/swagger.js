const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Cine Tanger API",
            version: "1.0.0",
            description: "API documentation for Cine Tanger backend",
        },
        servers: [
            {
                url: "http://localhost:80/api",
                description: "Local server"
            },
            {
                url: "https://cine-tanger.up.railway.app/api",
                description: "Production server"
            },
        ],
    },
    apis: [path.join(__dirname, "../src/routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
