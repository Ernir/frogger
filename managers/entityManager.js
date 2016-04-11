/*

 entityManager.js

 A module which handles arbitrary entity-management

 */


"use strict";

var entityManager = {

// "PRIVATE" DATA

    _frogList: [],
    _squareList: [],

// "PRIVATE" METHODS

    _generateThings: function () {
        this.createFrog({cx: 6});

        for (var i = 0; i < g_grid.width; i++) {
            this.createSquare({
                cx: i,
                cz: 0,
                ambient: vec4(0.2, 0.2, 0.2, 0.2),
                diffuse: vec4(0.4, 0.4, 0,2, 0.2)
            })
        }
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!

    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need "this" to be defined.

    deferredSetup: function () {
        this._categories = [
            this._frogList,
            this._squareList
        ];
    },

    init: function () {
        this._generateThings();
    },

    createFrog: function (descr) {
        this._frogList.push(new Frog(descr));
    },

    createSquare: function (descr) {
        this._squareList.push(new Square(descr));
    },

    getFrog: function() {
        return this._frogList[0];
    },

    update: function (du) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        }
    },

    render: function () {
        var baseMatrix = reloadView();

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(baseMatrix);

            }
        }
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

