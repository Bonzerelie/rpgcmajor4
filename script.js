const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const startScreen = document.getElementById('start-screen');
const playRefBtn = document.getElementById('play-reference');
const replayNoteBtn = document.getElementById('replay-note');
const nextBtn = document.getElementById('next-button');
const resetScoreBtn = document.getElementById('reset-score');
const promptText = document.getElementById('prompt');
const noteButtons = document.querySelectorAll('.blue-button');
const scaleSelector = document.getElementById('scale-selector');
const notesModeBtn = document.getElementById('notes-mode');
const scaleDegreesModeBtn = document.getElementById('scale-degrees-mode');
const modeHeading = document.getElementById('mode-heading');
const octaveInfo = document.getElementById('octave-info');

const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const totalCount = document.getElementById('total-count');
const accuracyDisplay = document.getElementById('accuracy');

let currentNote = '';
let audio = new Audio();
let correct = 0;
let incorrect = 0;
let isAnswered = false;

let noteMap = {
  'C': ['c3', 'c4', 'c5', 'c6'],
  'D': ['d3', 'd4', 'd5'],
  'E': ['e3', 'e4', 'e5'],
  'F': ['f3', 'f4', 'f5'],
  'G': ['g3', 'g4', 'g5'],
  'A': ['a3', 'a4', 'a5'],
  'B': ['b3', 'b4', 'b5']
};

const scaleDegreeMap = {
  'C': '1st',
  'D': '2nd',
  'E': '3rd',
  'F': '4th',
  'G': '5th',
  'A': '6th',
  'B': '7th'
};

const allNotes = Object.values(noteMap).flat();

function getNoteName(filename) {
  for (const [name, files] of Object.entries(noteMap)) {
    if (files.includes(filename)) return name;
  }
  return '';
}

function playNote(noteFile) {
  audio.src = `audio/${noteFile}.mp3`;
  audio.play();
}

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  loadNewNote();
}

function loadNewNote() {
  isAnswered = false;
  noteButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
  currentNote = getRandomNote();
  playNote(currentNote);
  promptText.textContent = 'Which note was played?';
  nextBtn.disabled = true;
}

function handleAnswer(e) {
  if (isAnswered) return;
  isAnswered = true;

  const selected = e.target.getAttribute('data-note');
  const correctName = getNoteName(currentNote);
  const correctDegree = scaleDegreeMap[correctName];

  if (selected === correctName || selected === correctDegree) {
    correct++;
    e.target.classList.add('correct');
    promptText.textContent = `Correct! ✅ The note was ${correctName}`;
  } else {
    incorrect++;
    e.target.classList.add('incorrect');
    const correctBtn = [...noteButtons].find(btn => btn.getAttribute('data-note') === correctName);
    if (correctBtn) correctBtn.classList.add('correct');
    promptText.textContent = `Incorrect! ❌ The note played was actually ${correctName}`;
  }

  updateScore();
  nextBtn.disabled = false;
  noteButtons.forEach(btn => btn.disabled = true);
}

function updateScore() {
  const total = correct + incorrect;
  correctCount.textContent = correct;
  incorrectCount.textContent = incorrect;
  totalCount.textContent = total;
  accuracyDisplay.textContent = total ? ((correct / total) * 100).toFixed(1) + '%' : '0.0%';
}

function resetScore() {
  correct = 0;
  incorrect = 0;
  updateScore();
}

function getRandomNote() {
  const selectedScale = scaleSelector.value;
  let selectedNotes;

  if (selectedScale === 'c-d-e') {
    selectedNotes = ['C', 'D', 'E'];
  } else if (selectedScale === 'c-d-e-f-g') {
    selectedNotes = ['C', 'D', 'E', 'F', 'G'];
  } else {
    selectedNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  }

  return selectedNotes[Math.floor(Math.random() * selectedNotes.length)];
}

function toggleDisplayMode() {
  const isScaleDegrees = scaleDegreesModeBtn.classList.contains('active');
  
  if (isScaleDegrees) {
    noteButtons.forEach(btn => {
      const scaleDegree = scaleDegreeMap[btn.getAttribute('data-note')];
      btn.textContent = scaleDegree;
    });
    promptText.textContent = `Which scale degree was played?`;
  } else {
    noteButtons.forEach(btn => {
      btn.textContent = btn.getAttribute('data-note');
    });
    promptText.textContent = `Which note was played?`;
  }
}

scaleSelector.addEventListener('change', loadNewNote);
notesModeBtn.addEventListener('click', () => {
  scaleDegreesModeBtn.classList.remove('active');
  notesModeBtn.classList.add('active');
  toggleDisplayMode();
});
scaleDegreesModeBtn.addEventListener('click', () => {
  notesModeBtn.classList.remove('active');
  scaleDegreesModeBtn.classList.add('active');
  toggleDisplayMode();
});

startButton.addEventListener('click', startGame);
resetScoreBtn.addEventListener('click', resetScore);

noteButtons.forEach(btn => {
  btn.addEventListener('click', handleAnswer);
});

nextBtn.addEventListener('click', loadNewNote);
