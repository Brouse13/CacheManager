let cacheOptions = {
    cacheNumber: 2,
    dirty: false,
    validBit: false,
    cacheSize: 16,
    replacementPolicy: 'LRU',
    associativity: 'DIRECT_MAPPED'
}

let memoryAccess = [1, 2, 3, 4, 5]
let currentMemoryAccess = 0;

function previousStep() {
    // Avoid going under the memory accesses
    if (currentMemoryAccess <= 0) return;

    // Update the progress bar
    let memory = $('#memoryAccess');

    memory.find(`tbody tr:nth-child(${currentMemoryAccess})`).removeClass('table-success');
    currentMemoryAccess--;
    __updateProgress()
    memory.find(`tbody tr:nth-child(${currentMemoryAccess})`).addClass('table-success');
}
function playPause() {
    // Change the icon from play to pause and vice versa
    $(this).find('.fa-play, .fa-pause')
        .toggleClass('fa-play')
        .toggleClass('fa-pause');
}

function nextStep() {
    // Avoid going over the memory accesses
    if (currentMemoryAccess >= memoryAccess.length) return;

    // Update the progress bar
    let memory = $('#memoryAccess');
    memory.find(`tbody tr:nth-child(${currentMemoryAccess})`).removeClass('table-success');
    currentMemoryAccess++;
    __updateProgress();
    memory.find(`tbody tr:nth-child(${currentMemoryAccess})`).addClass('table-success');
}

function __updateProgress() {
    let progress = currentMemoryAccess / memoryAccess.length * 100;
    $('#progress-bar').text(progress + '%').css('width', progress + '%');
}

function __initMemoryAccess() {
    let data = {
        rw: 'R',
        address: 1,
        value: 0,
        hit: false,
    }

    let table = $('#memoryAccess').find('tbody');

    for (let i = 0; i < 20; i++) {
        memoryAccess.push(data);
        table.append(`<tr class="text-center">
                    <td>${data.rw}</td>
                    <td>${"0x" + ("0000" + data.address.toString(16)).slice(-4)}</td>
                    <td>${data.value}</td>
                    <td>-</td>
                   </tr>`);
    }
}

$(document).ready(function () {
    // Associate the functions to the DOM
    $('#previous').click(previousStep);
    $('#playpause').click(playPause);
    $('#next').click(nextStep);

    // Reset the progress bar
    __updateProgress();
    __initMemoryAccess();
});