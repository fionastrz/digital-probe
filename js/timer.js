let timeLeft = 120; // 2 Minuten
let timerInterval;
let data = 5;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const alarmSound = document.getElementById("alarmSound");

//creation of increment function
function increment() {
  data = data + 1;
  if (data < 10) {
    document.getElementById("time").innerText = "0" + data + ":00";
  } else {
    document.getElementById("time").innerText = data + ":00";
  }
}
//creation of decrement function
function decrement() {
  if (data < 3) {
    return;
  } else {
    data = data - 1;

    if (data < 10) {
      document.getElementById("time").innerText = "0" + data + ":00";
    } else {
      document.getElementById("time").innerText = data + ":00";
    }
  }
}

document.getElementById('rightBtn').addEventListener('click', increment);
document.getElementById('leftBtn').addEventListener('click', decrement);




function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

startBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 10;
  updateDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeDisplay.textContent = "00:00";
      alarmSound.play();
    }
  }, 1000);
});
