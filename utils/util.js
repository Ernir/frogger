/*
 A module of utility functions, stored within a global "util" object
 */

"use strict";


var util = {

    /*
     Math
     */
    sign: function (x) {
        if (x < 0) {
            return -1;
        } else if (x > 0) {
            return 1;
        }
        return 0;
    },

    abs: function (x) {
        if (x < 0) {
            return -x;
        }
        return x;
    },

    similar: function (x, y) {
        // Returns true if the two numbers are "similar" according to an arbitrary definition.
        var similarScale = 0.9 * this.abs(x) <= this.abs(y) && 0.9 * this.abs(y) <= this.abs(x);
        var sameSign = this.sign(x) === this.sign(y);
        return similarScale && sameSign;
    },

    /*
     Ranges
     */

    clampRange: function (value, lowBound, highBound) {
        if (value < lowBound) {
            value = lowBound;
        } else if (value > highBound) {
            value = highBound;
        }
        return value;
    },

    wrapRange: function (value, lowBound, highBound) {
        while (value < lowBound) {
            value += (highBound - lowBound);
        }
        while (value > highBound) {
            value -= (highBound - lowBound);
        }
        return value;
    },

    isBetween: function (value, lowBound, highBound) {
        return value > lowBound && value < highBound;
    },

    /*
     Randomness
     */

    randRange: function (min, max) {
        return (min + Math.random() * (max - min));
    },

    randInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Source: http://stackoverflow.com/a/15106541/1675015
    randomProperty: function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[keys.length * Math.random() << 0]];
    },

    randTrinary: function () {
        // Returns -1, 0 or 1
        return Math.floor(Math.random() * 3) - 1;
    },

    randSign: function () {
        return Math.random() < 0.5 ? 1 : -1;
    },


// MISC
// ====

    square: function (x) {
        return x * x;
    },

    angleTo2D: function (x1, y1, x2, y2) {
        var angle = Math.atan2(y2 - y1, x2 - x1);
        if (angle < 0)
            angle += 2 * Math.PI;
        return angle;
    },

    directionAngles: function(x1, y1, z1, x2, y2, z2) {
        var diff = vec3(
            (x2 - x1),
            (y2 - y1),
            (z2 - z1)
        );
        var l = length(diff);
        return {
            alpha: Math.acos(diff[0] / l),
            beta: Math.acos(diff[1] / l),
            gamma: Math.acos(diff[2] / l)
        };
    },

    normalsFromMV: function(modelViewMatrix) {
        return [
            vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
            vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
            vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
        ];
    },


// DISTANCES
// =========

    distSq2D: function (x1, y1, x2, y2) {
        return this.square(x2 - x1) + this.square(y2 - y1);
    },

    wrappedDistSq2D: function (x1, y1, x2, y2, xWrap, yWrap) {
        var dx = Math.abs(x2 - x1),
            dy = Math.abs(y2 - y1);
        if (dx > xWrap / 2) {
            dx = xWrap - dx;
        }
        if (dy > yWrap / 2) {
            dy = yWrap - dy;
        }
        return this.square(dx) + this.square(dy);
    },

    distSq: function (x1, y1, z1, x2, y2, z2) {
        return this.square(x2 - x1)
            + this.square(y2 - y1)
            + this.square(z2 - z1);
    }

};