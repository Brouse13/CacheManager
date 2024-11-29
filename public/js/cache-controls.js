$(document).ready(function () {
    $('#playpause').click(function () {
        $(this).find('.fa-play, .fa-pause')
            .toggleClass('fa-play')
            .toggleClass('fa-pause');
    });

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