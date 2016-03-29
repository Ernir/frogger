/*
 Main loop and time handling
 */

"use strict";

var main = {

    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms: null,
    _frameTimeDelta_ms: null

};

// Perform one iteration of the mainloop
main.iter = function (frameTime) {

    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);

    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);

    // Diagnostics, such as showing current timer values etc.
    this._debugRender();

    // Request the next iteration if needed
    if (!this._isGameOver)
        this._requestNextIteration();
};

main._updateClocks = function (frameTime) {

    // First-time initialisation
    if (this._frameTime_ms === null)
        this._frameTime_ms = frameTime;

    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

main._isGameOver = false;

main.gameOver = function () {
    this._isGameOver = true;
    console.log("gameOver: quitting...");
};

// Simple voluntary quit mechanism
//
var KEY_QUIT = 'Q'.charCodeAt(0);
function requestedQuit() {
    return keys[KEY_QUIT];
}

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    main.iter(frameTime);
}

main._requestNextIteration = function () {
    window.requestAnimFrame(mainIterFrame);
};

// Mainloop-level debugging

var TOGGLE_TIMER_SHOW = keyCode("T");

main._doTimerShow = false;

main._debugRender = function () {

    if (eatKey(TOGGLE_TIMER_SHOW))
        this._doTimerShow = !this._doTimerShow;

    if (!this._doTimerShow) {
        g_elements.frametimeDebug.innerHTML = "";
        g_elements.frametimeDeltaDebug.innerHTML = "";
    } else {
        g_elements.frametimeDebug.innerHTML = "FT: " + this._frameTime_ms;
        g_elements.frametimeDeltaDebug.innerHTML = "FD: " + this._frameTimeDelta_ms;
    }
};

main._iterCore = function (dt) {

    // Handle QUIT
    if (requestedQuit()) {
        this.gameOver();
        return;
    }

    gatherInputs();
    update(dt);
    render(gl);
};

main.init = function () {
    this._requestNextIteration();
};