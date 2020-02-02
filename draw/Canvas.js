class Canvas
{
    /**
     * @param {Document Element} canvas The HTML document canvas.
     * @param {int} width
     * @param {int} height
     * @thorw {Error} Canvas cannot be initialised.
     **/
    constructor(canvas, width, height)
    {
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.cwidth = canvas.width;
        this.cheight = canvas.height;
        this.swidth = this.cwidth / width;
        this.sheight = this.cheight / height;

        this.useBuffer = true;
        this.screenBuffer = [];
        this.oldBuffer = [];

        for(var x = 0 ; x < width ; x++)
        {
            this.screenBuffer[x] = [];
            this.oldBuffer[x] = [];

            for(var y = 0 ; y < height ; y++)
            {
                this.screenBuffer[x][y] = 0;
                this.oldBuffer[x][y] = 1;
            }
        }

        if(! canvas.getContext)
            throw new Error('Canvas has no context.');

        this.ctx = canvas.getContext("2d");
        this.ctxData = this.ctx.getImageData(0, 0, this.cwidth, this.cheight);
    }

    /**
     * Draw a pixel.
     * @param {int} color
     * @param {int} x
     * @param {int} y
     **/
    drawPixel(color, x, y)
    {
        if (x < 0 || x >= this.width)
            return;

        if (y < 0 || y >= this.height)
            return;

        if(this.useBuffer)
            this.screenBuffer[x][y] = color;
        else
        {
            var rgb = jsDoom.palettes.rgb(color);

            this.ctx.fillStyle = rgb;

            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    /**
     * Display buffer in canvas.
     **/
    applyBuffer()
    {
        if(! this.useBuffer)
            return;

        var paletteChange = ! jsDoom.palettes.currentIsOld();

        for(var x = 0; x < this.width; x++)
        {
            for(var y = 0; y < this.height; y++)
            {
                if(paletteChange || this.screenBuffer[x][y] != this.oldBuffer[x][y])
                {
                    var rgb = jsDoom.palettes.get(this.screenBuffer[x][y]);
                    var c = (x + (y * this.cwidth)) * 4;

                    this.ctxData.data[c] = rgb[0];
                    this.ctxData.data[c+1] = rgb[1];
                    this.ctxData.data[c+2] = rgb[2];
                    this.ctxData.data[c+3] = 255;
                    /*this.ctx.fillStyle = "rgb(" + jsDoom.palettes.get(this.screenBuffer[x][y])[0] + ", " + jsDoom.palettes.get(this.screenBuffer[x][y])[1] + ", " + jsDoom.palettes.get(this.screenBuffer[x][y])[2] + ")";
                    this.ctx.fillRect(x*this.swidth,y*this.sheight,this.swidth,this.sheight);*/
                }
            }
        }

        this.ctx.putImageData(this.ctxData, 0, 0);

        this.oldBuffer = [];

        for(var x = 0; x < this.width; x++)
            this.oldBuffer[x] = this.screenBuffer[x].slice();

        jsDoom.palettes.updateOld();
    }

    /**
     * Draw specified text.
     * @param {string} text
     * @param {int} x Position
     * @param {int} y Position
     **/
    drawText(text, x, y)
    {
        var w = 0;
        var h = 0;

        for(var i = 0; i < text.length; i++)
        {
            var c = text.charAt(i);

            if(c == "\n")
            {
                w = 0;
                h += 7;
                continue;
            }

            if(! hu_font[c.toUpperCase()])
            {
                w += 4;
                continue;
            }

            var name = hu_font[c.toUpperCase()];
            var p = this.drawPatch(name, x + w, y + h);

            if(p)
            {
                if(w + p.width > this.width)
                    break;

                w += p.width;
                continue;
            }

            if(! this.useBuffer)
            {
                if (w + 8 > this.width)
                    break;

                this.ctx.fillText(c, x + w, y + h + 10);
                w += 8;
            }
        }
    }

    /**
     * Draw specified patch.
     * @param {string} name Patch/lumb name
     * @param {int} x Position
     * @param {int} y Position
     * @return {Patch} null if path not found.
     **/
    drawPatch(name, x, y)
    {
        var p = jsDoom.wad.patch(name);

        if(! p)
            return null;

        for(var w = 0 ; w < p.width ; w++)
            for(var h = 0 ; h < p.height ; h++)
                if(p.img[w][h] >= 0)
                    this.drawPixel(p.img[w][h], x + w - p.xOffset, y + h - p.yOffset)

        return p;
    }
}
