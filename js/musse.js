


renderMusseTask();

function renderMusseTask() {
  const musseBox = document.getElementById("musse-box");
  musseBox.innerHTML = `
    <h2 class="tasks-header">Entdecken der Muße</h2>
    <p class="tasks-text" id="musse-text">
    Unser Alltag ist oft von Zeitdruck und Erwartungen geprägt. Während wir einer Tätigkeit nachgehen, sind die Gedanken häufig schon bei der nächsten Aufgabe.
    Diese Aufgabe lädt dich dazu ein, dieses Denkmuster zu unterbrechen und dich einer Tätigkeit ohne Ziel, Zeitdruck oder Leistungsansprüche zu widmen, zum Beispiel ein Hobby oder etwas, was du gerne machst.<br><br>
    Deine Erfahrung kannst du dann zu einem passenden Zeitpunkt hier festhalten - gerne auch mehrfach.
  </p>
  <button class="task-button" id="musseBtn">Eindrücke notieren</button>
  `

  document.getElementById("musseBtn").addEventListener("click", openMusseForm);
}

function openMusseForm() {
  const musseBox = document.getElementById("musse-box");
  musseBox.innerHTML = `
        <h2 class="tasks-header">Entdecken der Muße</h2>
        <div class="reflection-header">
          <p class="tasks-text" id="musse-text">
           Schreibe auf, was dir während dieser Tätigkeit aufgefallen ist oder wie sie sich angefühlt hat.
          </p>
              <span class="hint-icon" id="hintIcon">&quest;
    <span class="hint-text" id="hintText">
    Falls dir das Beantworten dieser Frage schwerfällt, kannst du zum Beispiel schreiben, wie du die
Tätgkeit erlebt hast und ob sich währenddessen dein Zeitempfinden verändert hat. Vielleicht gab es auch etwas, 
was dein Erleben von Muße erschwert hat oder es sind zwischenzeitlich sind doch Erwartungen aufgetaucht.
    </span>
  </span>
        </div>
        <form id="musse-form">
        <textarea 
          name="antwort-feld-musse" 
          id="antwort-feld-musse" 
          maxlength="1000" 
          placeholder="Schreibe deine Gedanken auf ..." 
          required></textarea>
        <button class="task-button" type="submit">Absenden</button>
        </form>
      <button id="cancelBtn" class="stop-button">Zurück</button>
        `;

    document
    .getElementById("musse-form")
    .addEventListener("submit", handleMusseFormSubmit);
    document.getElementById("cancelBtn").addEventListener("click", renderMusseTask);
}


async function handleMusseFormSubmit(e) {
  e.preventDefault();
  const antwort = document.getElementById("antwort-feld-musse").value;
  const musseBox = document.getElementById("musse-box")

  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    await supabaseClient.from("user_entries").insert([
      {
        user_id: user.id,
        task_type: "musse",
        textarea_response: antwort,
      },
    ]);

    showToast("Deine Antwort wurde gespeichert", "success");
    musseBox.innerHTML =
      `<h2 class="placeholder">Vielen Dank für deine Antwort. </h2>
        <button id="cancelBtn" class="stop-button">Zurück zur Aufgabe</button>
      `
      document.getElementById("cancelBtn").addEventListener("click", renderMusseTask);

  } catch (error) {
    alert("Fehler: " + error.message);
  }
}
