document.getElementById("musseBtn").addEventListener("click", openMusseForm);

function openMusseForm() {
  const musseBox = document.getElementById("musse-box");
  musseBox.innerHTML = `
        <h2 class="tasks-header">Entdecken der Muße</h2>
          <p class="tasks-text" id="musse-text">
            Wie oft bist du im Alltag wirklich bei einer Sache? Wähle eine
            Tätigkeit die du gerne ausführst, und widme ihr deine volle
            Aufmerksamkeit (ohne Druck und Erwartungen). Wenn möglich, reduziere
            Ablenkungen, zum Beispiel indem du Benachrichtigungen
            stummschaltest. Im Anschluss kannst du deine Eindrücke
            festhalten.<br />
          </p>
        <form id="musse-form">
        <textarea 
          name="antwort-feld-musse" 
          id="antwort-feld-musse" 
          maxlength="1000" 
          placeholder="Schreibe deine Gedanken auf ..." 
          required></textarea>
        <button class="task-button" type="submit">Absenden</button>
        </form>
        `;

    document
    .getElementById("musse-form")
    .addEventListener("submit", handleMusseFormSubmit);
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
      "<h2>Vielen Dank für deine Antwort. </h2>";
  } catch (error) {
    alert("Fehler: " + error.message);
  }
}
