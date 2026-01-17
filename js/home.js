// Supabase Setup
const supabaseUrl = "https://hrswrvqavtkqcrvprrsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc3dydnFhdnRrcWNydnBycnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEyOTksImV4cCI6MjA4MDY4NzI5OX0.pTWsDXH8c4MQZE7KoJ1JEyOk0XY_FP5KdMOgzmdDftk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
let currentUser = null;

const dailyBox = document.getElementById("daily-box");

const daily_questions = {
  1: "Wie organisierst du deinen Alltag? Nutzt du dafür analoge oder digitale Hilfsmittel, zum Beispiel Kalender, To-do-Listen oder Handy-Apps? ",
  2: "Wann fühlt sich ein Tag für dich „produktiv“ an? Denkst du, deine Sichtweise unterscheidet sich von der von anderen? Wenn ja, inwiefern",
  3: "Bitte lies dir den folgenden Textausschnitt durch. Es handelt sich dabei um einen Auszug aus einem Ratgeber für Studierende, der dabei helfen soll, eine Lebensvision zu entwickeln. Notiere spontan, welche Gedanken oder Gefühle dabei in dir auftauchen.",
  4: "Bitte sieh dir die beiden abgebildeten Kalender an. Welcher spricht dich eher an? Welche Annahmen verbindest du mit Personen, die ihren Kalender in der jeweiligen Form nutzen?",
  5: " Haben die Fragen und Aufgaben der vergangenen Tage etwas in dir verändert? Ist dir zum Beispiel etwas aufgefallen, was vorher keine Rolle gespielt hat?",
};

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", logout);
// Teilnahme beenden
const modal = document.getElementById("modal");
const close = document.getElementById("closeModal");

document
  .getElementById("teilnahmeBtn")
  .addEventListener("click", () => (modal.style.display = "flex"));
close.addEventListener("click", () => (modal.style.display = "none"));


function showToast(message, type) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  // Toast nach 3 Sekunden entfernen
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Prüfen ob User eingeloggt ist

async function checkUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = "index.html"; // zurück zum Login
    return;
  }
  currentUser = user;
}

(async () => {
  await checkUser();
  await checkDay();
  await loadUserImages();
})();

async function getDiaryEntries() {
  const { data, error } = await supabaseClient
    .from("user_entries")
    .select()
    .eq("user_id", currentUser.id)
    .eq("task_type", "tagebuch")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

async function checkDay() {
  const entries = await getDiaryEntries();

  const dayCounter = entries.length + 1;
  let isAlreadyAnswered = false;

  if (entries.length > 0) {
    const today = new Date().toDateString();
    const lastEntryDate = new Date(entries[0].created_at).toDateString();

    isAlreadyAnswered = today === lastEntryDate;
  }

  if (isAlreadyAnswered == false) {
    showDailyTask(dayCounter);
  } else {
    dailyBox.innerHTML = `<h2>Du hast die täglichen Fragen für heute bereits ausgefüllt. Schaue morgen wieder vorbei!</h2>`;
  }

  return { dayCounter, isAlreadyAnswered };
}

function showDailyTask(dayCounter) {
  dailyBox.innerHTML = `
    <h2 class="tasks-header">Tag ${dayCounter}</h2>
    <p  class="tasks-text">
      ...
    </p>    
    <form id="antwort-form">

      <h3 id="dailyquestion">
      Was ist dir an dem heutigen Tag besonders in Erinnerung geblieben?
    </h3>
    <textarea
      id="daily-feld"
      name="daily-feld"
      placeholder="Schreibe deine Gedanken auf ..."
      maxlength="1000"
      required
    ></textarea>
    <input type="file" id="upload-files" accept="image/*" />

    <h3 id="dailyquestion">
      ${daily_questions[dayCounter]}
    </h3>
    <textarea
      id="antwort-feld"
      name="antwort-feld"
      placeholder="Schreibe deine Gedanken auf ..."
      maxlength="1000"
      required
    ></textarea>
    <button class="task-button" type="submit">Absenden</button>
  </form>`;
  document
    .getElementById("antwort-form")
    .addEventListener("submit", submitEntry);
}

async function uploadFile(file, fileName) {
  const { data, error } = await supabaseClient.storage
    .from("images")
    .upload(fileName, file);
  if (error) {
    showToast("Upload fehlgeschlagen! ", "error");
    return;
  }
}

// Formular absenden
async function submitEntry(e) {
  e.preventDefault();
  const antwort = document.getElementById("antwort-feld").value;
  const fileInput = document.getElementById("upload-files");

  const file = fileInput.files[0];
  let fileName = null;

  if (file) {
    fileName = `${currentUser.id}/${Date.now()}-${file.name}`;
    uploadFile(file, fileName);
  }

  // Eingaben in Tabelle speichern
  try {
    await supabaseClient.from("user_entries").insert([
      {
        user_id: currentUser.id,
        task_type: "tagebuch",
        textarea_response: antwort,
        image_filename: fileName,
      },
    ]);
    showToast("Deine Antwort wurde gespeichert", "success");
    const dailyBox = document.getElementById("daily-box");
    dailyBox.replaceChildren();
    const successtext = document.createElement("h2");
    successtext.textContent =
      "Danke fürs Ausfüllen. Schau morgen wieder vorbei";
    dailyBox.appendChild(successtext);
  } catch (error) {
    alert("Fehler: " + error.message);
  }
}

// Aktuellen User holen
async function loadUserImages() {
  const entries = await getDiaryEntries();
  let counter = entries.length;

  if (entries.length > 0) {
    const title = document.getElementById("bild-hochladen");
    title.textContent = "Hier kannst du deine letzten Einträge ansehen";

    const container = document.getElementById("images-container");
    container.innerHTML = ""; // leeren

    for (const entry of entries) {
      const card = document.createElement("div");
      const header = document.createElement("h3");
      header.textContent = `Tag ${counter}`;

      if (entry.image_filename != null) {
        const { data: urlData, error: urlError } = await supabaseClient.storage
          .from("images")
          .createSignedUrl(entry.image_filename, 60);

        const img = document.createElement("img");
        img.src = urlData.signedUrl;
        img.classList.add("uploaded-image");
        card.appendChild(img);
      }

      const comment = document.createElement("p");
      comment.textContent = entry.textarea_response;

      card.classList.add("image-card");
      card.appendChild(header);
      card.appendChild(comment);
      container.appendChild(card);
      counter--;
    }
  }
}
