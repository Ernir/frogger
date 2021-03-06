/*
 A portion of the game grid. Can be deadly or not.
 */

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Square(descr) {
    this.setup(descr);
}

Square.prototype = new Entity();

Square.prototype.ambient = vec4(0.2, 0.0, 0.0, 1.0);
Square.prototype.diffuse = vec4(0.8, 0.0, 0.0, 1.0);
Square.prototype.specular = vec4(0.0, 0.0, 0.0, 1.0);
Square.prototype.shininess = 50.0;

Square.prototype.vertices = [];
Square.prototype.normals = [];

Square.prototype.cx = 0;
Square.prototype.cy = 0;
Square.prototype.cz = 0;

Square.prototype.getRadius = function () {
    return 0.25;
};

Square.prototype.update = function () {
    spatialManager.unregister(this);
    spatialManager.register(this);
};

Square.prototype.deadly = false;
Square.prototype.goal = false;
Square.prototype.impassable = false;

Square.prototype.render = function (baseMatrix) {

    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.squareVertex);
    gl.vertexAttribPointer(g_locs.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.squareNormal);
    gl.vertexAttribPointer(g_locs.vNormal, 4, gl.FLOAT, false, 0, 0);

    baseMatrix = mult(baseMatrix, translate(this.cx, this.cy, this.cz));
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

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length);
};
