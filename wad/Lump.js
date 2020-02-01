/**
 * WAD file lump.
 **/
class Lump
{
    /**
     * Initialize Lump from WAD.
     * @param {WAD} wad
     * @param {int} Lump number in WAD.
     **/
    constructor(wad, position)
    {
        var wadOffset = wad.dirOffset + (position * 16);
        this.offset = wad.dataView.getInt32(wadOffset, true);
        this.length = wad.dataView.getInt32(wadOffset + 4, true);

        var nameData = new Uint8Array(wad.data, wadOffset + 8, 8)
        this.name = wad.decoder.decode(nameData).replace(/\u0000.*$/g, '');

        this.data = wad.data.slice(this.offset, this.offset + this.length);
        this.dataView = new DataView(this.data);

        this.patch = null;
    }

    /**
     * Return Lump patch.
     * @return {Patch}
     **/
    getPatch()
    {
        if (! this.patch)
            this.patch = new Patch(this);

        return this.patch;
    }
}
