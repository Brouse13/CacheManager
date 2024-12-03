function memoryRender(element) {
    let memory = $('#memory-table').find('tbody');
    memory.append(`<tr class="text-center">
                    <td>${element.address}</td>
                    <td>${element.value}</td>
                    </tr>`);
}

function renderHit(index, hit) {
    let memoryAccess = $(`#memoryAccess tbody tr:nth-child(${index + 1})`);

    console.log(memoryAccess)
    memoryAccess.find('td:nth-child(4)').text(!hit.hit ? 'Miss' : `Hit - ${hit.num + 1}`);
}