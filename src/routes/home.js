import express from "express";
import { defaultLanguage, loadLanguage } from "./language.js";

const home = express.Router();

/**
 * Load th home page on the router, and render the pug file.
 */
home.get('/', (req , res ) =>{
    // Create the table elements
    let memory_content = createTableElements();

    // Load the language
    let lang = loadLanguage(req.query.lang || defaultLanguage);
    res.render("home.pug", { memory_content, lang });
})

// Test function, won't be on final product
function createTableElements() {
    let res = [];

    let element = {
        "rw": "R",
        "addr": "0x0001",
        "val": "0x0001",
        "hit": "-"
    }

    for (let i = 0; i < 100; i++) res.push(element)

    return res;
}

// Export the router
export { home };