/**
 * Collection of Menu.
 **/
class Menus
{
    constructor()
    {
        this.menus = [];
        this.paused  = false;
        this.current = null;
        this.itemOn = 0;
        this.whichSkull = 0;
        this.skullAnimCounter = 10;
        this.skullName = ["M_SKULL1","M_SKULL2"];
    }

    initialize()
    {
        this.createMenus();

        this.current = this.get('mainmenu');

        var keyDownCallback = function(event) {
            jsDoom.menus.onKeyDown(event); // Preserve context.
        }

        window.addEventListener("keydown", keyDownCallback, true);

        switch(gamemode)
        {
            case "commercial":
                this.get("mainmenu").menuitems[4] = this.get("mainmenu").menuitems[5];
                this.get("mainmenu").numitems--;
                this.get("mainmenu").y += 8;
                this.get("newgame").prevMenu = "mainmenu";
                break;

            case "shareware":
            case "registered":
                this.get("episode").numitems--;
                break;
        }
    }

    onKeyDown(e)
    {
        if(jsDoom.wipe.wiping)
            return;

        if(this.paused)
        {
            switch(e.keyCode)
            {
                case 27:
                    this.unpause();
                    break;

                case 38:
                    this.itemOn--;
                    if(this.itemOn < 0)
                        this.itemOn = this.current.numitems - 1;
                    break;

                case 40:
                    this.itemOn++;
                    if (this.itemOn >= this.current.numitems)
                        this.itemOn = 0;
                    break;

                case 8:
                    if (this.current.prevMenu)
                    {
                        this.current = this.get(this.current.prevMenu);
                        this.itemOn = this.current.lastOn;
                    }
                    break;

                case 13:
                    if (this.current.menuitems[this.itemOn].routine)
                        this.current.menuitems[this.itemOn].routine();
                    break;
            }
        }
        else
        {
            if(e.keyCode == 27)
            {
                this.pause();
                //playsound
            }

            if(title)
            {
                this.pause();
            }
        }
    }

    /**
     * Set the menu.
     * @param {String} name Name of menu.
     **/
    setupNextMenu(name)
    {
        var menu = this.get(name);

        if (! menu)
            return;

        this.current.lastOn = this.itemOn;
        this.current = menu;
        this.itemOn = menu.lastOn;
    }

    /**
     * Return menu from its name.
     * @param {String} name
     * @return {Menu} null if menu not found.
     **/
    get(name)
    {
        if (typeof(this.menus[name]) === 'undefined')
            return null;

        return this.menus[name];
    }

    pause()
    {
        this.setupNextMenu("mainmenu");
        this.paused = true;
    }

    unpause()
    {
        this.paused = false;
    }

    draw()
    {
        if(! this.paused)
            return;

        if (! this.current)
            return;

        if (this.current.routine)
            this.current.routine();

        var x = this.current.x;
        var y = this.current.y;

        for(var i = 0 ; i < this.current.numitems ; i++)
        {
            if (this.current.menuitems[i].name)
                jsDoom.canvas.drawPatch(this.current.menuitems[i].name, x, y);

            y += 16;
        }

        var y = this.current.y - 5 + this.itemOn * 16;

        jsDoom.canvas.drawPatch(this.skullName[this.whichSkull], x - 32, y);
    }

    update()
    {
        this.skullAnimCounter--;

        if(this.skullAnimCounter > 0)
            return;

        this.whichSkull ^= 1;
        this.skullAnimCounter = 8;
    }

    /**
     * Add a menu.
     * @param {String} name Menu name.
     * @param {Menu} menu The menu to add.
     **/
    add(name, menu)
    {
        this.menus[name] = menu;
    }

    createMenus()
    {
        this.add('mainmenu', new Menu(
            6,
            null,
            [
                new Menuitem(1, "M_NGAME", "n", function() {
                        if(gamemode == "commercial")
                            jsDoom.menus.setupNextMenu("newgame");
                        else
                            jsDoom.menus.setupNextMenu("episode");
                    }),
                new Menuitem(1, "M_OPTION", "o", null),
                new Menuitem(1, "M_LOADG", "l", null),
                new Menuitem(1, "M_SAVEG", "s", null),
                new Menuitem(1, "M_RDTHIS", "r", null),
                new Menuitem(1, "M_QUITG", "q", null)
            ],
            function() {
                jsDoom.canvas.drawPatch("M_DOOM", 92, 2);
            },
            97, 64,
            0
        ));

        this.add('episode', new Menu(
            4,
            "mainmenu",
            [
                new Menuitem(1, "M_EPI1", "k", function() {
                    jsDoom.menus.setupNextMenu("newgame");
                }),
                new Menuitem(1, "M_EPI2", "t", function() {
                    jsDoom.menus.setupNextMenu("newgame");
                }),
                new Menuitem(1, "M_EPI3", "i", function() {
                    jsDoom.menus.setupNextMenu("newgame");
                }),
                new Menuitem(1, "M_EPI4", "t", function() {
                    jsDoom.menus.setupNextMenu("newgame");
                })
            ],
            function() {
                jsDoom.canvas.drawPatch("M_EPISOD", 54, 38);
            },
            48, 63,
            0
        ));

        this.add('newgame', new Menu(
            5,
            "episode",
            [
                new Menuitem(1, "M_JKILL",	"i", null),
                new Menuitem(1, "M_ROUGH",	"i", null),
                new Menuitem(1, "M_HURT",	"i", null),
                new Menuitem(1, "M_ULTRA",	"i", null),
                new Menuitem(1, "M_NMARE",	"i", null),
            ],
            function() {
                jsDoom.canvas.drawPatch("M_NEWG", 96, 14);
                jsDoom.canvas.drawPatch("M_SKILL", 54, 38);
            },
            48, 63,
            2
        ));
    }
}
