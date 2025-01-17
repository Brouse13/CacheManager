$(document).ready(function () {
    // ---- Modal functions -----
    $('.openmodal').click(function () {
        let attrib = $(this).attr('modal-data');
        let value = $(this).text();

        $('#modalTitle').text("Change " + value);
        $('#labelModalForm').text(value);
        $('#modalType').val(attrib);
    })

    $('#saveFormButton').click(function () {
        let value = $('#modalInput').val();
        if (value) {
            // Store the value
            Storage.storeValue(
                $('#modalType').val(),
                $('#modalInput').val()
            )

            // Simulate the button send
            window.location.reload()
        }
    })

    // ---- View Value functions -----
    $('#cache1 table tbody').on('click', 'tr',function () {
        showCacheValue($(this), 0);
    });

    $('#cache2 table tbody').on('click', 'tr',function () {
        showCacheValue($(this), 1);
    });

    $('#cache3 table tbody').on('click', 'tr',function () {
        showCacheValue($(this), 2);
    });
});

function showCacheValue($cell, index) {
    let item = caches[index][$cell.index()];

    // If the item is undefined, return
    if (!item) return;

    $cell.toggleClass('rotated');

    // If the cell is rotated, show the data
    if ($cell.hasClass('rotated')) {
        $cell.html(`<td colspan="3">${item.data}</td>`)
        return;
    }

    // If the cell is not rotated, show the cache item
    $cell.html(`<td>${item.valid ? 'T' : 'F'}</td><td>${item.dirty ? 'T' : 'F'}</td><td>${item.tag}</td>`)
}