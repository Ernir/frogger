/**
 * Created by ernir on 30.1.2016.
 */
"use strict";




function gatherInputs() {
    // Nothing is done here.
    // Input handling is performed in core/keys.js via events.
}

function updateSimulation(dt) {
    entityManager.update(dt);
}

function render() {
    entityManager.render();
}

window.onload = function() {
    init(); // Initialize the simulation
    main.init(); // Kick off repeatedly calling gatherInputs, update and render
};