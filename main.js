const WIDTH = 320;
const HEIGHT = 200;

var canvas;
var palettes;
var wad;

var shownElements = ["wad-selection", "loading", "game"];

var fps = 35;
var ms = 1000/fps;

var tipText = "Loading...";


var frame = 0;
var dt_fps = 0;
var dt_ms = 0;

var flashing = false; //DEBUG
var fast = false;

var gamemode = "indetermined";

function loadFile()
{
	setShown("game");

    var htmlCanvas = document.getElementById("jsdoom-canvas");
	canvas = new Canvas(htmlCanvas, WIDTH, HEIGHT);

    var wadFile = document.getElementsByName("iwad")[0].files[0];

    wad = new WAD(wadFile, init);
}

function init()
{
    if(wad.lumpByName("MAP02")) //map01 may be missing
        gamemode = "commercial";
    else if(! wad.lumpByName("E2M1"))
        gamemode = "shareware";
    else if(! wad.lumpByName("E4M1"))
        gamemode = "registered";
    else
        gamemode = "retail";

    palettes = new Palettes(wad);
    wipe = new Wipe();

    setTimeout(run, 0, performance.now());
    console.log("Started loop");

    menu.init();
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


function run(dt)
{
	var dt_now = performance.now();
	dt_ms = dt_now - dt;
	dt_fps = 1/(dt_ms/1000);
	if(!fast) setTimeout(run, ms, [dt_now]);

    if (wipe.isWiping())
		wipe.wipe();
    else
	{
		update();
		draw();
	}

	canvas.drawText("fps: " + dt_fps.toFixed(2) + "\nms: " + dt_ms.toFixed(2), 0, 186);

	canvas.applyBuffer();

	if(fast) setTimeout(run, 0, [dt_now]);
}
function update()
{
	frame++;

	if(flashing)
        palettes.flash(frame % fps);

	gamestates[gamestate].update();
	menu.update();
}
function draw()
{
	gamestates[gamestate].draw();
	menu.draw();
}

setShown("wad-selection");
