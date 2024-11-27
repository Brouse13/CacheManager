$(document).ready(function () {
    $('#playpause').click(function () {
        console.log("ds"); // Added missing semicolon
        $(this).find('.fa-play, .fa-pause')
            .toggleClass('fa-play')
            .toggleClass('fa-pause');
    });
});