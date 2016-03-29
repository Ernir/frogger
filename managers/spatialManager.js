/*

 A module which handles spatial lookup, as required for e.g. general
 collision detection.

 */

"use strict";

var spatialManager = {

// "PRIVATE" DATA

    _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

    _entities: [],


// PUBLIC METHODS

    getNewSpatialID: function () {
        // Use it, then increment.
        return this._nextSpatialID++;
    },

    register: function (entity) {
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },

    unregister: function (entity) {
        var spatialID = entity.getSpatialID();

        // Unregistering means "deletion" from the _entities array.
        // This fills the array with "undefined"s, but the for-in loops
        // (see below) seem to not care.
        delete this._entities[spatialID];
    },

    resetAll: function () {
        this._nextSpatialID = 1;
        this._entities.length = 0;
    },


    findEntitiesInRange: function (posX, posY, posZ, radius) {
        var neighbors = [];
        for (var i in this._entities) {
            var entity = this._entities[i];
            // Sphere-based distance checking
            var distSq = util.distSq(posX, posY, posZ, entity.cx, entity.cy, entity.cz);
            var limSq = util.square(radius + entity.getRadius());
            if (distSq < limSq) {
                neighbors.push(entity);
            }
        }
        return neighbors;
    }
    ,

    avgPos: function (entityList) {
        if (entityList.length > 0) {
            var x = 0, y = 0, z = 0;
            for (var i = 0; i < entityList.length; i++) {
                x += entityList[i].cx;
                y += entityList[i].cy;
                z += entityList[i].cz;
            }
            return {
                cx: x / entityList.length,
                cy: y / entityList.length,
                cz: z / entityList.length
            }
        } else {
            return undefined;
        }
    },

    headingTo: function(actorEntity, targetEntity) {
        var heading = [
            targetEntity.cx - actorEntity.cx,
            targetEntity.cy - actorEntity.cy,
            targetEntity.cz - actorEntity.cz
        ];
        return normalize(heading);
    }
};
