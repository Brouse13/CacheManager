﻿let cacheOptions = {
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
    // Then update the cache with the new data
    data = readFromMemory(address);
    return { data, hit: false, num: 3 };

    // Write the data to all the caches that haven't got the data
    //writeBack(0, address, data);
    // return { data, hit: cacheIndex < cacheOptions.cacheNumber, num: cacheIndex };
}

function writeToCache(address, data) {
    let { tag, index } = calculateTagIndex(address);
    let cacheIndex = 0;

    for (; cacheIndex < cacheOptions.cacheNumber; cacheIndex++) {
        let cache = caches[cacheIndex];

        if (cache[index] && cache[index].tag === tag) {
            cache[index] = { valid: true, dirty: true, tag, data };
            cacheItemRender(cacheIndex + 1, index, cache[index], 'cache-write');
            break;
        }
    }

    index = writeToMemory(address, data);
    // memoryItemRender(index, data, 'memory-write');
}

function _readFromCache(address) {
    let { tag, index }  = calculateTagIndex(address);
    let cacheIndex = findInCache(address);

    // If the data is not in the cache, read it from memory
    if (cacheIndex === -1) {
        let data = readFromMemory(address);
        pushDataToCache(address, data)
    }
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

function writeBack(cacheIndex, address, data) {
    let { tag, index } = calculateTagIndex(address);
    let cache = caches[cacheIndex];

    // If the cache element is not set, set it
    if (!cache[index]) {
        cache[index] = { valid: true, dirty: false, tag, data };
        cacheItemRender(cacheIndex + 1, index, cache[index], 'cache-error');
        new Promise(r => setTimeout(r, 1)).then();
        return;
    }

    // If the cache element is dirty, write it back to memory
    let raw = cache[index]

    cache[index] = { valid: true, dirty: false, tag, data };
    cacheItemRender(cacheIndex + 1, index, cache[index], 'cache-error');
    new Promise(r => setTimeout(r, 1)).then();
    writeBack(cacheIndex + 1, tagIndexToAddress(raw.tag, index), raw.data);
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