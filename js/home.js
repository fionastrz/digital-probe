// Supabase Setup
const supabaseUrl = "https://hrswrvqavtkqcrvprrsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc3dydnFhdnRrcWNydnBycnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEyOTksImV4cCI6MjA4MDY4NzI5OX0.pTWsDXH8c4MQZE7KoJ1JEyOk0XY_FP5KdMOgzmdDftk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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
  }
}
checkUser();

// Formular absenden
document
  .getElementById("antwort-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const antwort = document.getElementById("antwort-feld").value;
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // Eingaben in Tabelle speichern
    const { data, error } = await supabaseClient
      .from("user_entries")
      .insert([{ user_id: user.id, task_type: "tagebuch", textarea_response: antwort,}]);

    if (error) {
      alert("Fehler: " + error.message);
    } else {
      showToast("Antwort wurde gespeichert", "success")
      document.getElementById("antwort-form").reset();
    }
  });

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

// Upload von Bildern
document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("upload-file");
  const commentField = document.getElementById("kommentar-feld");

  const file = fileInput.files[0];
  const comment = commentField.value.trim();

  if (!file) {
    showToast("Bitte wähle eine Datei aus!", "error");
    return;
  }

  const user = (await supabaseClient.auth.getUser()).data.user;
  // Eindeutiger Dateiname
  const fileName = `${user.id}/${Date.now()}-${file.name}`;

  const { data, error } = await supabaseClient.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    console.log(error);
    showToast("Upload fehlgeschlagen! ", "error");
    return;
  }
  ///else {
  //showToast("Bild erfolgreich hochgeladen!", "success");

  // Eingabefeld leeren
  const { data: insertData, error: dbError } = await supabaseClient
    .from("image_entries")
    .insert({
      file_name: fileName,
      created_at: new Date(),
      comment: comment,
      user_id: user.id,
    });

  if (dbError) {
    showToast("DB Error", "error");
    console.log("DB-Fehler: " + dbError.message);
    return;
  }
  showToast("Erfolgreich gespeichert", "success");
  location.reload()

  fileInput.value = "";
  commentField.value = "";
});

// Aktuellen User holen
async function loadUserImages() {
  const user = (await supabaseClient.auth.getUser()).data.user;

  const { data: entries, error } = await supabaseClient
    .from("image_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der Einträge:", error);
    return;
  }

  if (entries.length > 0) {
    const title = document.getElementById("bild-hochladen");
    title.textContent = "Hier kannst du deine Bilder ansehen";
  }

  const container = document.getElementById("images-container");
  container.innerHTML = ""; // leeren

  for (const entry of entries) {
    // Signed URL (30 Minuten gültig)
    const { data: urlData, error: urlError } = await supabaseClient.storage
      .from("images")
      .createSignedUrl(entry.file_name, 60);

    const img = document.createElement("img");
    img.src = urlData.signedUrl;
    img.classList.add("uploaded-image");

    const comment = document.createElement("p");
    comment.textContent = entry.comment;

    const card = document.createElement("div");
    card.classList.add("image-card");

    card.appendChild(img);
    card.appendChild(comment);
    container.appendChild(card);
  }
}

loadUserImages();
