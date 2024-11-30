function memoryRender(element) {
    let memory = $('#memory-table').find('tbody');
    memory.append(`<tr class="text-center">
                    <td>${element.address}</td>
                    <td>${element.value}</td>
                    </tr>`);
}