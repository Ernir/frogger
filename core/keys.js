/*
 Key handling
 */

"use strict";

var keys = [];

// Key codes for the space bar and arrow keys, to be ignored
var _ignore = [" ".charCodeAt(0), 37, 38, 39, 40];

function handleKeydown(evt) {
    if (_ignore.indexOf(evt.keyCode) !== -1) {
        evt.preventDefault();
    }
    keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

var g_keys = {
    forward: keyCode("W"),
    back: keyCode("A"),
    left: keyCode("S"),
    right: keyCode("D")
};

function applyKeys(du) {
    if (eatKey(g_keys.forward)) {
        // Move forward?
    }
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
