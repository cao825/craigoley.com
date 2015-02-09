$(document).ready(function () {
    bgImgChange();
    bgImgSlideshow();
});

function bgImgSlideshow() {
    setTimeout(function () {
        bgImgChange();
    }, 4000);
}

function bgImgChange() {
    var images = Array(
        "https://ppcdn.500px.org/98393139/676608e61b22af89cd6a51fd85e96614f6e5c0a8/2048.jpg",
        "https://ppcdn.500px.org/98393137/e2aa24b6017f2810ae22d566f40c493d1f615e63/2048.jpg",
        "https://ppcdn.500px.org/98393135/ae2f113c7b58c5aa31c4c42762f9a8e62986552b/2048.jpg");
    var last_img = $("#bgImg").data('image');
    $("#oldBg").css({ 'background-image': 'url(' + last_img + ')' });
    $("#oldBg").removeClass('hidden');
    $("#bgImg").addClass('hidden');
    setTimeout(function () {
        var img = images[Math.floor(Math.random() * images.length)];
        $("#bgImg").css({
            'background-image': 'url(' + img + ')',
            'transition': 'opacity 2s ease-in-out',
            '-webkit-transition': 'opacity 2s ease-in-out',
            '-moz-transition': 'opaicty 2s ease-in-out'
        });
        $("#oldBg").css({
            'transition': 'opacity 2s ease-in-out',
            '-webkit-transition': 'opacity 2s ease-in-out',
            '-moz-transition': 'opaicty 2s ease-in-out'
        });
        $("#oldBg").addClass('hidden');
        $("#bgImg").removeClass('hidden');
    }, 4000);
}