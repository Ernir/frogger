/*

 entityManager.js

 A module which handles arbitrary entity-management

 */


"use strict";

var entityManager = {

// "PRIVATE" DATA

    _frogList: [],
    _squareList: [],
    _carList: [],
    _logList: [],

// "PRIVATE" METHODS

    _generateThings: function () {
        this.createFrog({cx: 6});
        // Create rows

        this.createRow(0, g_colors.gray);
        for (var i = 1; i < 6; i++) {
            this.createRow(i, g_colors.grayDark);
        }
        this.createRow(6, g_colors.gray);
        for (var j = 7; j < 11; j++) {
            this.createRow(j, g_colors.blue, true);
        }
        for (var k = 0; k < 13; k++) {
            if (k % 2 === 0) {
                this.createSquare({
                    cx: k,
                    cz: 11,
                    color: g_colors.green,
                    impassable: true
                });
            } else {
                this.createSquare({
                    cx: k,
                    cz: 11,
                    color: g_colors.blue,
                    goal: true
                });
            }
        }
        this.createRow(12, g_colors.green);
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
            this._squareList,
            this._carList,
            this._logList
        ];
    },

    init: function () {
        this._generateThings();
    },

    createFrog: function (descr) {
        this._frogList.push(new Frog(descr));
    },

    createLog: function (descr) {
        this._logList.push(new Log(descr));
    },

    createRow: function (rowNumber, color, deadly) {
        var gridWidth = 13;
        if (!deadly) {
            deadly = false;
        }
        for (var i = 0; i < gridWidth; i++) {
            this.createSquare({
                cx: i,
                cz: rowNumber,
                color: color,
                deadly: deadly
            })
        }
    },

    createSquare: function (descr) {
        if (descr.color) {
            descr.ambient = descr.color;
            descr.diffuse = descr.color;
        }
        this._squareList.push(new Square(descr));
    },

    createCar: function (descr) {
        if (descr.color) {
            descr.ambient = descr.color;
            descr.diffuse = descr.color;
        }
        this._carList.push(new Car(descr));
    },

    getFrog: function () {
        return this._frogList[0];
    }
    ,
    maybeGenerateCars: function (du) {
        for (var laneNum in g_carLanes) {
            if (g_carLanes.hasOwnProperty(laneNum)) {
                var lane = g_carLanes[laneNum];
                lane.timeToSpawn -= du;
                if (lane.timeToSpawn <= 0) {
                    this.createCar({
                        cx: lane.spawnPos,
                        cz: lane.laneNum,
                        velX: lane.velocity,
                        ambient: lane.ambient,
                        diffuse: lane.diffuse

                    });
                    lane.spawnedInSeries += 1;
                    if (lane.spawnedInSeries <= lane.seriesLength) {
                        lane.timeToSpawn = 25;
                    } else {
                        lane.spawnedInSeries = 0;
                        lane.timeToSpawn = util.randRange(lane.minTTS, lane.maxTTS);
                    }
                }
            }
        }
    },

    maybeGenerateLogs: function (du) {
        for (var laneNum in g_logLanes) {
            if (g_logLanes.hasOwnProperty(laneNum)) {
                var lane = g_logLanes[laneNum];
                lane.timeToSpawn -= du;
                if (lane.timeToSpawn <= 0) {
                    this.createLog({
                        cx: lane.spawnPos,
                        cz: lane.laneNum,
                        velX: lane.velocity
                    });
                    lane.spawnedInSeries += 1;
                    if (lane.spawnedInSeries <= lane.seriesLength) {
                        lane.timeToSpawn = 10;
                    } else {
                        lane.spawnedInSeries = 0;
                        lane.timeToSpawn = util.randRange(lane.minTTS, lane.maxTTS);
                    }
                }
            }
        }
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
        this.maybeGenerateCars(du);
        this.maybeGenerateLogs(du);
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

