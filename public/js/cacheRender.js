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

function selectMemoryAccess(select, unselect) {
    let access = $('#memoryAccess').find('tbody');

    access.find(`tr:nth-child(${unselect})`).addClass('table-success');
    access.find(`tr:nth-child(${select})`).removeClass('table-success');
}