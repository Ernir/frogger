/*
 Initialize data used elsewhere, particularly global variables
 */

"use strict";

var g_elements;
var g_carLanes;
var g_logLanes;
var g_score = 0;

function init() {

    initGlobals();
    initCanvasListeners();
    configureWebGL();
    entityManager.init();
    g_elements.score.innerHTML = g_score;

    function initGlobals() {
        g_elements = {};
        g_elements.canvas = document.getElementById("gl-canvas");
        g_elements.frametimeDebug = document.getElementById("frametime-debug");
        g_elements.frametimeDeltaDebug = document.getElementById("frametime-delta-debug");
        g_elements.score = document.getElementById("score");

        g_carLanes = {
            first: {
                velocity: 0.1,
                spawnPos: 0,
                timeToSpawn: 0,
                minTTS: 200, // mininum time to series
                maxTTS: 300, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 5,
                laneNum: 1,
                diffuse: vec4(0.0, 0.0, 0.6, 1.0),
                ambient: vec4(0.0, 0.0, 0.2, 1.0)
            },
            second: {
                velocity: -0.1,
                spawnPos: 12,
                timeToSpawn: 100,
                minTTS: 100, // mininum time to series
                maxTTS: 400, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 4,
                laneNum: 2,
                diffuse: vec4(0.6, 0.0, 0.0, 1.0),
                ambient: vec4(0.2, 0.0, 0.0, 1.0)
            },
            third: {
                velocity: 0.3,
                spawnPos: 0,
                timeToSpawn: 100,
                minTTS: 50, // mininum time to series
                maxTTS: 400, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 3,
                laneNum: 3,
                diffuse: vec4(0.0, 0.1, 0.0, 1.0),
                ambient: vec4(0.0, 0.2, 0.0, 1.0)
            },
            fourth: {
                velocity: -0.1,
                spawnPos: 12,
                timeToSpawn: 200,
                minTTS: 50, // mininum time to series
                maxTTS: 400, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 7,
                laneNum: 4,
                diffuse: vec4(0.8, 0.4, 0.0, 1.0),
                ambient: vec4(0.8, 0.4, 0.0, 1.0)
            },
            fifth: {
                velocity: 0.2,
                spawnPos: 0,
                timeToSpawn: 150,
                minTTS: 50, // mininum time to series
                maxTTS: 200, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 7,
                laneNum: 5,
                diffuse: vec4(0.5, 0.5, 0.5, 1.0),
                ambient: vec4(0.5, 0.5, 0.5, 1.0)
            }
        };

        g_logLanes = {
            first: {
                velocity: 0.04,
                spawnPos: 0,
                timeToSpawn: 0,
                minTTS: 100, // mininum time to series
                maxTTS: 300, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 10,
                laneNum: 7
            },
            second: {
                velocity: -0.06,
                spawnPos: 12,
                timeToSpawn: 100,
                minTTS: 100, // mininum time to series
                maxTTS: 300, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 20,
                laneNum: 8
            },
            third: {
                velocity: 0.07,
                spawnPos: 0,
                timeToSpawn: 150,
                minTTS: 100, // mininum time to series
                maxTTS: 300, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 10,
                laneNum: 9
            },
            fourth: {
                velocity: -0.06,
                spawnPos: 12,
                timeToSpawn: 200,
                minTTS: 100, // mininum time to series
                maxTTS: 300, // maximum time to series
                spawnedInSeries: 0,
                seriesLength: 15,
                laneNum: 10
            }
        };

        gl = WebGLUtils.setupWebGL(g_elements.canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }
    }
}