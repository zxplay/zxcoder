class Widget
{
    constructor(parent, x, y, w, h)
    {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if (this.parent)
            this.parent._add(this);
    }

    // onDraw(ctx)
    // {
    // }

    // onPointerEvent(type, x, y)
    // {

    // }

    requestRedraw()
    {
        if (this.parent != null)
            this.parent.requestRedraw();
    }

    isPointerInside(x, y)
    {
        if (x < this.x) return false;
        if (y < this.y) return false;
        if (x > this.x + this.w) return false;
        if (y > this.y + this.h) return false;
        return true;
    }
}

class Group extends Widget
{
    constructor(win, parent, x, y, w, h)
    {
        super(parent, x, y, w, h);
        this.win = win;

        this.children = [];
        this.cwrb = {};   // child who received begin
        this.cwrb_entered = {};
    }

    _add(child)
    {
        this.children.push(child);
    }

    onDraw(ctx)
    {
        for (let i = 0; i < this.children.length; i++)
        {
            let child = this.children[i];
            child.onDraw(ctx);
        }
    }

    onPointerEvent(pointerId, type, x, y)
    {
        //console.log("Group.onPointerEvent: id = " + pointerId + ", type = " + type + ", x = " + x + ", y = " + y);
        let cuc = this._childUnderCursor(x, y);
        if (type == 'begin')
        {
            if (cuc != null)
            {
                this.cwrb[pointerId] = cuc;
                cuc.onPointerEvent('begin', x, y);
                this.cwrb_entered[pointerId] = true;
                cuc.onPointerEvent('enter', x, y);
            }
        }
        else if (type == 'move')
        {
            if (pointerId in this.cwrb)
            {
                if (this.cwrb_entered[pointerId])
                {
                    if (cuc != this.cwrb[pointerId])
                    {
                        this.cwrb_entered[pointerId] = false;
                        this.cwrb[pointerId].onPointerEvent('leave', x, y);
                    }
                }
                else
                {
                    if (cuc == this.cwrb[pointerId])
                    {
                        this.cwrb_entered[pointerId] = true;
                        this.cwrb[pointerId].onPointerEvent('enter', x, y);
                    }
                }
            }
            if (cuc != null)
            {
                cuc.onPointerEvent('move', x, y);
            }
        }
        else if (type == 'end')
        {
            if (pointerId in this.cwrb)
            {
                if (cuc == this.cwrb[pointerId])
                {
                    this.cwrb[pointerId].onPointerEvent('leave', x, y);
                }
            }

            if (cuc != null)
            {
                if (cuc == this.cwrb[pointerId])
                    cuc.onPointerEvent('end', x, y);
            }

            delete this.cwrb[pointerId];
            delete this.cwrb_entered[pointerId];
        }
    }

    _childUnderCursor(x, y)
    {
        for (let i = this.children.length - 1; i >= 0; i--)
        {
            let child = this.children[i];
            if (child.isPointerInside(x, y))
                return child;
        }
        return null;
    }

    requestRedraw()
    {
        if (this.parent != null)
            this.parent.requestRedraw();
        else if (this.win != null)
            this.win.requestRedraw();

    }

}

class ImageManager
{
    constructor(win)
    {
        this.imgtable = {};
        this.win = win;
    }

    imageForPath(path)
    {
        if (path in this.imgtable)
            return this.imgtable[path];

        var img = new Image();
        img.src = path;
        let that = this;

        img.onload = function(e) {
            that.imgtable[path] = img;
            if (that.win.ctx == null) return;
            that.win.requestRedraw();
            that.win.redrawIfRequested();
        }
        return img;
    }
}

class SingleWindow extends Group
{
    constructor(canvasId)
    {
        super(null, null, 0, 0, 0, 0);
        this.win = this;

        this.dolog = false;
        this.canvasId = canvasId;

        this.canvas = null;
        this.ctx = null;

        this.outerColor = '#000';
        this.bgColor = '#000';

        // window dimensions
        this.wi = {w:0, h:0};
        this.wiw = 0;
        this.wih = 0;

        // world dimensions
        this.wo = {x:0, y:0, w:0, h:0}

        // target dimensions
        this.dst = {w:0, h:0};

        // transform factors
        this.xf = {x:0, y:0, w:1, h:1}

        // redraw flag
        this.mustRedraw = false;

        // image manager
        this.imagemgr = new ImageManager(this);

        let that = this;
        window.addEventListener('load', function() { that._onload(); });
    }

