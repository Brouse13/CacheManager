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
    if (memAcc.rw === 'R') readFromCache(memAcc.address);

    // Update the progress bar
    selectMemoryAccess(currentMemoryAccess, currentMemoryAccess + 1);
    updateProgressBar(++currentMemoryAccess, memoryAccessArr.length);
}

function __initMemoryAccess() {
    let data = { rw: 'R', address: 1, value: 0, hit: false }

    for (let i = 0; i < 30; i++) {
        memoryAccessArr.push(data);
        memoryAccessRender(data);
    }
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