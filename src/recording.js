// const audioStream = audioCtx.createMediaStreamDestination();
// const mediaRecorder = new MediaRecorder(audioStream.stream);

// function startRecording() {
//   return new Promise((resolve, reject) => {
//     mediaRecorder.start();

//     mediaRecorder.ondataavailable = (e) => {
//       resolve(e.data);
//     };

//     mediaRecorder.onerror = (e) => {
//       reject(e);
//     };
//   });
// }

// function stopRecording() {
//   return new Promise((resolve, reject) => {
//     mediaRecorder.stop();

//     mediaRecorder.onstop = () => {
//       resolve();
//     };

//     mediaRecorder.onerror = (e) => {
//       reject(e);
//     };
//   });
// }

// async function recordAudio() {
//   const audioData = await startRecording();
//   const audioBlob = new Blob([audioData], { type: 'audio/wav' });
//   const audioUrl = URL.createObjectURL(audioBlob);

//   // Use the audio data as needed
//   console.log(audioUrl);
// }

// const recordingButton = document.getElementById('recording-button');


// toggleButton.addEventListener('click', function() {
//   if (toggleButton.textContent === 'Start Recording') {
//     startRecording();
//     toggleButton.textContent = 'Stop Recording';
//   } else {
//     stopRecording().then(recordAudio);
//     toggleButton.textContent = 'Start Recording';
//   }
// });
