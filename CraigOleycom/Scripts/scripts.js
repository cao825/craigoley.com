$(document).ready(function() {
    bgImgChange();
    bgImgSlideshow();
    $('[data-toggle="tooltip"]').tooltip();
});

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
    var images = Array(
        "https://drscdn.500px.org/photo/98434343/m=900/cebcaf988838055092036df59043cbfc",
        "https://drscdn.500px.org/photo/98393137/m=900/de2c2e0e7511b869d512b32dda1e5495",
        "https://drscdn.500px.org/photo/98393125/m=900/5535c06e50e7b045b0d0269e2c743013",
        "https://drscdn.500px.org/photo/98393135/m=900/b507261fe70abf3b997eead2bc163080",
        "https://drscdn.500px.org/photo/98393133/m=900/f606d6337e238cc82ebb7a651300a41f",
        "https://drscdn.500px.org/photo/98393139/m=900/acfbf97c0d8c63eb2ea72180da1f1572",
        "https://drscdn.500px.org/photo/98434347/m=900/5f92ade8da7652d1e2a2d1cf6c2b4a80",
        "https://drscdn.500px.org/photo/98434335/m=900/451309b22d792305f4585446c12fa050",
        "https://drscdn.500px.org/photo/98434329/m=900/6e0a6a243e6fee0ddcc279181d1d3b19",
        "https://drscdn.500px.org/photo/98434319/m=900/e9d4ff3c1afc3763e97959af92c91ac5");
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