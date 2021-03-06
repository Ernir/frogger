/*

 Provides a set of common functions which can be "inherited" by all other
 game Entities.

 */

"use strict";


function Entity() {
}

Entity.prototype.setup = function (descr) {

    // Apply all setup properties from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();

    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.cz = cz;
};

Entity.prototype.getPos = function () {
    return {posX: this.cx, posY: this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    var entity = this.findHitEntity();
    return entity !== null;
};