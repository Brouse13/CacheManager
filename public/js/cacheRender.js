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
    let cache = $("#cache" + index);
    let size = Math.pow(2, options.indexBits);
    console.log(size, cache);


    for (let i = 0; i < size; i++) {
        cache.append(`<tr class="text-center">
                        <td>F</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>`);
    }
}

function selectMemoryAccess(select, unselect) {
    let access = $('#memoryAccess').find('tbody');

    access.find(`tr:nth-child(${unselect})`).addClass('table-success');
    access.find(`tr:nth-child(${select})`).removeClass('table-success');
}