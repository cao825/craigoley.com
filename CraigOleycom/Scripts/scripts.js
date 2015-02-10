$(document).ready(function () {
    bgImgChange();
    bgImgSlideshow();
});

var bgImgSlideshow = function() {
    bgImgChange();

    setTimeout(function () {
        bgImgSlideshow();
    }, 8000);

}

function bgImgChange() {
    $(".bgImg").css({
        'transition': 'opacity 0s',
        '-webkit-transition': 'opacity 0s',
        '-moz-transition': 'opaicty 0s'
    });
    var images = Array(
        "https://ppcdn.500px.org/98393139/676608e61b22af89cd6a51fd85e96614f6e5c0a8/2048.jpg",
        "https://ppcdn.500px.org/98393137/e2aa24b6017f2810ae22d566f40c493d1f615e63/2048.jpg",
        "https://ppcdn.500px.org/98393135/ae2f113c7b58c5aa31c4c42762f9a8e62986552b/2048.jpg");
    var last_img = $("#bgImg").css('background-image');
    if (last_img === "none") {
        last_img = images[0];
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