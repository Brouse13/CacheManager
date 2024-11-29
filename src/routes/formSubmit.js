import express from "express";

const form = express.Router();

/**
 * Load th home page on the router, and render the pug file.
 */
form.post('/form', (req , res ) =>{
    const { modalInput } = req.body;
    console.log(modalInput);
    res.redirect('/')
})

// Export the router
export { form };