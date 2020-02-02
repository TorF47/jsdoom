var menu = {}
var paused = false;

var itemOn = 0;
var whichSkull = 0;
var skullAnimCounter = 10;
var skullName = ["M_SKULL1","M_SKULL2"];

var currentMenu = "mainmenu";

class Menuitem
{
	constructor(status, name, alphaKey, routine)
	{
		this.status = status;
		this.name = name;
		this.routine = routine;
		this.alphaKey = alphaKey;
	}
}
class Menu
{
	constructor(numitems, prevMenu, menuitems, routine, x, y, lastOn)
	{
		this.numitems = numitems;
		this.prevMenu = prevMenu;
		this.menuitems = menuitems;
		this.routine = routine,
		this.x = x;
		this.y = y;
		this.lastOn = lastOn;
	}
}

menu.pause = function()
{
	menu.SetupNextMenu("mainmenu")
	paused = true;
}
menu.unpause = function()
{
	paused = false;
}

menu.init = function()
{
	window.addEventListener("keydown", menu.onKeyDown, true);
	switch(gamemode)
	{
		case "commercial":
			menu["mainmenu"].menuitems[4] = menu["mainmenu"].menuitems[5];
			menu["mainmenu"].numitems--;
			menu["mainmenu"].y += 8;
			menu["newgame"].prevMenu = "mainmenu";
			break;
		case "shareware":
		case "registered":
			menu["episode"].numitems--;
			break;
	}
}

menu.draw = function()
{
	if(paused)
	{
		var c = menu[currentMenu];
		if(c)
		{
			if(c.routine)
			{
				c.routine();
			}

			var x = c.x;
			var y = c.y;
			for(var i = 0; i < c.numitems; i++)
			{
				if(c.menuitems[i].name)
				{
					canvas.drawPatch(c.menuitems[i].name, x, y);
				}
				y += 16;
			}
			canvas.drawPatch(skullName[whichSkull], x-32, c.y - 5 + itemOn*16);
		}
	}
}
menu.update = function()
{
	skullAnimCounter--;
	if(skullAnimCounter <= 0)
	{
		whichSkull ^= 1;
		skullAnimCounter = 8;
	}
}

menu.onKeyDown = function(e)
{
	if(wipe.wiping) return;
	if(paused)
	{
		switch(e.keyCode)
		{
			case 27:
				menu.unpause();
				break;
			case 38:
				itemOn--;
				if(itemOn < 0) itemOn = menu[currentMenu].numitems-1;
				break;
			case 40:
				itemOn++;
				if(itemOn >= menu[currentMenu].numitems) itemOn = 0;
				break;
			case 8:
				if(menu[currentMenu].prevMenu)
					currentMenu = prevMenu;
				break;
			case 13:
				if(menu[currentMenu].menuitems[itemOn].routine)
					menu[currentMenu].menuitems[itemOn].routine();
				break;
		}
	}
	else
	{
		if(e.keyCode == 27)
		{
			menu.pause();
			//playsound
		}
		if(title)
		{
			menu.pause();
		}
	}
}

menu["mainmenu"] = new Menu(
	6,
	null,
	[
		new Menuitem(1, "M_NGAME", "n", function()
		{
			if(gamemode == "commercial")
				menu.SetupNextMenu("newgame");
			else
				menu.SetupNextMenu("episode");
		}),
		new Menuitem(1, "M_OPTION", "o", null),
		new Menuitem(1, "M_LOADG", "l", null),
		new Menuitem(1, "M_SAVEG", "s", null),
		new Menuitem(1, "M_RDTHIS", "r", null),
		new Menuitem(1, "M_QUITG", "q", null),
	],
	function()
	{
		canvas.drawPatch("M_DOOM", 92, 2);
	},
	97, 64,
	0
);

menu["episode"] = new Menu(
	4,
	"mainmenu",
	[
		new Menuitem(1, "M_EPI1", "k", function()
		{
			menu.SetupNextMenu("newgame");
		}),
		new Menuitem(1, "M_EPI2", "t", function()
		{
			menu.SetupNextMenu("newgame");
		}),
		new Menuitem(1, "M_EPI3", "i", function()
		{
			menu.SetupNextMenu("newgame");
		}),
		new Menuitem(1, "M_EPI4", "t", function()
		{
			menu.SetupNextMenu("newgame");
		}),
	],
	function()
	{
		canvas.drawPatch("M_EPISOD", 54, 38);
	},
	48, 63,
	0
);

menu["newgame"] = new Menu(
	5,
	"episode",
	[
		new Menuitem(1, "M_JKILL",	"i", null),
		new Menuitem(1, "M_ROUGH",	"i", null),
		new Menuitem(1, "M_HURT",	"i", null),
		new Menuitem(1, "M_ULTRA",	"i", null),
		new Menuitem(1, "M_NMARE",	"i", null),
	],
	function()
	{
		canvas.drawPatch("M_NEWG", 96, 14);
		canvas.drawPatch("M_SKILL", 54, 38);
	},
	48, 63,
	2
);

menu.SetupNextMenu = function(m)
{
	if(menu[m])
	{
		menu[currentMenu].lastOn = itemOn;
		currentMenu = m;
		itemOn = menu[currentMenu].lastOn;
	}
}