    _onload()
    {
        if (this.dolog) console.log("SingleWindow._onload");

        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) {
            console.log("SingleWindow._onload: unable to find element with id " + this.canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        this._onresize();

        let that = this;
        window.addEventListener('resize', function() { that._onresize(); })

        this._setTouchHandler();

        this._ondraw();
    }

    _onresize()
    {
        if (this.dolog) console.log("SingleWindow._onresize");

        this.wi.w = this.dst.w;
        this.wi.h = this.dst.h;

        if (this.dolog) console.log("window size: " + this.wi.w + ' x ' + this.wi.h);

        this.canvas.width = this.wi.w;
        this.canvas.height = this.wi.h;

        this.wo.x = 0;
        this.wo.y = 0;
        this.wo.w = this.wi.w;
        this.wo.h = this.wi.h;

        this.xf.x = 0;
        this.xf.y = 0;
        this.xf.w = 1;
        this.xf.h = 1;
        
        this._ondraw();
    }

    _ondraw()
    {
        // this._setTransform(0, 0, 1, 1);
        // this.ctx.fillStyle = this.outerColor;
        // this.ctx.fillRect(0, 0, this.wi.w, this.wi.h);

        this._setTransform(this.xf.x, this.xf.y, this.xf.w, this.xf.h);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.wo.w, this.wo.h);

        super.onDraw(this.ctx);
    }

    _setTransform(x, y, w, h)
    {
        this.ctx.setTransform(w, 0, 0, h, x, y);
    }

    setTargetSize(w, h) {
        this.dst.w = w;
        this.dst.h = h;
    }

    _setTouchHandler()
    {
        let that = this;
        this._pehandler = new PointerEventHandler(this.canvas);
        this._pehandler.addEventListener(function(e) {
            var wox = (e.x - that.xf.x) / that.xf.w;
            var woy = (e.y - that.xf.y) / that.xf.h;
            that.onPointerEvent(e.pointerId, e.type, wox, woy);
            that.redrawIfRequested();
        });
    }

    requestRedraw() {
        //console.log("redraw requested");
        this.mustRedraw = true;
    }

    redrawIfRequested() {
        if (this.mustRedraw) {
            this._ondraw();
            this.mustRedraw = false;
        }
    }
}

class Control extends Widget
{
    constructor(parent, x, y, w, h)
    {
        super(parent, x, y, w, h);
        this.disabled = false;
        this.pressed = false;
        this.checked = false;

        this.rcvd_begin = false;

        this.on_begin = null;
        this.on_enter = null;
        this.on_leave = null;
        this.on_end = null;
    }

    onPointerEvent(type, x, y)
    {
        if (this.disabled)
            return;

        if (type == 'begin') {
            this.rcvd_begin = true;
            if (this.on_begin) this.on_begin();
            return;
        }

        if (this.rcvd_begin) {
            if (type == 'enter') {
                this.pressed = true;
                this.requestRedraw();
                if (this.on_enter) this.on_enter();
                return;
            }
            if (type == 'leave') {
                this.pressed = false;
                this.requestRedraw();
                if (this.on_leave) this.on_leave();
                return;
            }
            if (type == 'end') {
                if (this.on_end) this.on_end.call(this);
                return;
            }
        }
        
    }
}

class TextButton extends Control
{
    constructor(parent, x, y, w, h, text)
    {
        super(parent, x, y, w, h);
        this.text = (text ? text : 'button');
    }

    onDraw(ctx)
    {
        let x = this.x;
        let y = this.y;
        let w = this.w;
        let h = this.h;

        let d = 4;

        var grd = ctx.createLinearGradient(x, y, x, y+h);
        if (this.pressed) {
            grd.addColorStop(1, "#FFF");
            grd.addColorStop(0, "#000");
        }
        else {
            grd.addColorStop(0, "#FFF");    // gradient with transparent color: not supported
            grd.addColorStop(1, "#000");
        }
        
        ctx.fillStyle = '#E42';
        ctx.roundRect(x, y, w, h, 2*d).fill();

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = grd;
        ctx.roundRect(x, y, w, h, 2*d).fill();

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#E42';
        ctx.roundRect(x+d, y+d, w-d-d, h-d-d, d).fill();

        ctx.globalAlpha = 1;
        ctx.font = this.h/2 + "px Arial";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FEA';
        ctx.fillText(this.text, this.x+this.w/2, this.y+this.h/2);
    }

    onPointerEvent(type, x, y)
    {
        super.onPointerEvent(type, x, y);
        //console.log("TextButton.onPointerEvent: type = " + type + ", x = " + x + ", y = " + y + ", text = " + this.text);
    }
}

class ImageButton extends Control
{
    constructor(parent, x, y, w, h, imgup, imgdown)
    {
        super(parent, x, y, w, h);
        this.imgup = parent.win.imagemgr.imageForPath(imgup);
        if (imgdown)
            this.imgdown = parent.win.imagemgr.imageForPath(imgdown);
        else
            this.imgdown = null;
    }

    onDraw(ctx)
    {
        let x = this.x;
        let y = this.y;
        let w = this.w;
        let h = this.h;

        if (this.pressed) {
            if (this.imgdown != null) {
                ctx.drawImage(this.imgdown, x, y, w, h);
            }
            else {
                ctx.drawImage(this.imgup, x, y, w, h);
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = 'black';
                ctx.fillRect(x,y,w,h);
                ctx.globalAlpha = 1.0;
            }
        }
        else {
            ctx.drawImage(this.imgup, x, y, w, h);
        }
    }

    onPointerEvent(type, x, y)
    {
        super.onPointerEvent(type, x, y);
        //console.log("ImageButton.onPointerEvent: type = " + type + ", x = " + x + ", y = " + y + ", text = " + this.text);
    }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}

