let cacheOptions = {
    cacheNumber: 3,
    dirty: false,
    validBit: false,
    indexBits: 5,
    offsetBits: 5,
    replacementPolicy: 'LRU',
    associativity: 'DIRECT_MAPPED'
}

let caches = [];

/**
 * Initialize the cache array.
 *
 * @private
 */
function __initCache() {
    for (let i = 0; i < cacheOptions.cacheNumber; i++) {
        caches.push({});
        cacheRender(i+1, cacheOptions);
    }
}

/**
 * Reads the value from the cache, if the value is not present on the cache,
 * reads it from the memory.
 *
 * @param address address to read from
 * @returns {{hit: boolean, data: CacheElement, num: number}}
 */
function readFromCache(address) {
    let { tag, index } = calculateTagIndex(address);
    let cacheIndex, data

    // Search on all the caches for the data
    for (cacheIndex = 0; cacheIndex < cacheOptions.cacheNumber; cacheIndex++) {
        let cache = caches[cacheIndex];

        // If the cache has the index, and the tag matches, return the data
        if (cache[index] && cache[index].tag === tag) {
            // cacheItemRender(cacheIndex + 1, index, cache[index], 'cache-hit');
            return { data: cache[index], hit: true, num: cacheIndex };
        }
    }

    // If the data is not in the cache, read it from memory
    data = readFromMemory(address);
    return { data, hit: false, num: 3 };
}

function __writeToCache(address, data) {
    if(typeof address !== 'number' || typeof data !== "number") {
        console.error('Invalid arguments');
        return;
    }

    // Read from the cache or memory
    let { hit, num } = readFromCache(address);

    console.log(readFromCache(address))

    // If we haven't found the data, push it to the cache
    if (!hit) {
        pushDataToCache(address, data);
        num = 0;
    }

    // Then update the cache
    let { tag, index } = calculateTagIndex(address);

    caches[num][index] = new CacheElement(tag, true, true, data);
    cacheItemRender(num + 1, index, caches[num][index], 'cache-write');
}

/**
 * Reads the data from the cache or memory and updates the cache.
 *
 * @param address The memory address to read from.
 * @private
 */
function __readFromCache(address) {
    // Check if the address is a number
    if(typeof address !== 'number') {
        console.error('Invalid argument');
        return;
    }

    // Read from the cache or memory
    let { hit, num, data } = readFromCache(address);

    // If the element is not on the cache, push it to the cache L1
    if (!hit) {
        pushDataToCache(address, data);
        return data.data
    }

    // If the element is on the cache, update the cache
    let { index } = calculateTagIndex(address)
    cacheItemRender(num + 1, index, data, 'cache-hit');
    return data.data
}

/**
 * Find the cache that has the data.
 * @param address The memory address to search for.
 * @returns {number}
 */
function findInCache(address) {
    let { tag, index } = calculateTagIndex(address);

    for (let cacheIndex = 0; cacheIndex < cacheOptions.cacheNumber; cacheIndex++) {
        let cache = caches[cacheIndex];

        if (cache[index] && cache[index].tag === tag) return cacheIndex;
    }
    return -1
}

/**
 * Push the data on the first cache level, if there is no space, write back to memory
 * if dirty.
 *
 * @param address The memory address to write to.
 * @param data The data to write.
 */
function pushDataToCache(address, data) {
    let { tag, index } = calculateTagIndex(address);
    let dirty = false;

    // Loop all the caches
    for (let cacheIndex = 0; cacheIndex < cacheOptions.cacheNumber; cacheIndex++) {
        let cache = caches[cacheIndex];
        let tmp = cache[index];

        // Update the value
        cache[index] = new CacheElement(tag, true, dirty, data);
        cacheItemRender(cacheIndex + 1, index, cache[index], 'cache-error');

        // If we reached the last non-written cache, end
        if (tmp === undefined) {
            data = undefined
            break
        }

        // Update the values to push on the next cache
        data = tmp.data;
        tag = tmp.tag;
        dirty = tmp.dirty;
    }

    // Write the data to memory if it's dirty
    if (data && dirty) {
        writeToMemory(address, data);
        memoryItemRender({ address: address, data: data }, 'cache-write');
    }
}

/**
 * Calculate the tag and index from the address.
 *
 * @param address The memory address to calculate the tag and index from.
 * @returns {{index: number, tag: number}}
 */
function calculateTagIndex(address) {
    // Unpack the cache and memory options
    const { offsetBits, indexBits } = cacheOptions;

    // Calculate the index
    const indexMask = (1 << indexBits) - 1; // Mask to extract the index bits
    const index = (address >> offsetBits) & indexMask;

    // Calculate the tag
    const tag = address >> (offsetBits + indexBits); // Remaining higher-order bits form the tag

    // Return them as strings in binary format
    return {
        tag: tag ? tag : 0,
        index: index,
    };
}

/**
 * Calculate the address from the tag and index.
 *
 * @param tag Tag of the address
 * @param index Index of the address
 * @returns {number}
 */
function tagIndexToAddress(tag, index) {
    const { offsetBits, indexBits } = cacheOptions;

    return (tag << (offsetBits + indexBits)) | (index << offsetBits);
}

class CacheElement {
    constructor(tag, valid, dirty, data) {
        this.tag = tag;
        this.valid = valid;
        this.dirty = dirty;
        this.data = data;
    }
}