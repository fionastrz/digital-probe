let timeLeft = 120; // 2 Minuten
let timerInterval;
let timer_data = 5;

const timerBox = document.getElementById("timer-box");
const timeDisplay = document.getElementById("time");
const timeContainer = document.getElementById("countdown");
const startBtn = document.getElementById("startBtn");
const alarmSound = document.getElementById("alarmSound");

//creation of increment function
function increment() {
  timer_data = timer_data + 1;
  if (timer_data < 10) {
    document.getElementById("time").innerText = "0" + timer_data + ":00";
  } else {
    document.getElementById("time").innerText = timer_data + ":00";
  }
}
//creation of decrement function
function decrement() {
  if (timer_data < 3) {
    return;
  } else {
    timer_data = timer_data - 1;

    if (timer_data < 10) {
      document.getElementById("time").innerText = "0" + timer_data + ":00";
    } else {
      document.getElementById("time").innerText = timer_data + ":00";
    }
  }
}

document.getElementById("rightBtn").addEventListener("click", increment);
document.getElementById("leftBtn").addEventListener("click", decrement);

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

startBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 5;
  updateDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alarmSound.play();
      timeContainer.remove();
      startBtn.remove();

      const timertext = document.getElementById("timer-text")
      timertext.textContent = "Wie erging es dir in den letzten " + timer_data + " Minuten?";

      // create textarea
      var textfeld = document.createElement("textarea");
      textfeld.setAttribute("name", "antwort-feld-timer");
      textfeld.setAttribute("id", "antwort-feld-timer");
      textfeld.setAttribute("class", "myClass");
      textfeld.setAttribute("maxLength", "1000");
      textfeld.setAttribute("placeholder", "Schreibe deine Gedanken auf ...");
      textfeld.required = true;

      // create submit button
      var submitBtn = document.createElement("button");
      submitBtn.setAttribute("id", "save");
      submitBtn.textContent = "Absenden";

      timerBox.appendChild(textfeld);
      timerBox.appendChild(submitBtn);

      document.getElementById("save").addEventListener("click", async (e) => {
        e.preventDefault();
        const antwort = document.getElementById("antwort-feld-timer").value;
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        const { data, error } = await supabaseClient
          .from("user_entries")
          .insert([
            {
              user_id: user.id,
              task_type: "timer",
              timer_zeit: timer_data,
              textarea_response: antwort,
            },
          ]);

        if (error) {
          alert("Fehler: " + error.message);
        } else {
          showToast("Deine Antwort wurde gespeichert", "success");
          submitBtn.remove()
          textfeld.remove()
          timertext.remove()
          document.getElementById("timer-header").textContent = "Danke fürs Ausfüllen dieser Aufgabe. Du kannst sie beliebig oft wiederholen, indem du die Seite aktualisierst."

        }
      });
    }
  }, 1000);
});
