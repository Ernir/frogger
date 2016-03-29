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
    cyan: vec4(0.0, 1.0, 1.0, 1.0)
};


var g_camera = {
    zView: -5,
    spinX: 0,
    spinY: 0,
    origX: 0,
    origY: 0
};

var modelViewMatrix, projectionMatrix;

var gl;
var g_program;

var g_buffers = {};
var g_locs = {};

function configureWebGL() {
    gl.viewport(0, 0, g_elements.canvas.width, g_elements.canvas.height);
    gl.clearColor(0.9, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    g_program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(g_program);
    initBuffers();
}

var g_light = {
    position: vec4(1.0, 1.0, 1.0, 0.0 ),
    ambient: vec4(1.0, 1.0, 1.0, 1.0 ),
    diffuse: vec4( 1.0, 1.0, 1.0, 1.0 ),
    specular: vec4( 1.0, 1.0, 1.0, 1.0 )
};

function initBuffers() {

    var PR = PlyReader();
    var plyData = PR.read("froggy.ply");

    Frog.prototype.vertices = plyData.points;
    Frog.prototype.normals = plyData.normals;

    gl.useProgram( g_program );

    // Normals array attribute buffer
    var frogNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, frogNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(Frog.prototype.normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( g_program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


    // vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(Frog.prototype.vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( g_program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    g_locs.modelViewMatrix = gl.getUniformLocation( g_program, "modelViewMatrix" );
    g_locs.projectionMatrix = gl.getUniformLocation( g_program, "projectionMatrix" );
    g_locs.normalMatrix = gl.getUniformLocation( g_program, "normalMatrix" );

    var fovy = 60.0;
    var near = 0.2;
    var far = 100.0;
    projectionMatrix = perspective( fovy, 1.0, near, far );
    gl.uniformMatrix4fv(g_locs.projectionMatrix, false, flatten(projectionMatrix) );


    gl.uniform4fv( gl.getUniformLocation(g_program, "lightPosition"), flatten(g_light.position) );


}


function reloadView() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var baseMatrix = lookAt(vec3(0.0, 1.0, g_camera.zView), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    baseMatrix = mult(baseMatrix, rotateX(g_camera.spinX));
    baseMatrix = mult(baseMatrix, rotateY(g_camera.spinY));
    return baseMatrix;
}