let cacheOptions = {
    cacheNumber: 3,
    dirty: false,
    validBit: false,
    indexBits: 6,
    offsetBits: 4,
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

function readFromCache(address) {
    let { tag, index } = calculateTagIndex(address);
    let cacheIndex, data

    // Search on all the caches for the data
    for (cacheIndex = 0; cacheIndex < cacheOptions.cacheNumber; cacheIndex++) {
        let cache = caches[cacheIndex];

        // If the cache has the index, and the tag matches, return the data
        if (cache[index] && cache[index].tag === tag) {
            data = cache[index].data;
            break;
        }
    }

    // If the data is not in the cache, read it from memory
    // Then update the cache with the new data
    if (!data) {
        data = readFromMemory(address);
        cacheIndex = 3;
    }

    // Write the data to all the caches that haven't got the data
    writeBackToFront(cacheIndex-1, address, data);
    return data;
}

function writeBackToFront(cacheIndex, address, data) {
    let { tag, index } = calculateTagIndex(address);

    for (let i = cacheIndex; i >= 0; i--) {
        let cache = caches[i];
        cache[index] = { tag, data };
    }
}

function calculateTagIndex(address) {
    // Unpack the cache and memory options
    const { offsetBits, indexBits } = cacheOptions;
    const { memorySize, startAddress } = memoryOptions;
    const memoryBits = Math.ceil(Math.log2(memorySize + startAddress));

    // Calculate the index
    const indexMask = (1 << indexBits) - 1; // Mask to extract the index bits
    const index = (address >> offsetBits) & indexMask;

    // Calculate the tag
    const tag = address >> (offsetBits + indexBits); // Remaining higher-order bits form the tag

    // Return them as strings in binary format
    return {
        tag: tag.toString(2).padStart(memoryBits - offsetBits - indexBits, '0'),
        index: index.toString(2).padStart(indexBits, '0'),
    };
}