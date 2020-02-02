/**
 * WAD file data.
 * A collection of Lump.
 **/
class WAD
{
    /**
     * Read WAD file.
     * @param {File} Wad file.
     * @param {Function} callback Call when WAD file is fully loaded.
     * @throw {Error} WAD file cannot be initialized.
     **/
    constructor(file, callback)
    {
        console.log("Reading WAD file", file)

        var reader = new FileReader();
        var me = this;

        reader.onload = function() {
            me.readData(reader.result);

            callback();
        }

        reader.readAsArrayBuffer(file);
    }

    /**
     * Initialize properties from data file content.
     * @param {string} data WAD file content.
     **/
	readData(data)
	{
		this.data = data;
		this.dataView = new DataView(data);
		this.dirOffset = this.dataView.getInt32(8, true);
        this.decoder = new TextDecoder("utf-8");

		this.type = this.wadKind(data);

        this.lumps = this.readLumps();
	}

    /**
     * Return wad file kind.
     * @param {string} data WAD file content.
     * @return {string} 'IWAD' or 'PWAD'.
     * @throw {Error} Invalid WAD file.
     **/
	wadKind(data)
	{
		var s = new Uint8Array(data, 0, 4);

		if(s[1] == 87 && s[2] == 65 && s[3] == 68)
		{
            switch(s[0])
            {
                case 73: return 'IWAD';
                case 80: return 'PWAD';
            }
		}

		throw new Error("Invalid WAD file.");
	}

    /**
     * Read and return lumps.
     * @return {Lump[]}
     **/
    readLumps()
    {
        var lumps = {};
		var lumpCount = this.dataView.getInt32(4, true);

		console.log("found " + lumpCount + " lumps in WAD.");

		for(var i = 0 ; i < lumpCount ; i++)
		{
            var lump = new Lump(this, i);

            lumps[lump.name] = lump;
		}

        return lumps;
    }

    /**
     * Return a lump from its name.
     * @param {string} Name of lump to search.
     * @return {Lump} null if lump not found.
     **/
    lumpByName(name)
    {
        if (this.lumps[name] === 'undefined')
            return null;

        return this.lumps[name];
    }

    /**
     * Return a lump patch from its name.
     * @param {string} Name of lump to search.
     * @return {Lump} null if lump not found.
     **/
    patch(name)
    {
        var lump = this.lumpByName(name);

        if (! lump)
            return null;

        return lump.getPatch();
    }

    /**
     * Return wad gamemode.
     * @return {string}
     **/
    gamemode()
    {
        if(this.lumpByName("MAP02")) //map01 may be missing
            return "commercial";

        if(! this.lumpByName("E2M1"))
            return "shareware";

        if(! this.lumpByName("E4M1"))
            return "registered";

        return "retail";
    }
}
