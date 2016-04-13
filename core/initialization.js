/*
 Initialize data used elsewhere, particularly global variables
 */

"use strict";

var g_elements;

function init() {

    initGlobals();
    initCanvasListeners();
    configureWebGL();
    entityManager.init();
    g_elements.status.innerHTML = "Get to the bays on the other side!";

    function initGlobals() {
        g_elements = {};
        g_elements.canvas = document.getElementById("gl-canvas");
        g_elements.frametimeDebug = document.getElementById("frametime-debug");
        g_elements.frametimeDeltaDebug = document.getElementById("frametime-delta-debug");
        g_elements.status = document.getElementById("status");

        gl = WebGLUtils.setupWebGL(g_elements.canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }
    }
}