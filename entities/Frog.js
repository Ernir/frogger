/*
 Frogger's frog.
 */

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Frog(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.gridX = this.cx;
    this.targetX = this.cx;
    this.gridZ = this.cz;
    this.targetZ = this.cz;
}

Frog.prototype = new Entity();

Frog.prototype.cx = 0;
Frog.prototype.cy = 0;
Frog.prototype.cz = 0;

Frog.prototype.gridWidth = 12;
Frog.prototype.gridHeight = 12;

Frog.prototype.velX = 0;
Frog.prototype.velY = 0;
Frog.prototype.velZ = 0;

Frog.prototype.vertices = [];
Frog.prototype.normals = [];

Frog.prototype.ambient = vec4(0.0, 0.2, 0.0, 1.0);
Frog.prototype.diffuse = vec4(0.0, 0.8, 0.0, 1.0);
Frog.prototype.specular = vec4(0.2, 0.2, 0.2, 1.0);
Frog.prototype.shininess = 50.0;

Frog.prototype.getRadius = function () {
    return 0.5;
};

/*
 METHODS
 */

Frog.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.move(du);
    this.snapToGrid();

    spatialManager.register(this);

};

Frog.prototype.jumpForward = function () {
    this.yRotation = 0;
    if (this.gridZ < this.gridHeight && !this.isMoving()) {
        this.velZ = 0.1;
        this.targetZ = this.gridZ + 1;
        console.log(this.gridZ,this.targetZ);
    }
};

Frog.prototype.snapToGrid = function () {
    if (this.isMoving()) {
        // Make it stop if close enough to the target square
        if (this.targetX !== this.gridX || this.targetZ !== this.gridZ) {
            var distanceToTarget = util.distSq2D(
                this.cx, this.cz,
                this.targetX, this.targetZ
            );
            if (distanceToTarget < 0.1 || distanceToTarget > 1.1) {
                this.velX = 0;
                this.velZ = 0;
                this.cx = this.targetX;
                this.cz = this.targetZ;
                this.gridX = this.targetX;
                this.gridZ = this.targetZ;
            }
        }
    }
};

Frog.prototype.move = function (du) {

    this.cx += this.velX * du;
    this.cz += this.velZ * du;

};

Frog.prototype.isMoving = function () {
    return !(this.velX == 0 && this.velZ == 0);
    // The frog doesn't move vertically
}

Frog.prototype.render = function (baseMatrix) {

    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogVertex);
    gl.vertexAttribPointer(g_locs.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogNormal);
    gl.vertexAttribPointer(g_locs.vNormal, 4, gl.FLOAT, false, 0, 0);

    baseMatrix = mult(baseMatrix, translate(this.cx, this.cy, this.cz));
    baseMatrix = mult(baseMatrix, scalem(0.15, 0.15, 0.15));
    var modelViewMatrix = baseMatrix;
    var normalMatrix = util.normalsFromMV(modelViewMatrix);

    var ambientProduct = mult(g_light.ambient, this.ambient);
    var diffuseProduct = mult(g_light.diffuse, this.diffuse);
    var specularProduct = mult(g_light.specular, this.specular);

    gl.uniform4fv(g_locs.ambientProduct, flatten(ambientProduct));
    gl.uniform4fv(g_locs.diffuseProduct, flatten(diffuseProduct));
    gl.uniform4fv(g_locs.specularProduct, flatten(specularProduct));
    gl.uniform1f(g_locs.shininess, this.shininess);

    gl.uniformMatrix4fv(g_locs.modelViewMatrix, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(g_locs.normalMatrix, false, flatten(normalMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
};