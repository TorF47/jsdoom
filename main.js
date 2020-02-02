var jsDoom;

var gamemode = "indetermined";

class JSDoom
{
    /**
     * Objects are initialised during launch() method.
     * Show WAD selection form.
     **/
    constructor()
    {
        // Main objects.
        this.canvas = null;
        this.core = null;
        this.menus = null;
        this.palettes = null;
        this.wad = null;
        this.wipe = null;

        this.WIDTH = 320;
        this.HEIGHT = 200;

        this.setShown("wad-selection");
    }

    /**
     * Display specified HTML element, hide others.
     **/
    setShown(e, loadMsg)
    {
        var shownElements = ["wad-selection", "loading", "game"];

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

    /**
     * Display canvas and load WAD.
     **/
    launch()
    {
        this.setShown("game");

        var htmlCanvas = document.getElementById("jsdoom-canvas");

        this.canvas = new Canvas(htmlCanvas, this.WIDTH, this.HEIGHT);

        var wadFile = document.getElementsByName("iwad")[0].files[0];

        var callback = function() {
            jsDoom.init(); // Preserve context.
        }

        this.wad = new WAD(wadFile, callback);
    }

    /**
     * Initialise objects after WAD is loaded.
     * Start main loop.
     **/
    init()
    {
        gamemode = this.wad.gamemode();

        this.palettes = new Palettes(this.wad);
        this.wipe = new Wipe();
        this.core = new Core();
        this.menus = new Menus();

        this.core.setTimeout(0, performance.now());

        console.log("Started loop");

        this.menus.initialize();
    }
}

jsDoom = new JSDoom();
