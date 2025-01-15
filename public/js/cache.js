let cacheOptions = {
    cacheNumber: Storage.getIntValue("cacheNumber", 3),
    dirty: Storage.getBoolValue("dirty", false),
    indexBits: Storage.getIntValue("indexBits", 5),
    offsetBits: Storage.getIntValue("offsetBits", 5),
    replacementPolicy: Storage.getStringValue("replacementPolicy", 'LRU'),
    associativity: Storage.getStringValue("associativity", 'DIRECT_MAP'),
    n_way: Storage.getIntValue("n_way", 2)
}

let caches = [];

/**
 * Initialize the cache array.
 *
 * @params map containing all the urls params
 * @private
 */
function __initCache() {
    for (let i = 0; i < cacheOptions.cacheNumber; i++) {
        if (cacheOptions.associativity === "FULLY_ASSOCIATIVE") {
            caches.push([]);
        }else {
            caches.push({});
        }
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

        // Get the data from the cache can be 3 types
        switch (cacheOptions.associativity) {
            case "DIRECT_MAP":
                // On DIRECT_MAP each element can only be on a specific position so
                // with a simple condition we can get the value
                if (cache[index] && cache[index].tag === tag) {
                    return { data: cache[index], hit: true, num: cacheIndex, renderIndex: index };
                }
                break
            case "N-WAY":
                // In a N-WAY the cache will be a 2d array the first dimension will be the
                // index, the second, will be the possible positions, it could be a 1d array
                // with n * 2^indexBits but is easier like this

                // Get the possible positions
                let n_set = cache[index];
                if(!n_set) break
                let i = -1;
                for (const element of n_set) {
                    i++
                    if (element.tag !== tag) continue

                    // If the tag is the same return the element data
                    return { data: element, hit: true, num: cacheIndex, renderIndex: i };
                }

                break
            case "FULLY_ASSOCIATIVE":
                // On a FULLY_ASSOCIATIVE the value can be stored in any position of
                // the cache so we have to loop it
                if (!cache) continue;

                let j = -1;
                for (const elementIndex in cache) {
                    let element = cache[elementIndex];
                    j++;
                    // Different index, continue
                    if (element.index !== index || element.tag !== tag) continue;

                    return { data: element, hit: true, num: cacheIndex, renderIndex: j };
                }
                break
        }
    }

    // If the data is not in the cache, read it from memory
    data = readFromMemory(address);
    return { data: data, hit: false, num: 3 };
}

function __writeToCache(address, data) {
    if(typeof address !== 'number' || typeof data !== "number") {
        console.error('Invalid arguments');
        return;
    }

    // Read from the cache or memory
    let { hit, num } = readFromCache(address);

    // If we haven't found the data, push it to the cache
    if (!hit) {
        pushDataToCache(address, data);
        num = 0;
    }else {
        // PushDataToCache will update the cacheStats
        updateCacheStats(num, true);
    }

    // Then update the cache
    let { tag, index } = calculateTagIndex(address);

    let indexRender = index;
    let dataRender;

    switch (cacheOptions.associativity) {
        case "DIRECT_MAP":
            caches[num][index] = new CacheElement(tag, true, true, data);

            dataRender = caches[num][index]
            break
        case "N-WAY":
            let set = caches[num][index]

            let i = -1
            if(!set) break
            for (let element of set) {
                i++
                if (element.tag !== tag) continue

                element = new CacheElement(tag, true, true, data)
                dataRender = element
                indexRender = cacheOptions.n_way * index + i
            }

            break
        case "FULLY_ASSOCIATIVE":
            let j = -1
            if (!caches[num]) break
            for (const elementIndex in caches[num]) {
                let element = caches[num][elementIndex]
                j++
                if (element.index !== index || element.tag !== tag) continue;

                element.data = data
                dataRender = element
                indexRender = j
            }
            break
    }

    cacheItemRender(num + 1, indexRender, dataRender, 'cache-write');
    return {hit: hit, num: num, data: data.data};
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
    let { hit, num, data, renderIndex } = readFromCache(address);

    // If the element is not on the cache, push it to the cache L1
    if (!hit) {
        pushDataToCache(address, data);
        return { hit: hit, num: num, data: data };
    }else {
        // PushDataToCache will update the cacheStats
        updateCacheStats(num, true);
    }

    // If the element is on the cache, update the cache
    let { index } = calculateTagIndex(address)

    // Only we have to update this if we have n-way, the rest is given by the readFromCache
    switch (cacheOptions.associativity) {
        case "N-WAY":
            renderIndex += cacheOptions.n_way * index;
            break
    }

    cacheItemRender(num + 1, renderIndex, data, 'cache-hit');
    return { hit: hit, num: num, data: data };
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
        let tmp;

        let renderIndex;
        let renderData;

        switch (cacheOptions.associativity) {
            case "DIRECT_MAP":
                tmp = cache[index]
                cache[index] = new CacheElement(tag, true, dirty, data);

                renderIndex = index;
                renderData = cache[index]
                break
            case "N-WAY":
                if (!cache[index]) cache[index] = []

                let set = cache[index]
                let setSize = cacheOptions.n_way

                // Stores the position on the cacheItemRender array
                renderIndex = setSize * index - 1

                if (set.length < setSize) {
                    // Cache has space
                    renderData = new CacheElement(tag, true, dirty, data)
                    renderIndex += set.push(renderData);
                }else {
                    // Cache hasn't got space, replace first (has to be LRU)
                    tmp = set[0]
                    set[0] = new CacheElement(tag, true, dirty, data)

                    renderIndex++
                    renderData = set[0]
                }
                break
            case "FULLY_ASSOCIATIVE":
                let maxSize = Math.pow(2, cacheOptions.indexBits)

                if (cache.length < maxSize) {
                    // Cache has space
                    renderData = new CacheElement(tag, true, dirty, data)
                    renderData.index = index
                    renderIndex = cache.push(renderData) - 1
                }else {
                    // Cache hasn't got space, replace first (has to be LRU)
                    tmp = cache[0]
                    cache[0] = new CacheElement(tag, true, dirty, data)
                    cache[0].index = index

                    renderIndex = 0;
                    renderData = cache[0]
                }
                break
        }

        // Render the item on the cache as a miss
        cacheItemRender(cacheIndex + 1, renderIndex, renderData, 'cache-error');

        // Update the cacheStats with miss
        updateCacheStats(cacheIndex, false);

        // If we reached the last non-written cache, end
        if (tmp === undefined) {
            data = undefined
            break
        }

        // Update the values to push on the next cache
        data = tmp.data;
        tag = tmp.tag;
        dirty = tmp.dirty;

        // Hardcoded, with this only if we ar on FULLY_ASSOCIATIVE if the level is not
        // full it won't go to the next one
        if(cacheOptions.associativity === "FULLY_ASSOCIATIVE") {
            let maxLength = Math.pow(2, cacheOptions.indexBits)
            if (cache.length < maxLength) cacheIndex--
        }
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

function objectLength(object) {
    let length = 0;

    for(let key in object) {
        if(object.hasOwnProperty(key)) ++length;
    }
    return length;
}

class CacheElement {
    constructor(tag, valid, dirty, data) {
        this.tag = tag;
        this.valid = valid;
        this.dirty = dirty;
        this.data = data;
    }
}