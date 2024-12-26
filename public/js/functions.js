$(document).ready(function () {
    // ---- Modal functions -----
    $('.openmodal').click(function () {
        let value = $(this).attr('modal-data');

        $('#modalTitle').text("Change " + value);
        $('#labelModalForm').text(value);
        $('#modalType').val(value);
    })

    $('#saveFormButton').click(function () {
        let value = $('#modalInput').val();
        if (value) $('#modalForm').submit();
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