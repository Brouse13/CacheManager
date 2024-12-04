function memoryAccessRender(data) {
    $('#memoryAccess').find('tbody')
        .append(`<tr class="text-center">
                    <td>${data.rw}</td>
                    <td>${"0x" + ("0000" + data.address.toString(16)).slice(-4)}</td>
                    <td>${data.value}</td>
                    <td>-</td>
                   </tr>`);
}

function updateProgressBar(index, length) {
    let progressValue = (index / length * 100).toFixed(2);
    $('#progress-bar').text(progressValue + '%').css('width', progressValue + '%');
}

function cacheRender(index, options) {
    let cache = $(`#cache${index} table`);
    let size = Math.pow(2, options.indexBits);

    for (let i = 0; i < size; i++) {
        cache.append(`<tr class="text-center">
                        <td>F</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>`);
    }
}

function cacheItemRender(cache, index, cacheElement, classToAdd) {
    let {tag, dirty, valid } = cacheElement;

    let container = $(`#cache${cache}`);
    let table = container.find('table')
    let row = table.find(`tbody tr:nth-child(${index + 1})`);

    row.find('td:nth-child(1)').text(dirty ? "T" : "F");
    row.find('td:nth-child(2)').text(valid ? "T" : "F");
    row.find('td:nth-child(3)').text(tag);

    row.addClass(classToAdd);

    const offsetTop = 38 * (index - 1);

    // Smooth scroll to the highlighted row
    container.animate({ scrollTop: offsetTop }, 500);

    // Remove the highlight after a short delay
    setTimeout(() => { row.removeClass(classToAdd); }, 1000);
}

function selectMemoryAccess(select, unselect) {
    let access = $('#memoryAccess').find('tbody');

    access.find(`tr:nth-child(${unselect})`).addClass('table-success');
    access.find(`tr:nth-child(${select})`).removeClass('table-success');
}