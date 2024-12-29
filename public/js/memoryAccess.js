let memoryAccessArr = []
let currentMemoryAccess = 0;

let cacheMap = {0: 'l1', 1: 'l2', 2: 'l3'};

function previousStep() {
    // Avoid going under the memory accesses
    if (currentMemoryAccess <= 0) return;

    selectMemoryAccess(currentMemoryAccess, currentMemoryAccess - 1);
    updateProgressBar(--currentMemoryAccess, memoryAccessArr.length);
}
function playPause() {
    // Change the icon from play to pause and vice versa
    $(this).find('.fa-play, .fa-pause')
        .toggleClass('fa-play')
        .toggleClass('fa-pause');
}

function nextStep() {
    // Avoid going over the memory accesses
    if (currentMemoryAccess >= memoryAccessArr.length) return;

    // Get the next access to the memory
    let memAcc = memoryAccessArr[currentMemoryAccess];

    // Read or write to the cache and store the result, it has the same structure
    let res = memAcc.rw === 'R' ?
        __readFromCache(memAcc.address) :
        __writeToCache(memAcc.address, memAcc.value);

    // Update the memory access with the result


    // Update the progress bar
    selectMemoryAccess(currentMemoryAccess, currentMemoryAccess + 1);
    updateProgressBar(++currentMemoryAccess, memoryAccessArr.length);
}

function __initMemoryAccess() {
    memoryAccessArr = [
        new MemoryAccess("R", 0x000, 0),
        new MemoryAccess("R", 0x810, 0),
        new MemoryAccess("R", 324, 0),
        new MemoryAccess("R", 325, 0),
        new MemoryAccess("W", 326, 89),
        new MemoryAccess("W", 322, 10),
        new MemoryAccess("R", 0, 0),
        {"rw": "R", "address": 329, "value": 0, "hit": false},
        {"rw": "W", "address": 330, "value": 213, "hit": false},
        {"rw": "W", "address": 331, "value": 61, "hit": false},
        {"rw": "W", "address": 969, "value": 229, "hit": false},
        {"rw": "R", "address": 386, "value": 0, "hit": false},
        {"rw": "R", "address": 824, "value": 0, "hit": false},
        {"rw": "R", "address": 185, "value": 0, "hit": false},
        {"rw": "W", "address": 684, "value": 107, "hit": false},
        {"rw": "W", "address": 390, "value": 232, "hit": false},
        {"rw": "W", "address": 851, "value": 177, "hit": false},
        {"rw": "R", "address": 393, "value": 0, "hit": false},
        {"rw": "R", "address": 438, "value": 0, "hit": false},
        {"rw": "R", "address": 493, "value": 0, "hit": false},
        {"rw": "R", "address": 198, "value": 0, "hit": false},
        {"rw": "R", "address": 521, "value": 0, "hit": false},
        {"rw": "W", "address": 470, "value": 126, "hit": false},
        {"rw": "W", "address": 251, "value": 173, "hit": false},
        {"rw": "W", "address": 972, "value": 39, "hit": false},
        {"rw": "R", "address": 761, "value": 0, "hit": false},
        {"rw": "W", "address": 552, "value": 198, "hit": false},
        {"rw": "R", "address": 695, "value": 0, "hit": false},
        {"rw": "W", "address": 856, "value": 160, "hit": false},
        {"rw": "R", "address": 294, "value": 0, "hit": false}
    ]

    for (let i = 0; i < memoryAccessArr.length; i++) memoryAccessRender(memoryAccessArr[i]);
}

$(document).ready(function () {
    // Associate the functions to the DOM
    $('#previous').click(previousStep);
    $('#playpause').click(playPause);
    $('#next').click(nextStep);

    // Reset the progress bar
    __initMemoryAccess();
    updateProgressBar(currentMemoryAccess, memoryAccessArr.length);
    __initMemory();
    __initCache();

    // Set the caches to the default values
    for (let i = 0; i < cacheOptions.cacheNumber; i++) updateCacheStats(i);
});

class MemoryAccess {
    constructor(rw, address, value) {
        this.rw = rw;
        this.address = address;
        this.value = value;
        this.hit = false;
    }
}