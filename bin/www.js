import express from "express";
import dotenv from "dotenv";

import { home } from "../src/routes/home.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Disable the 'x-powered-by' header.pug for security reasons
app.disable('x-powered-by');

// Add middlewares
app.use(express.static("public"))

// Add the routes
app.use(home);

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});