function memoryRender(element) {
    let memory = $('#memory-table').find('tbody');
    memory.append(`<tr class="text-center">
                    <td>${element.address}</td>
                    <td>${element.value}</td>
                    </tr>`);
}

function memoryItemRender(index, data, classToAdd) {
    let { address, value } = data;

    let container = $(`#memory-table`);
    let table = container.find('table')
    let row = table.find(`tbody tr:nth-child(${index + 1})`);

    row.find('td:nth-child(1)').text(address.toString(16));
    row.find('td:nth-child(2)').text(value);

    row.addClass(classToAdd);

    const offsetTop = 38 * (index - 1);

    // Smooth scroll to the highlighted row
    container.animate({ scrollTop: offsetTop }, 500);

    // Remove the highlight after a short delay
    setTimeout(() => { row.removeClass(classToAdd); }, 1000);
}

function renderHit(index, hit) {
    console.log({index, hit});
    let memoryAccess = $(`#memoryAccess tbody tr:nth-child(${index + 1})`);
    memoryAccess.find('td:nth-child(4)').text(!hit.hit ? 'Miss' : `Hit - ${hit.num + 1}`);
    memoryAccess.find('td:nth-child(3)').text(hit.data);
}