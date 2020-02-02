/**
 * Wipe visual effect.
 **/
class Wipe
{
    constructor()
    {
        this.gonnaWipe = false;
        this.wiping = false;
        this.startScreen;
        this.endScreen;
        this.columns = [];
    }

    /**
     * Return `true` if actually wipping, `false` else.
     * @return {bool}
     **/
    isWiping()
    {
        return this.gonnaWipe;
    }

    startWiping()
    {
        this.gonnaWipe = true;
        this.columns = [];
        this.startScreen = [];
        this.endScreen = [];
    }

    end()
    {
        this.gonnaWipe = false;
        this.wiping = false;
        this.columns = [];
        this.startScreen = [];
        this.endScreen = [];
    }

    /**
     * Display wipe effect.
     **/
    wipe()
    {
        var w = WIDTH/2;

        if(! this.wiping)
        {
            this.wiping = true;

            for(var x = 0; x < WIDTH; x++)
            {
                this.startScreen[x] = canvas.oldBuffer[x].slice();
                this.endScreen[x] = canvas.screenBuffer[x].slice();
            }

            this.columns[0] = -(M_Random() % 16);

            for(var x = 1 ; x < w ; x++)
            {
                var r = (M_Random() % 3) - 1;

                this.columns[x] = this.columns[x - 1] + r;

                if(this.columns[x] > 0)
                    this.columns[x] = 0;
                else if(this.columns[x] == -16)
                    this.columns[x] = -15;
            }
        }

        var nothing = true;

        for(var x = 0 ; x < w ; x++)
        {
            if(this.columns[x] < 0)
            {
                nothing = false;
                this.columns[x]++;

                for(var y = 0 ; y < HEIGHT ; y++)
                    for(var T = 0; T <= 1; T++)
                    {
                        var bufX = (x * 2) + T;

                        canvas.screenBuffer[bufX][y] = this.startScreen[bufX][y];
                    }
            }
            else if(this.columns[x] >= 0)
            {
                if(this.columns[x] < HEIGHT)
                    nothing = false;

                var dy = (this.columns[x] < 16) ? this.columns[x] + 1 : 8;

                if(this.columns[x] + dy >= HEIGHT)
                    dy = HEIGHT - this.columns[x];

                this.columns[x] += dy;

                for(var y = 0 ; y < HEIGHT ; y++)
                    for(var T = 0; T <= 1; T++)
                    {
                        var bufX = (x * 2) + T;
                        var color;

                        if(y < this.columns[x])
                            color = this.endScreen[bufX][y];
                        else
                            color = this.startScreen[bufX][y - this.columns[x]];

                        canvas.screenBuffer[bufX][y] = color;
                    }
            }
        }

        if(nothing)
            this.end();
    }
}
