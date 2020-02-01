class Patch
{
    /**
     * Initialize patch from lump.
     * @param {Lump} lump
     **/
	constructor(lump)
	{
		this.width = lump.dataView.getUint16(0, true);
		this.height = lump.dataView.getUint16(2, true);
		this.xOffset = lump.dataView.getInt16(4, true);
		this.yOffset = lump.dataView.getInt16(6, true);

        this.img = this.readImage(lump);
    }

    /**
     * Read image from Lump
     **/
    readImage(lump)
    {
		var img = [];
		var columns = [];
		
		for(var i = 0 ; i < this.width ; i++)
		{
			img[i] = [];

			for(var y = 0; y < this.height; y++)
				img[i][y] = -1; //transparency

			columns[i] = [];
			columns[i].offset = lump.dataView.getUint32(8+(i*4), true);
			
			var topdelta = 0x00;
			var length = 0;

			for(var k = 0 ; topdelta < 0xFF ; k++)
			{
				topdelta = lump.dataView.getUint8(columns[i].offset + length);

				if(topdelta >= 0xFF)
                    break;

				columns[i][k] = {};
				columns[i][k].topdelta = topdelta;
				columns[i][k].size = lump.dataView.getUint8(columns[i].offset + length + 1);
				columns[i][k].data = [];

				for(var j = 0 ; j < columns[i][k].size ; j++)
				{
					columns[i][k].data[j] = lump.dataView.getUint8(columns[i].offset + length + 3 + j);

					if(topdelta + j < this.height)
						img[i][topdelta + j] = columns[i][k].data[j];
				}

				length += columns[i][k].size + 4;
			}

			if(topdelta >= 0xFF)
                continue;
		}

        return img;
	}
}
