import spanish from './es-ES.js'
import catalan from './es-CA.js'
import english from './en-EU.js'

const defaultLanguage = 'en-EU';

/**
 * Load the effective file language from the given name. Or the default 'en-EU'
 * if the name is not found.
 *
 * @param name language name
 * @returns the language object
 */
function loadLanguage(name) {
    switch (name) {
        case "en-EU": return english;
        case "es-ES": return spanish;
        case "es-CA": return catalan;
        default: return english;
    }
}

// Export the function and the default language
export { loadLanguage, defaultLanguage };