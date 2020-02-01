var wad;

var shownElements = ["wad-selection", "loading", "game"];

var fps = 35;
var ms = 1000/fps;

var width = 320;
var height = 200;
var cwidth;
var cheight;
var swidth;
var sheight;

var useBuffer = true;
var screenBuffer = [];
var oldBuffer = [];

var ctx;
var ctxData;

var tipText = "Loading...";

var palettes = null;

var frame = 0;
var dt_fps = 0;
var dt_ms = 0;

var flashing = false; //DEBUG
var fast = false;

function loadFile()
{
	setShown("game");
	var canvas = document.getElementById("jsdoom-canvas");
	cwidth = canvas.width;
	cheight = canvas.height;
	swidth = cwidth/width;
	sheight = cheight/height;
	for(var x = 0; x < width; x++)
	{
		screenBuffer[x] = []
		oldBuffer[x] = []
		for(var y = 0; y < height; y++)
		{
			screenBuffer[x][y] = 0;
			oldBuffer[x][y] = 1;
		}
	}

	if(canvas.getContext)
	{
		ctx = canvas.getContext("2d");
		ctxData = ctx.getImageData(0, 0, cwidth, cheight);
	}

    var wadFile = document.getElementsByName("iwad")[0].files[0];

    var launch = function() {
        palettes = new Palettes(wad);

		setTimeout(run, 0, performance.now())

		console.log("Started loop")
    }

    wad = new WAD(wadFile, launch);
}

function setShown(e, loadMsg)
{
	for(var s in shownElements)
	{
		if(shownElements[s] == "loading")
			document.getElementById("loading-p").textContent = loadMsg;
		if(e == shownElements[s])
			document.getElementById(shownElements[s]).classList.remove('hidden');
		else
			document.getElementById(shownElements[s]).classList.add('hidden');
	}
}

function drawPixel(color, x, y)
{
	if(useBuffer)
	{
		screenBuffer[x][y] = color;
	}
	else
	{
		ctx.fillStyle = "rgb(" + palettes.get(color)[0] + ", " + palettes.get(color)[1] + ", " + palettes.get(color)[2] + ")";
		ctx.fillRect(x,y,1,1);
	}
}

function drawText(text, x, y)
{
	var w = 0;
	var h = 0;
	for(var i = 0; i < text.length; i++)
	{
		var c = text.charAt(i);
		if(c == "\n")
		{
			w = 0;
			h+=7;
		}
		else if(hu_font[c.toUpperCase()])
		{
			var p = drawPatch(hu_font[c.toUpperCase()], x+w,y+h)
			if(p)
			{
				if(w+p.width > width) break;
				w+=p.width;
			}
			else if(!useBuffer)
			{
				if(w+8 > width) break;
				ctx.fillText(c, x+w, y+h+10);
				w += 8;
			}
		}
		else
		{
			w += 4;
		}
	}
}

function drawPatch(patch, x, y)
{
    var p = wad.patch(patch);

	if(! p)
        return null;

    for(var w = 0; w < p.width; w++)
    {
        for(var h = 0; h < p.height; h++)
        {
            if(p.img[w][h] >= 0)
            {
                drawPixel(p.img[w][h], x + w - p.xOffset,y+h-p.yOffset)
            }
        }
    }

	return p;
}
function run(dt)
{
	var dt_now = performance.now();
	dt_ms = dt_now - dt;
	dt_fps = 1/(dt_ms/1000);
	if(!fast) setTimeout(run, ms, [dt_now]);
	if(!wipe.gonnaWipe)
	{
		update();
		draw();
	}
	if(wipe.gonnaWipe)
	{
		wipe.wipe();
	}
	applyBuffer();
	if(fast) setTimeout(run, 0, [dt_now]);
}
function update()
{
	frame++;
	tipText = "fps: " + dt_fps.toFixed(2) + "\nms: " + dt_ms.toFixed(2);

	if(flashing)
        palettes.flash(frame / fps);

	if(frame == 175)
		wipe.startWiping();
}
function draw()
{
	drawPatch(frame < 175 ? "TITLEPIC" : "CREDIT", 0, 0);
	drawText(tipText, 0, 0);
}
function applyBuffer()
{
    if(! useBuffer)
        return;

    for(var x = 0; x < width; x++)
    {
        for(var y = 0; y < height; y++)
        {
            var c = (x+(y*cwidth))*4;
            if((! palettes.currentIsOld()) || screenBuffer[x][y] != oldBuffer[x][y])
            {
                ctxData.data[c] = palettes.get(screenBuffer[x][y])[0];
                ctxData.data[c+1] = palettes.get(screenBuffer[x][y])[1];
                ctxData.data[c+2] = palettes.get(screenBuffer[x][y])[2];
                ctxData.data[c+3] = 255;
                /*ctx.fillStyle = "rgb(" + palettes.get(screenBuffer[x][y])[0] + ", " + palettes.get(screenBuffer[x][y])[1] + ", " + palettes.get(screenBuffer[x][y])[2] + ")";
                    ctx.fillRect(x*swidth,y*sheight,swidth,sheight);*/
            }
        }
    }

    ctx.putImageData(ctxData, 0, 0);

    oldBuffer = [];

    for(var x = 0; x < width; x++)
        oldBuffer[x] = screenBuffer[x].slice();

    palettes.updateOld();
}

setShown("wad-selection");
