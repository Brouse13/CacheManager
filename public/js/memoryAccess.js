let memoryAccessArr = []
let currentMemoryAccess = 0;

let cacheMap = {0: 'l1', 1: 'l2', 2: 'l3'};

const states = []

function previousStep() {
    // Avoid going under the memory accesses
    if (currentMemoryAccess <= 0) return;

    // Load the last state from memory
    loadState()

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

    // Before update the content save the current state
    saveState()

    // Read or write to the cache and store the result, it has the same structure
    let res = memAcc.rw === 'R' ?
        __readFromCache(memAcc.address) :
        __writeToCache(memAcc.address, memAcc.value);

    // Update the memory access with the result
    if (res) renderHit(currentMemoryAccess, res)

    // Update the progress bar
    selectMemoryAccess(currentMemoryAccess, currentMemoryAccess + 1);
    updateProgressBar(++currentMemoryAccess, memoryAccessArr.length);
}

function __initMemoryAccess() {
    memoryAccessArr = [
        new MemoryAccess("R", 0x000, '-'),
        new MemoryAccess("R", 0x810, '-'),
        new MemoryAccess("R", 324, '-'),
        new MemoryAccess("R", 325, '-'),
        new MemoryAccess("W", 326, 89),
        new MemoryAccess("W", 322, 10),
        new MemoryAccess("R", 0, '-'),
        new MemoryAccess("R", 329, '-'),
        new MemoryAccess("W", 330, 213),
        new MemoryAccess("W", 331, 61),
        new MemoryAccess("W", 969, 229),
        new MemoryAccess("R", 386, '-'),
        new MemoryAccess("R", 824, '-'),
        new MemoryAccess("R", 185, '-'),
        new MemoryAccess("W", 684, 107),
        new MemoryAccess("W", 390, 232),
        new MemoryAccess("W", 851, 177),
        new MemoryAccess("R", 393, '-'),
        new MemoryAccess("R", 438, '-'),
        new MemoryAccess("R", 493, '-'),
        new MemoryAccess("R", 198, '-'),
        new MemoryAccess("R", 521, '-'),
        new MemoryAccess("W", 470, 126),
        new MemoryAccess("W", 251, 173),
        new MemoryAccess("W", 972, 39),
        new MemoryAccess("R", 761, '-'),
        new MemoryAccess("W", 552, 198),
        new MemoryAccess("R", 695, '-'),
        new MemoryAccess("W", 856, 160),
        new MemoryAccess("R", 294, '-')
    ];

    for (let i = 0; i < memoryAccessArr.length; i++) memoryAccessRender(memoryAccessArr[i]);
}

/**
 * Load the last state that was stored on the history, and then
 * render it.
 */
function loadState() {
    if (history.length <= 1) return;

    // Render last state
    const lastState = states[states.length - 1]
    __renderState(lastState)

    // Remove last state
    states.pop()
}

/**
 * Get the current state of the tables and push it to the history
 */
function saveState() {
    let $cache1 = $(`#cache1 table > tbody > tr`);
    let $cache2 = $(`#cache2 table > tbody > tr`);
    let $cache3 = $(`#cache3 table > tbody > tr`);
    let $memAccess = $(`#memoryAccess > tbody > tr`);

    function format(data) {
        let row = []
        data.each(function() {
            const rowValues = [];
            $(this).find('td').each(function () {
                rowValues.push($(this).text());
            });
            row.push(rowValues);
        });

        return row;
    }

    // Push the html on the states
    states.push([
        format($cache1),
        format($cache2),
        format($cache3),
        format($memAccess),
        structuredClone(caches),
        structuredClone(memory),
        structuredClone(stats),
    ])
}

/**
 * Render on the table the given state
 *
 * @param state array of arrays
 * @private
 */
function __renderState(state) {
    let toRender = [
        "#cache1 table",
        "#cache2 table",
        "#cache3 table",
        "#memoryAccess"
    ]

    // Save the state of the caches and memory
    caches =  state[4]
    memory =  state[5]
    stats = state[6]

    // Load the stat of the cache
    for (let i = 0; i < toRender.length; i++) {
        let $element = $(`${toRender[i]} > tbody`).find(`tr`);
        let currentState = state[i];

        currentState.forEach((row, rowIndex) => {
            // Map the row into a html row without the <tr></tr> tags
            let rowHTML = row.map(value => `<td>${value}</td>`).join('');

            $($element[rowIndex]).html(rowHTML);
        })

        // Update the cache
        updateCacheStats(i)
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