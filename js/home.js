// Supabase Setup
const supabaseUrl = "https://hrswrvqavtkqcrvprrsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc3dydnFhdnRrcWNydnBycnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEyOTksImV4cCI6MjA4MDY4NzI5OX0.pTWsDXH8c4MQZE7KoJ1JEyOk0XY_FP5KdMOgzmdDftk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
let currentUser = null;

const dailyBox = document.getElementById("daily-box");

const daily_questions = {
  1: "Wenn du an Produktivität denkst: Was kommt dir als Erstes in den Sinn?",
  2: "Tages-Frage 2?",
  3: "Tages-Frage 3?",
  4: "Tages-Frage 4?",
  5: "Tages-Frage 5?",
  6: "Tages-Frage 6?",
  7: "Tages-Frage 7?",
};

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", logout);

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
    <form id="antwort-form">
    <h2>Tag ${dayCounter}</h2>
    <p>
      Hier kommen ein paar Fragen hin, die täglich auszufüllen sind, z. B. <br>
      Hast du dir heute etwas vorgenommen und es auch umgesetzt? <br>
      Diagramm ausfüllen, wie der Tag grob verbracht wurde <br>
      und dann jeweils eine Tages-Frage oder ein Tages-Bild (oder zwei zur Auswahl)
    </p>
    <h3>
      ${daily_questions[dayCounter]}
    </h3>
    <textarea
      id="antwort-feld"
      name="antwort-feld"
      placeholder="Schreibe deine Gedanken auf ..."
      maxlength="1000"
      required
    ></textarea>
    <input type="file" id="upload-files" accept="image/*" />
    <button type="submit">Absenden</button>
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
  let counter = entries.length

  if (entries.length > 0) {
    const title = document.getElementById("bild-hochladen");
    title.textContent = "Hier kannst du deine letzten Einträge ansehen";

    const container = document.getElementById("images-container");
    container.innerHTML = ""; // leeren

    for (const entry of entries) {
      
      const card = document.createElement("div");
      const header = document.createElement("h3")
      header.textContent = `Tag ${counter}`

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
      card.appendChild(header)
      card.appendChild(comment);
      container.appendChild(card);
      counter--;
    }
  }
}
