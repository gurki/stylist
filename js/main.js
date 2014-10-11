////////////////////////////////////////////////////////////////////////////////
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var hsla;
var buffer;
var colorise = true;


////////////////////////////////////////////////////////////////////////////////
var image = new Image();

image.onload = function() 
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    buffer = context.getImageData(0, 0, canvas.width, canvas.height);
    hsla = [];

    var hsl;

    for (var i = 0; i < buffer.data.length; i += 4)
    {
        hsl = rgbToHsl(buffer.data[i], buffer.data[i+1], buffer.data[i+2]);

        hsla[i] = hsl.h * 360;
        hsla[i+1] = hsl.s * 100;
        hsla[i+2] = hsl.l * 100;
        hsla[i+3] = buffer.data[i+3];
    }

    updateColor();
};

// image.src = 'img/kaia_mask.png';
// image.src = 'img/zofie_mask.png';


////////////////////////////////////////////////////////////////////////////////
function colorisePixel(i, h, s, l)
{
    rgb = hslToRgb(h, s, hsla[i+2] + l);

    buffer.data[i] = rgb.r;
    buffer.data[i+1] = rgb.g;
    buffer.data[i+2] = rgb.b;
}


function updateColor()
{
    var h = $('#hueRange').val();
    var s = $('#satRange').val();
    var l = $('#ligRange').val() * 2 - 100;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (colorise) 
    {
        for (var i = 0; i < buffer.data.length; i += 4) {
            colorisePixel(i, h, s, l);
        }

        context.putImageData(buffer, 0, 0);
    }
}


////////////////////////////////////////////////////////////////////////////////
function setHue(value) {
    $('#hueRange').val(value);
    updateColor();
}


function setSaturation(value) {
    $('#satRange').val(value);
    updateColor();
}


function setLightness(value) {
    $('#ligRange').val(value);
    updateColor();
}


function setShouldColorise(value) 
{
    if (value) {
        $('#colButton').text('COLORISE');
        colorise = true;
    } else {
        $('#colButton').text('UNCOLORED');
        colorise = false;
    }

    updateColor();
}


function setImage(value) 
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (value == 'ZOFIE') {
        $('#imgButton').text('ZOFIE');
        $("#image").attr('src', 'img/zofie.jpg');
        image.src = 'img/zofie_mask.png';
    } else {
        $('#imgButton').text('KAIA');
        $("#image").attr('src', 'img/kaia_crop.jpg');
        image.src = 'img/kaia_crop_mask.png';
    }
}


////////////////////////////////////////////////////////////////////////////////
$('#hueButton').on('click', function() {
    setHue(0);
});


$('#satButton').on('click', function() {
    setSaturation(50);
});


$('#ligButton').on('click', function() {
    setLightness(50);
});


$('#colButton').on('click', function() {
    setShouldColorise($(this).text() != 'COLORISE');
});


$('#imgButton').on('click', function()
{
    if ($(this).text() == 'KAIA') {
        setImage('ZOFIE');
    } else {
        setImage('KAIA');
    }
});


$('#linkButton').on('click', function()
{
    imgName = (($('#imgButton').text() == 'ZOFIE') ? 0 : 1);

    var link = 'tobiasgurdan.de/stylist/';
    link += '?h=' + $('#hueRange').val();
    link += '&s=' + $('#satRange').val();
    link += '&l=' + $('#ligRange').val();
    link += '&p=' + imgName;
    link += '&/#';

    window.prompt('copy and share :)', link);
});


////////////////////////////////////////////////////////////////////////////////
window.onload = function()
{
    var urlHue = getUrlValue('h');
    var urlSat = getUrlValue('s');
    var urlLig = getUrlValue('l');

    
    if (typeof urlHue != 'undefined') {
        setHue(urlHue);
    };


    if (typeof urlSat != 'undefined') {
        setSaturation(urlSat);
    };


    if (typeof urlLig != 'undefined') {
        setLightness(urlLig);
    };
};


var urlPer = getUrlValue('p');

if (urlPer == 1) {
    setImage('KAIA');
} else {
    setImage('ZOFIE');
} 


function getUrlValue(varSearch) 
{
    var searchString = window.location.search.substring(1);
    var variableArray = searchString.split('&');
    for(var i = 0; i < variableArray.length; i++){
        var keyValuePair = variableArray[i].split('=');
        if(keyValuePair[0] == varSearch){
            return keyValuePair[1];
        }
    }
}