/**
 * Class used to store values and retrieve them from the local storage.
 *
 * @note Is a cache method so on cache remove or cookies delete this data
 * will be removed.
 */
class Storage {
    /**
     * Store a new value on the localStorage
     *
     * @param key key to store
     * @param value value to store
     */
    static storeValue(key, value) {
        localStorage.setItem(key, value);
    }

    /**
     * Get the stored value on the localstorage
     *
     * @param key key to search
     * @param defVal default value to return
     * @return the found string value on the storage, otherwise, defVal or null
     */
    static getStringValue(key, defVal) {
        let val = localStorage.getItem(key);
        return val == null ? defVal : val;
    }

    /**
     * Get the stored value on the localstorage and parse it to an int
     *
     * @param key key to search
     * @param defVal default value to return
     * @return the found int value on the storage, otherwise, defVal or undefined
     */
    static getIntValue(key, defVal) {
        let val = Storage.getStringValue(key);
        return val == null ? defVal : parseInt(val);
    }

    /**
     * Get the stored value on the localstorage and parse it to an int
     *
     * @param key key to search
     * @param defVal default value to return
     * @return the found boolean value on the storage, otherwise, defVal or undefined
     */
    static getBoolValue(key, defVal) {
        let val = Storage.getStringValue(key);
        return val == null ? defVal : Boolean(val);
    }

    /**
     * Clear all the values stored on the localStorage
     */
    static clear() {
        localStorage.clear();
    }
}