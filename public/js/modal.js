$(document).ready(function () {
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
});