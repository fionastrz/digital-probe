const START_TIME = 5;
let timerInterval;
let timer_data = 5; // default time

const timerBox = document.getElementById("timer-box");
const displayedTime = document.getElementById("time");
const alarmSound = document.getElementById("alarmSound");


document.getElementById("rightBtn").addEventListener("click", increment);
document.getElementById("leftBtn").addEventListener("click", decrement);
document.getElementById("startBtn").addEventListener("click", startTimer);

function increment() {
  clearInterval(timerInterval);
  timer_data++;
  timer_data = String(timer_data).padStart(2, "0");
  displayedTime.textContent = `${timer_data}:00`;
}

function decrement() {
  clearInterval(timerInterval)
  if (timer_data < 3) {
    return;
  } else {
    timer_data--;
    timer_data = String(timer_data).padStart(2, "0");
    displayedTime.textContent = `${timer_data}:00`;
  }
}

function updateDisplay(secondsLeft) {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  displayedTime.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  document.getElementById("startBtn").disabled = true
  clearInterval(timerInterval);
  secondsLeft = timer_data*60;
  updateDisplay(secondsLeft);
  timerInterval = setInterval(handleTimerTick, 1000);
}

function handleTimerTick() {
  secondsLeft--;

  if (secondsLeft <= 0) {
    finishTimer();
    return;
  }

  updateDisplay(secondsLeft);
}

function finishTimer() {
  clearInterval(timerInterval);
  updateDisplay(0);
  alarmSound.play();
  renderReflectionForm();
}

function renderReflectionForm() {
  timerBox.innerHTML = `
        <h3 id="timer-header">Bewusst Innehalten</h3>
        <form id="timer-form">
        <p id="timer-text">Wie waren die letzten ${Number(timer_data)} Minuten für dich?</p>
        <textarea 
          name="antwort-feld-timer" 
          id="antwort-feld-timer" 
          maxlength="1000" 
          placeholder="Schreibe deine Gedanken auf ..." 
          required></textarea>
        <button type="submit">Absenden</button>
        </form>
        `;

  document
    .getElementById("timer-form")
    .addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const antwort = document.getElementById("antwort-feld-timer").value;

  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    await supabaseClient.from("user_entries").insert([
      {
        user_id: user.id,
        task_type: "timer",
        timer_zeit: timer_data,
        textarea_response: antwort,
      },
    ]);

    showToast("Deine Antwort wurde gespeichert", "success");
    timerBox.innerHTML =
      "<h2>Danke für deine Antwort. Du kannst diesen Timer beliebig oft starten und verschiedene Zeiten ausprobieren.</h2>";
  } catch (error) {
    alert("Fehler: " + error.message);
  }
}
