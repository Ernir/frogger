/*
 A car. It is bad for frogs to get hit by a car.
 */

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Car(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    if (this.velX > 0) {
        this.yRotation = 90;
    } else {
        this.yRotation = 270;
    }
}

Car.prototype = new Entity();

Car.prototype.cx = 0;
Car.prototype.cy = 0;
Car.prototype.cz = 0;
Car.prototype.yRotation = 0;

Car.prototype.velX = 0;
Car.prototype.velY = 0;
Car.prototype.velZ = 0;
Car.prototype.baseSpeed = 0.1;

Car.prototype.vertices = [];
Car.prototype.normals = [];

Car.prototype.ambient = vec4(0.0, 0.0, 0.2, 1.0);
Car.prototype.diffuse = vec4(0.0, 0.0, 0.6, 1.0);
Car.prototype.specular = vec4(1.0, 1.0, 1.0, 1.0);
Car.prototype.shininess = 75.0;

Car.prototype.deadly = true;

Car.prototype.getRadius = function () {
    return 0.5;
};

/*
 METHODS
 */

Car.prototype.update = function (du) {
    spatialManager.unregister(this);

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.cx < 0 || this.cx > 13) {
        this.kill();
    }
    this.move(du);
    spatialManager.register(this);
};

Car.prototype.move = function (du) {

    this.cx += this.velX * du;
    this.cz += this.velZ * du;

};

Car.prototype.render = function (baseMatrix) {

    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.carVertex);
    gl.vertexAttribPointer(g_locs.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.carNormal);
    gl.vertexAttribPointer(g_locs.vNormal, 4, gl.FLOAT, false, 0, 0);


    baseMatrix = mult(baseMatrix, translate(this.cx, this.cy + 0.25, this.cz));
    baseMatrix = mult(baseMatrix, scalem(0.2, 0.2, 0.2));
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