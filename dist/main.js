/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("let synth = null;\r\nlet sequence = null;\r\n\r\nwindow.onload = function() {\r\n\r\n    synth = new Tone.MonoSynth({\r\n        oscillator: {\r\n            type: 'sawtooth'\r\n        },\r\n        envelope: {\r\n            attack: 0.1,\r\n            decay: 0.2,\r\n            sustain: 1,\r\n            release: 0.8\r\n        }\r\n    }).toDestination();\r\n\r\n    sequence = new Tone.Sequence((time, note) => {\r\n        if (synth && note !== undefined) synth.triggerAttackRelease(note, '8n', time);\r\n    }, []);\r\n\r\n    Tone.Transport.bpm.value = 120;\r\n\r\n    sequence.loop = true;\r\n    sequence.start();\r\n\r\n    const grid = document.getElementById('grid');\r\n    for (let i = 0; i < 16; i++) {\r\n        const button = document.createElement('button');\r\n        button.textContent = 'Step ' + (i + 1);\r\n        button.addEventListener('click', function() {\r\n            const step = i;\r\n            const note = 'C4';\r\n            if (sequence && sequence.values && sequence.values[step] === note) {\r\n                sequence.values[step] = null;\r\n                button.style.backgroundColor = '';\r\n            } else if (sequence && sequence.values) {\r\n                sequence.values[step] = note;\r\n                button.style.backgroundColor = 'blue';\r\n            }\r\n        });\r\n        grid.appendChild(button);\r\n    }\r\n\r\n    ['cutoff', 'resonance', 'envelope', 'decay', 'accent'].forEach(control => {\r\n        document.getElementById(control).addEventListener('input', function() {\r\n            if (synth && synth.filter && this.value !== undefined) {\r\n                synth.filter.frequency.value = this.value;\r\n            }\r\n        });\r\n    });\r\n\r\n    const startStopButton = document.getElementById('start-stop');\r\n    startStopButton.addEventListener('click', function() {\r\n        if (startStopButton.textContent === 'Start') {\r\n            Tone.Transport.start();\r\n            startStopButton.textContent = 'Stop';\r\n        } else {\r\n            Tone.Transport.stop();\r\n            startStopButton.textContent = 'Start';\r\n        }\r\n    });\r\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;