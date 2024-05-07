
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json');
const express = require('express');

const app = express();


// Generate Swagger specification


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Express application
const port = 4000;
app.listen(port, () => {
    console.log(`Swagger API ${port}`);
});