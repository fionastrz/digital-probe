// Supabase Setup
const supabaseUrl = "https://hrswrvqavtkqcrvprrsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc3dydnFhdnRrcWNydnBycnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEyOTksImV4cCI6MjA4MDY4NzI5OX0.pTWsDXH8c4MQZE7KoJ1JEyOk0XY_FP5KdMOgzmdDftk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Prüfen ob User eingeloggt ist
async function checkUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = "login.html"; // zurück zum Login
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

    // Eingaben in Tabelle speichern (z. B. "feedback")
    const { data, error } = await supabaseClient
      .from("nutzereingaben")
      .insert([{ eingabe: antwort, user_id: user.id }]);

    if (error) {
      alert("Fehler: " + error.message);
    } else {
      document.getElementById("message").textContent =
        "Antwort wurde gespeichert";
      document.getElementById("feedbackForm").reset();
    }
  });

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
});
