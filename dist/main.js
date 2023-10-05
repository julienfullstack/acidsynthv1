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

eval("let audioContext = null;\r\nlet sequence = [];\r\nlet oscillator = null;\r\nlet gainNode = null;\r\nlet stepSequencer = [];\r\n\r\nlet stepIndex = 0;\r\nlet stepInterval = null;\r\nlet tempo = 120;\r\n\r\nfunction startAudioContext() {\r\n    audioContext = new (window.AudioContext || window.webkitAudioContext)();\r\n    if (audioContext.state === 'suspended') {\r\n        audioContext.resume();\r\n    }\r\n}\r\n\r\nwindow.onload = function() {\r\n    startAudioContext();\r\n\r\n    oscillator = audioContext.createOscillator();\r\n    gainNode = audioContext.createGain();\r\n\r\n    oscillator.type = 'sawtooth';\r\n    oscillator.connect(gainNode);\r\n    gainNode.connect(audioContext.destination);\r\n\r\n    const grid = document.getElementById('grid');\r\n    for (let i = 0; i < 16; i++) {\r\n        const button = document.createElement('button');\r\n        button.textContent = 'Step ' + (i + 1);\r\n        button.addEventListener('click', function() {\r\n            const step = i;\r\n            const frequency = audioContext.frequencyToLogarithm ? audioContext.frequencyToLogarithm('C4') : 261.63; \r\n            if (sequence[step] === frequency) {\r\n                sequence[step] = null;\r\n                button.style.backgroundColor = '';\r\n            } else {\r\n                sequence[step] = frequency;\r\n                stepSequencer[step] = frequency;\r\n                button.style.backgroundColor = 'blue';\r\n            }\r\n        });\r\n        grid.appendChild(button);\r\n    }\r\n\r\n    ['cutoff', 'resonance', 'envelope', 'decay', 'accent','frequency'].forEach(control => {\r\n        document.getElementById(control).addEventListener('input', function() {\r\n            if (this.value !== undefined) {\r\n                gainNode.gain.value = this.value;\r\n            }\r\n        });\r\n    });\r\n\r\n    document.getElementById('tempo').addEventListener('input', function() {\r\n        if (this.value !== undefined) {\r\n            tempo = this.value;\r\n            clearInterval(stepInterval);\r\n            stepInterval = setInterval(() => {\r\n                const sequenceValue = sequence[stepIndex];\r\n                oscillator.frequency.value = sequenceValue !== undefined ? sequenceValue : 0;\r\n                stepIndex = (stepIndex + 1) % stepSequencer.length;\r\n            }, 60000/tempo); \r\n        }\r\n    });\r\n\r\n    const startStopButton = document.getElementById('start-stop');\r\n    startStopButton.addEventListener('click', function() {\r\n        if (startStopButton.textContent === 'Start') {\r\n            startAudioContext();\r\n            oscillator = audioContext.createOscillator();\r\n            gainNode = audioContext.createGain();\r\n            oscillator.type = 'sawtooth';\r\n            oscillator.frequency.value = 0; // Set the frequency to 0\r\n            oscillator.connect(gainNode);\r\n            gainNode.connect(audioContext.destination);\r\n            oscillator.start(0);\r\n            stepInterval = setInterval(() => {\r\n                const sequenceValue = sequence[stepIndex];\r\n                oscillator.frequency.value = sequenceValue !== undefined ? sequenceValue : 0;\r\n                stepIndex = (stepIndex + 1) % stepSequencer.length;\r\n            }, 60000/tempo); \r\n            startStopButton.textContent = 'Stop';\r\n        } else {\r\n            clearInterval(stepInterval);\r\n            oscillator.stop(0);\r\n            startStopButton.textContent = 'Start';\r\n        }\r\n    });\r\n}\n\n//# sourceURL=webpack:///./src/index.js?");

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