let timerMinutes = 5;
let secondsLeft;
let timerInterval;

const timerBox = document.getElementById("timer-box");
const alarmSound = document.getElementById("alarmSound");

renderTimerTask();

function renderTimerTask() {
  timerBox.innerHTML = `
      <h2 class="tasks-header">Bewusst Innehalten</h2>
      <p class="tasks-text">
        Nimm dir ein paar Minuten Zeit, um bewusst nichts zu tun. Nach Ablauf der Zeit wirst du gebeten, deine Gedanken und Gefühle, die während dieser Zeit aufgekommen sind, auszuschreiben
      </p>
    <div class="time-intent">
      <p class="tasks-text">
        Wie viel Zeit möchtest du dir nehmen?
      </p>

      <div class="time-value">
        <button id="leftBtn" class="timer-button">&minus;</button>
        <strong><span id="minutes">5</span> Minuten</strong>
        <button id="rightBtn" class="timer-button">&plus;</button>
      </div>

    </div>
      <button class="task-button" id="startBtn">Starten</button>        
  `;
  document.getElementById("rightBtn").addEventListener("click", increment);
  document.getElementById("leftBtn").addEventListener("click", decrement);
  document.getElementById("startBtn").addEventListener("click", startTimer);
  updateMinutes();
}

function renderReflectionForm() {
  timerBox.innerHTML = `
    <h2 class="tasks-header">Bewusst Innehalten</h2>
    <div class="reflection-header">
    <p class="tasks-text">
      Wie hast du die Zeit in den letzten <strong>${timerMinutes} Minuten</strong> erlebt?
    </p>
    <span class="hint-icon" id="hintIcon">&quest;
    <span class="hint-text" id="hintText">
    Wenn dir das Schreiben schwerfällt, kannst du beschreiben, wie sich die Zeit für dich angefühlt hat. 
    Vielleicht kam sie dir lang oder kurz vor, angenehm oder unangenehm. 
    Oder du beschreibst Gedanken, die dir dabei durch den Kopf gingen.
    </span>
  </span>
  </div>
    <form id="timer-form">
      <textarea
        id="antwort-feld-timer"
        maxlength="1000"
        placeholder="Schreibe deine Gedanken auf …"
        required></textarea>

      <button class="task-button" type="submit">Absenden</button>
    </form>
  `;

  document
    .getElementById("timer-form")
    .addEventListener("submit", handleFormSubmit);
}

function updateMinutes() {
  const minutesSpan = document.getElementById("minutes");
  if (minutesSpan) {
    minutesSpan.textContent = timerMinutes;
  }
}

function increment() {
  timerMinutes++;
  updateMinutes();
}

function decrement() {
  if (timerMinutes <= 3) return;
  timerMinutes--;
  updateMinutes();
}

function startTimer() {
  secondsLeft = timerMinutes * 60;
  disableAllButtons();

  timerBox.innerHTML = `
    <h2 class="tasks-header">Bewusst Innehalten</h2>
    <p class="tasks-text">Der Timer läuft jetzt. Nach Ablauf hörst du einen sanften Benachrichtigungston - dann kannst du kurz festhalten, wie es für dich war.</p>
    <button id="stopBtn" class="stop-button">Abbrechen</button>
  `;

  document.getElementById("stopBtn").addEventListener("click", stopTimer);

  timerInterval = setInterval(handleTimerTick, 1000);
}

function handleTimerTick() {
  secondsLeft--;

  if (secondsLeft <= 0) {
    finishTimer();
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  enableAllButtons();
  renderTimerTask();
}

function finishTimer() {
  clearInterval(timerInterval);
  alarmSound.play();
  renderReflectionForm();
}

function disableAllButtons() {
  document.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
}

function enableAllButtons() {
  document.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
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
        timer_minutes: timerMinutes,
        textarea_response: antwort,
      },
    ]);

    showToast("Deine Antwort wurde gespeichert", "success");
    timerBox.innerHTML =
      `<h2 class="placeholder">Danke für deine Antwort. Du kannst diesen Timer beliebig oft starten und verschiedene Zeiten ausprobieren.</h2>
      <button id="cancelBtnTimer" class="stop-button">Zurück</button>`
      document.getElementById("cancelBtnTimer").addEventListener("click", stopTimer);


  } catch (error) {
    alert("Fehler: " + error.message);
  }
}
