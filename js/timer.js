let timeLeft = 120; // 2 Minuten
    let timerInterval;

    const timeDisplay = document.getElementById("time");
    const startBtn = document.getElementById("startBtn");
    const alarmSound = document.getElementById("alarmSound");

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