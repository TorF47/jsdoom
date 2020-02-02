/**
 * Collection of palette.
 **/
class Palettes
{
    /**
     * Initialize palettes from WAD.
     * @param {WAD} wad
     * throw {Error} Initialisation cannot be done.
     **/
    constructor(wad)
    {
        this.data = [[]];
        this.current = 0; // current palette.
        this.old = 1; // old palette.

        for(var i = 0; i < 256; i++)
            this.data[0][i] = [i, i, i];

        this.readLump(wad);
    }

    /**
     * Read palettes from PLAYPAL lump.
     * @param {WAD} wad
     * throw {Error} Lump not found.
     **/
    readLump(wad)
    {
        var lump = wad.lumpByName('PLAYPAL');

        if (! lump)
            throw new Error('PLAYPAL lump not found.');

        var l = Math.floor(lump.length / 768);

        for(var k = 0 ; k < l ; k++)
        {
            this.data[k] = [];

            for(var j = 0; j < 256; j++)
                this.data[k][j] = [
                    lump.dataView.getUint8((k*768)+(j*3)),
                    lump.dataView.getUint8((k*768)+(j*3+1)),
                    lump.dataView.getUint8((k*768)+(j*3+2))
                ];
        }

        console.log("Loaded " + l + " palettes.");
    }

    /**
     * Return RGB of the current palette.
     * @param {int} Palette index.
     * @return [{int, int, int]} RGB
     **/
    get(color)
    {
        if(this.data[this.current])
            return this.data[this.current][color];

        return this.data[0][color];
    }

    /**
     * Return true if current palette is the same as old palette.
     * @return {bool}
     **/
    currentIsOld()
    {
        return this.current  == this.old;
    }

    /**
     * Apply flashing effect.
     * @param {float} ratio Frame % fps ratio.
     **/
    flash(ratio)
    {
		if(current > 9)
            current--; //DEBUG STUFF
		else
		{
			if(! ratio)
                current = 12;
			else
                current = 0;
		}
    }

    /**
     * Set old as current.
     **/
    updateOld()
    {
        this.old = this.current;
    }

    /**
     * Return RGB description of the specified color.
     * @param {int} color
     * @return {string}
     **/
    rgb(color)
    {
        var palette = this.get(color);

        var rgb = "rgb(" + palette[0] + ", " + palette[1] + ", " + palette[2] + ")";

        return rgb;
    }

}
