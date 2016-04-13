"use strict";

var g_colors = {
    yellow: vec4(1.0, 1.0, 0.0, 1.0),
    red: vec4(1.0, 0.0, 0.0, 1.0),
    green: vec4(0.0, 1.0, 0.0, 1.0),
    blue: vec4(0.0, 0.0, 1.0, 1.0),
    black: vec4(0.0, 0.0, 0.0, 1.0),
    white: vec4(1.0, 1.0, 1.0, 1.0),
    purple: vec4(0.8, 0.2, 1.0, 1.0),
    orangeLight: vec4(1.0, 0.7, 0.3, 1.0),
    orange: vec4(1.0, 0.2, 0.0, 1.0),
    magenta: vec4(1.0, 0.0, 1.0, 1.0),
    gray: vec4(0.4, 0.4, 0.4, 0.0),
    grayDark: vec4(0.2, 0.2, 0.2, 0.0),
    cyan: vec4(0.0, 1.0, 1.0, 1.0)
};


var g_camera = {
    zView: -5,
    spinX: 0,
    spinY: 0,
    origX: 0,
    origY: 0
};

var gl;
var g_program;

var g_buffers = {
    frogNormal: undefined,
    squareNormal: undefined,
    frogVertex: undefined,
    squareVertex: undefined
};

var g_locs = {};

function configureWebGL() {
    gl.viewport(0, 0, g_elements.canvas.width, g_elements.canvas.height);
    gl.clearColor(0.9, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    g_program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(g_program);
    initBuffers();
}

var g_light = {
    position: vec4(1.0, 1.0, 1.0, 0.0),
    ambient: vec4(1.0, 1.0, 1.0, 1.0),
    diffuse: vec4(1.0, 1.0, 1.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0)
};

function initBuffers() {

    var PR = PlyReader();
    var frogData = PR.read("data/froggy.ply");
    var carData = PR.read("data/car.ply");

    Frog.prototype.vertices = frogData.points;
    Frog.prototype.normals = frogData.normals;

    Car.prototype.vertices = carData.points;
    Car.prototype.normals = carData.normals;

    Square.prototype.vertices = [
        vec4(-0.5, 0, 0.5, 1),
        vec4(-0.5, 0, -0.5, 1),
        vec4(0.5, 0, 0.5, 1),
        vec4(0.5, 0, -0.5, 1)
    ];
    Square.prototype.normals = [
        vec4(0, 1, 0, 0),
        vec4(0, 1, 0, 0),
        vec4(0, 1, 0, 0),
        vec4(0, 1, 0, 0)
    ];

    gl.useProgram(g_program);

    // Normals array attribute buffers
    g_buffers.frogNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogNormal);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Frog.prototype.normals), gl.STATIC_DRAW);

    g_buffers.squareNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.squareNormal);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Square.prototype.normals), gl.STATIC_DRAW);

    g_buffers.carNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.carNormal);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Car.prototype.normals), gl.STATIC_DRAW);

    g_locs.vNormal = gl.getAttribLocation(g_program, "vNormal");
    gl.vertexAttribPointer(g_locs.vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(g_locs.vNormal);

    // vertex array attribute buffers
    g_buffers.frogVertex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.frogVertex);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Frog.prototype.vertices), gl.STATIC_DRAW);

    g_buffers.squareVertex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.squareVertex);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Square.prototype.vertices), gl.STATIC_DRAW);

    g_buffers.carVertex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_buffers.carVertex);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Car.prototype.vertices), gl.STATIC_DRAW);

    g_locs.vPosition = gl.getAttribLocation(g_program, "vPosition");
    gl.vertexAttribPointer(g_locs.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(g_locs.vPosition);

    g_locs.modelViewMatrix = gl.getUniformLocation(g_program, "modelViewMatrix");
    g_locs.projectionMatrix = gl.getUniformLocation(g_program, "projectionMatrix");
    g_locs.normalMatrix = gl.getUniformLocation(g_program, "normalMatrix");
    g_locs.ambientProduct = gl.getUniformLocation(g_program, "ambientProduct");
    g_locs.diffuseProduct = gl.getUniformLocation(g_program, "diffuseProduct");
    g_locs.specularProduct = gl.getUniformLocation(g_program, "specularProduct");
    g_locs.shininess = gl.getUniformLocation(g_program, "shininess");

    var fovy = 60.0;
    var near = 0.2;
    var far = 100.0;
    var projectionMatrix = perspective(fovy, 1.0, near, far);
    gl.uniformMatrix4fv(g_locs.projectionMatrix, false, flatten(projectionMatrix));

    gl.uniform4fv(gl.getUniformLocation(g_program, "lightPosition"), flatten(g_light.position));


}


function reloadView() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var frog = entityManager.getFrog();
    if (!frog) {
        frog = {cx: 0, cy: 0, cz: 0};
    }

    var baseMatrix = lookAt(
        vec3(frog.cx, frog.cy + 5.0, frog.cz + g_camera.zView),
        vec3(frog.cx, frog.cy, frog.cz),
        vec3(0.0, 1.0, 0.0)
    );
    return baseMatrix;
}