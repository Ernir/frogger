"use strict";

function initCanvasListeners() {
    var movement;

    g_elements.canvas.addEventListener("mousedown", function (e) {
        movement = true;
        g_camera.origX = e.offsetX;
        g_camera.origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    });

    g_elements.canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    g_elements.canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            g_camera.spinY += (e.offsetX - g_camera.origX) % 360;
            g_camera.spinX += (e.offsetY - g_camera.origY) % 360;
            g_camera.origX = e.offsetX;
            g_camera.origY = e.offsetY;
        }
    });
}

window.addEventListener("mousewheel", function (e) {
    if (e.wheelDelta > 0.0) {
        g_camera.zView = Math.min(g_camera.zView + 1, -1);
    } else {
        g_camera.zView = Math.max(g_camera.zView - 1, -150);
    }
});