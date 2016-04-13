
function Log(descr) {
    this.setup(descr);
}

Log.prototype = Object.create(Square.prototype);

Log.prototype.ambient = vec4(0.10, 0.10, 0.10, 1.0);
Log.prototype.diffuse = vec4(0.3, 0.25, 0.15, 1.0);

Log.prototype.cy = 0.01;
Log.prototype.velX = 0.1;

Log.prototype.update = function (du) {
    spatialManager.unregister(this);
    this.move(du);
    spatialManager.register(this);
};

Log.prototype.move = function(du) {
    this.cx += this.velX;
};

Log.prototype.floater = true;
Log.prototype.deadly = false;
Log.prototype.goal = false;
Log.prototype.impassable = false;
