function memoryRender(element) {
    let memory = $('#memory-table').find('tbody');
    memory.append(`<tr class="text-center">
                    <td>${element.address}</td>
                    <td>${element.value}</td>
                    </tr>`);
}

/**
 * Render a memory item.
 *
 * @param address Address of the memory item
 * @param value Value of the memory item
 * @param classToAdd
 */
function memoryItemRender(address, value, classToAdd) {
    let index = getMemoryIndex(address) >> 5;

    let container = $(`#memory-table`);
    let table = container.find('table')
    let row = table.find(`tbody tr:nth-child(${index + 1})`);

    row.find('td:nth-child(1)').text(memory[getMemoryIndex(address)].address);
    row.find('td:nth-child(2)').text(value);

    row.addClass(classToAdd);

    const offsetTop = 38 * (index - 1);

    // Smooth scroll to the highlighted row
    container.animate({ scrollTop: offsetTop }, 500);

    // Remove the highlight after a short delay
    setTimeout(() => { row.removeClass(classToAdd); }, 1000);
}

/**
 * Render a hit or miss on the access table
 *
 * @param index index of the table
 * @param hit hit cache index and data
 */
function renderHit(index, hit) {
    let memoryAccess = $(`#memoryAccess tbody tr:nth-child(${index + 1})`);
    memoryAccess.find('td:nth-child(3)').text(hit.data);
    memoryAccess.find('td:nth-child(4)').text(!hit.hit ? 'Miss' : `Hit - ${hit.num + 1}`);
}