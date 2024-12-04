let memoryAccessArr = []
let currentMemoryAccess = 0;

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

    let memAcc = memoryAccessArr[currentMemoryAccess];

    if (memAcc.rw === 'R') {
        let { hit, num, data } = readFromCache(memAcc.address);
        renderHit(currentMemoryAccess, { hit, num, data });
    }else {
        writeToCache(memAcc.address, memAcc.value);
    }

    // Update the progress bar

    selectMemoryAccess(currentMemoryAccess, currentMemoryAccess + 1);
    updateProgressBar(++currentMemoryAccess, memoryAccessArr.length);
}

function __initMemoryAccess() {
    memoryAccessArr = [
        {"rw": "R", "address": 322, "value": 0, "hit": false},
        {"rw": "R", "address": 322, "value": 0, "hit": false},
        {"rw": "R", "address": 324, "value": 0, "hit": false},
        {"rw": "R", "address": 325, "value": 0, "hit": false},
        {"rw": "W", "address": 326, "value": 89, "hit": false},
        {"rw": "W", "address": 322, "value": 10, "hit": false},
        {"rw": "R", "address": 328, "value": 0, "hit": false},
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
});