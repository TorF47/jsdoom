/**
 * Main loop.
 **/

class Core
{
    constructor()
    {
        this.fast = false;
        this.frame = 0;
        this.flashing = false; //DEBUG

        this.FPS = 35;
        this.MS = 1000 / this.FPS;
    }

    /**
     * Planify next loop.
     * Preserve core context.
     **/
    setTimeout(ms, now)
    {
        var callback = function(dt) {
            jsDoom.core.run(dt);
        };

        setTimeout(callback, ms, now);
    }

    run(dt)
    {
        var dt_now = performance.now();
        var dt_ms = dt_now - dt;
        var dt_fps = 1 / ( dt_ms / 1000);

        if(! this.fast)
            this.setTimeout(this.MS, [dt_now]);

        if (jsDoom.wipe.isWiping())
            jsDoom.wipe.wipe();
        else
        {
            this.update();
            this.draw();
        }

        var text = "fps: " + dt_fps.toFixed(2) + "\nms: " + dt_ms.toFixed(2);
        jsDoom.canvas.drawText(text, 0, 186);

        jsDoom.canvas.applyBuffer();

        if(this.fast)
            this.setTimeout(0, [dt_now]);
    }

    update()
    {
        this.frame++;

        if(this.flashing)
            jsDoom.palettes.flash(this.frame % this.FPS);

        gamestates[gamestate].update();

        menu.update();
    }

    draw()
    {
        gamestates[gamestate].draw();

        menu.draw();
    }
}
