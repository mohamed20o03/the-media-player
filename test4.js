const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById('myAudio');
const echoButton = document.getElementById('echoButton');
let audioSource = null;

// Connect the audio source to the audio context
function connectAudioSource() {
  audioSource = audioContext.createMediaElementSource(audioElement);
  audioSource.connect(audioContext.destination);
}

// Add echo effect
function addEchoEffect() {
  if (!audioSource) {
    connectAudioSource();
  }

  // Create an echo effect using a delay node and a gain node
  const delay = audioContext.createDelay(0.5); // 0.5 seconds delay
  const gain = audioContext.createGain();
  gain.gain.value = 0.5; // Adjust the gain to control the echo level

  // Connect the nodes
  audioSource.connect(delay);
  delay.connect(gain);
  gain.connect(audioContext.destination);

  // Create a feedback loop for the echo
  const feedback = audioContext.createGain();
  delay.connect(feedback);
  feedback.connect(delay.delayTime);
}

// Add event listener to the button
echoButton.addEventListener('click', addEchoEffect);

// Connect the audio source when the audio element is loaded
audioElement.addEventListener('loadedmetadata', connectAudioSource);