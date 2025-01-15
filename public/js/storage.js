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
     * @return the found string value on the storage, otherwise, null
     */
    static getStringValue(key) {
        return localStorage.getItem(key);
    }

    /**
     * Get the stored value on the localstorage and parse it to an int
     *
     * @param key key to search
     * @return the found int value on the storage, otherwise, undefined
     */
    static getIntValue(key) {
        let val = Storage.getStringValue(key);
        return val === null ? undefined : parseInt(val);
    }

    /**
     * Get the stored value on the localstorage and parse it to an int
     *
     * @param key key to search
     * @return the found boolean value on the storage, otherwise, undefined
     */
    static getBoolValue(key) {
        let val = Storage.getStringValue(key);
        return val === null ? undefined : Boolean(val);
    }

    /**
     * Clear all the values stored on the localStorage
     */
    static clear() {
        localStorage.clear();
    }
}