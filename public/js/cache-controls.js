$(document).ready(function () {
    $('#playpause').click(function () {
        $(this).find('.fa-play, .fa-pause')
            .toggleClass('fa-play')
            .toggleClass('fa-pause');
    });

    $('.openmodal').click(function () {
        console.log($(this));
        let value = $(this).attr('modal-data');

        $('#modalTitle').text("Change " + value);
        $('#labelModalForm').text(value);
    })

    $('#saveFormButton').click(function () {
        let value = $('#modalInput').val();
        if (value) $('#modalForm').submit();
    })
});