var images;

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $.ajax({
        type: "GET",
        url: "/api/Bgpics/Get",
        data: {},
        async: true,
        dataType: "json",
        success: function (ret) {
            images = ret;
            bgImgChange();
            bgImgSlideshow();
        }
    });
});

///// Generics /////


///// BG Image Functions /////
var bgImgSlideshow = function () {
    bgImgChange();

    setTimeout(function () {
        bgImgSlideshow();
    }, 8000);

};

function bgImgChange() {
    $(".bgImg").css({
        'transition': 'opacity 0s',
        '-webkit-transition': 'opacity 0s',
        '-moz-transition': 'opaicty 0s'
    });

    var last_img = $("#bgImg").css('background-image');
    if (last_img === "none") {
        last_img = images[Math.floor(Math.random() * images.length)];
        $("#bgImg").css({ 'background-image': 'url(' + last_img + ')' });
        $("#oldBg").css({ 'background-image': 'url(' + last_img + ')' });
    } else {
        $("#oldBg").css({ 'background-image': last_img });
    }
    
    $("#oldBg").show();
    $("#bgImg").hide();
    setTimeout(function () {
        var img = images[Math.floor(Math.random() * images.length)];
        $("#bgImg").css({ 'background-image': 'url(' + img + ')' });
        $("#bgImg").fadeIn(2000);
        $("#oldBg").fadeOut(2000);
    }, 5000);

    return true;
}