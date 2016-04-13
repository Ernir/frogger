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

Frog.prototype.yRotation = 0;
Frog.prototype.gridWidth = 12;
Frog.prototype.gridHeight = 12;

Frog.prototype.velX = 0;
Frog.prototype.velY = 0;
Frog.prototype.velZ = 0;
Frog.prototype.baseSpeed = 0.05;

Frog.prototype.vertices = [];
Frog.prototype.normals = [];

Frog.prototype.ambient = vec4(0.0, 0.2, 0.0, 1.0);
Frog.prototype.diffuse = vec4(0.0, 0.8, 0.0, 1.0);
Frog.prototype.specular = vec4(0.2, 0.2, 0.2, 1.0);
Frog.prototype.shininess = 50.0;

/*
 METHODS
 */

Frog.prototype.getRadius = function () {
    return 0.25;
};

Frog.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.handleCollisions();
    this.move(du);
    this.snapToGrid();

    spatialManager.register(this);

};

Frog.prototype.handleCollisions = function () {
    var entities = spatialManager.findEntitiesInRange(
        this.cx, this.cy, this.cz, this.getRadius()
    );
    var deathInRange = false;
    var goalInRange = false;
    var log;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.deadly) {
            deathInRange = true;
        } else if (entity.goal) {
            goalInRange = true;
        } else if (entity.floater) {
            log = entity;
            if (!this.isJumping()) {
                this.velX = log.velX;
            }
        }
    }
    if (this.isLocked()) {
        if (deathInRange && !log) {
            main.gameOver();
        } else if (goalInRange) {
            main.gameOver(true);
        }
    }
};

Frog.prototype.jumpForward = function () {
    this.forceSnap();
    this.yRotation = 0;
    if (this.gridZ < this.gridHeight && !this.isJumping()) {
        this.velZ = this.baseSpeed;
        this.targetZ = this.gridZ + 1;
    }
};

Frog.prototype.jumpBack = function () {
    this.forceSnap();
    this.yRotation = 180;
    if (this.gridZ > 0 && !this.isJumping()) {
        this.velZ = -this.baseSpeed;
        this.targetZ = this.gridZ - 1;
    }
};

Frog.prototype.jumpRight = function () {
    this.forceSnap();
    this.yRotation = 90;
    if (this.gridX > 0 && !this.isJumping()) {
        this.velX = -this.baseSpeed;
        this.targetX = this.gridX - 1;
    }
};

Frog.prototype.jumpLeft = function () {
    this.forceSnap();
    this.yRotation = 270;
    if (this.gridX < this.gridWidth && !this.isJumping()) {
        this.velX = this.baseSpeed;
        this.targetX = this.gridX + 1;
    }
};

Frog.prototype.forceSnap = function () {
    if (this.isJumping()) {
        return;
    }
    this.cx = Math.round(this.cx);
    this.cz = Math.round(this.cz);
    this.gridX = this.cx;
    this.gridZ = this.cz;
    this.targetX = this.gridX;
    this.targetZ = this.gridZ;
};

Frog.prototype.snapToGrid = function () {
    if (this.isJumping() && !this.isLocked()) {

        var distanceToTarget = util.distSq2D(
            this.cx, this.cz,
            this.targetX, this.targetZ
        );
        var tolerance = 0.02;
        if (distanceToTarget < tolerance || distanceToTarget > 1 + tolerance) {
            this.velX = 0;
            this.velZ = 0;
            this.cx = this.targetX;
            this.cz = this.targetZ;
            this.gridX = this.targetX;
            this.gridZ = this.targetZ;
            this.handleCollisions(); // This jerky movement requires re-checking
        }
    }
};

Frog.prototype.isLocked = function () {
    return this.targetX === this.gridX && this.targetZ === this.gridZ;
};

Frog.prototype.move = function (du) {

    this.cx += this.velX * du;
    this.cz += this.velZ * du;

    this.cx = Math.max(0, Math.min(this.cx, this.gridWidth));

};

Frog.prototype.verticalDisplacement = function () {
    // Simplified distance checking due to simple movement
    if (this.isJumping()) {
        var distanceFromTarget = Math.abs(
            this.targetX - this.cx + this.targetZ - this.cz
        );
        return Math.sin(distanceFromTarget * Math.PI) / 3;
    }
    return 0;
};

Frog.prototype.isJumping = function () {
    return this.targetX !== this.gridX || this.targetZ !== this.gridZ;
};

Frog.prototype.render = function (baseMatrix) {

    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogVertex);
    gl.vertexAttribPointer(g_locs.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogNormal);
    gl.vertexAttribPointer(g_locs.vNormal, 4, gl.FLOAT, false, 0, 0);


    baseMatrix = mult(baseMatrix, translate(this.cx, this.cy + 0.25 + this.verticalDisplacement(), this.cz));
    baseMatrix = mult(baseMatrix, scalem(0.15, 0.15, 0.15));
    baseMatrix = mult(baseMatrix, rotateY(this.yRotation));
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