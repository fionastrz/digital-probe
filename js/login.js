const supabaseUrl = "https://hrswrvqavtkqcrvprrsm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc3dydnFhdnRrcWNydnBycnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEyOTksImV4cCI6MjA4MDY4NzI5OX0.pTWsDXH8c4MQZE7KoJ1JEyOk0XY_FP5KdMOgzmdDftk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function switchToRegister() {
  const container = document.getElementById("form-container");
  container.innerHTML = `
<h2>Registrierung</h2>
<form id="registerForm">
<label for="reg-email">E-Mail</label>
<input type="email" id="reg-email" placeholder="E-Mail eingeben" required />

<label for="reg-password">Passwort</label>
<input type="password" id="reg-password" placeholder="Passwort erstellen" required />

<label for="reg-password2">Passwort wiederholen</label>
<input type="password" id="reg-password2" placeholder="Passwort wiederholen" required />

<label for="ageSelect">Altersgruppe:</label>
<select id="ageSelect" name="age" style="max-width: 50%" required>
  <option value="">Bitte wählen</option>
  <option value="18-25">18–25</option>
  <option value="26-35">26–45</option>
  <option value="46-55">46–65</option>
  <option value="66+">66+</option>
  <option value="kA">keine Angabe</option>
</select>

<p id="datenschutz-link" style="cursor:pointer;
">Einwilligungserklärung lesen</p>
<div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
    background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
  <div style="background:#fff; padding:20px; max-width:800px; max-height:100vh; overflow:auto; border-radius:8px;">
    <h3>Einwilligungserklärung</h3>

    <p style="font-size: large; line-height: 1.6; margin-top: 24px;">Durch deine Registrierung erklärst du dich im Rahmen einer Masterarbeit an der Universität Rostock mit der Speicherung und Auswertung deiner personenbezogenen Daten und Antworten auf die gestellten Fragen einverstanden.<br>
Die Teilnahme an der Studie ist freiwillig und kann jederzeit beendet werden.<br>
Alle persönlichen Daten, die im Rahmen der digitalen Studie erhoben werden, werden vertraulich behandelt und nicht an Dritte weitergegeben. Die Auswertung erfolgt anonymisiert, sodass keine Rückschlüsse auf einzelne Teilnehmer gezogen werden können.
</p>
    <button id="closeModal">Schließen</button>
  </div>
</div>
<div id="checkbox-datenschutz">
<input type="checkbox" name="datenschutz" id="datenschutz" required>
<label for="datenschutz" style="font-size: 1.2rem;">Ich habe die Einwilligungserklärung gelesen und stimme der Verarbeitung meiner Daten zu.
</label>


</div>
<button type="submit">Registrieren</button>
</form>

<div class="switch">
Du hast bereits einen Account? <a href="#" onclick="switchToLogin()">Zum Login</a>
</div>
`;
  attachRegisterHandler(); // Registrierung aktivieren
}

function switchToLogin() {
  const container = document.getElementById("form-container");
  container.innerHTML = `
<h2>Login</h2>
<form id="loginForm">
<label for="login-email">E-Mail-Adresse</label>
<input type="email" id="login-email" placeholder="E-Mail-Adresse" required />


<label for="login-password">Passwort</label>
<input type="password" id="login-password" placeholder="Passwort" required />

<button type="submit">Anmelden</button>

</form>
<div class="link">
<a href="#reset" id="resetpw">Passwort vergessen?</a>
</div>
<div class="switch">
Du hast noch keinen Account? <a href="#" onclick="switchToRegister()">Jetzt registrieren</a>
</div>
`;
  attachLoginHandler(); // Login aktivieren
}

function attachRegisterHandler() {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password");
    const password2 = document.getElementById("reg-password2");
    const ageGroup = document.getElementById("ageSelect").value;

    if (!ageGroup) {
      showToast("Bitte wähle deine Altersgruppe aus.", "error");
    return;
  }
    if (password.value !== password2.value) {
      showToast("Die Passwörter stimmen nicht überein.", "error");
      password.style.borderColor = "red";
      password2.style.borderColor = "red";
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password.value,
    });

    if (error) {
      showToast("Fehler bei der Registrierung.", "error");
      console.error("Sign-Up Error:", error.message);
    } else {
      
      const { error: profileError } = await supabaseClient
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            age_group: ageGroup
          }
        ]);

      if(profileError){
        console.error(profileError.message);
      }

      showToast("Registrierung erfolgreich.", "success");
      switchToLogin();
    }
  });

  const link = document.getElementById("datenschutz-link");
  const modal = document.getElementById("modal");
  const close = document.getElementById("closeModal");

  link.addEventListener("click", () => modal.style.display = "flex");
  close.addEventListener("click", () => modal.style.display = "none");

}

function attachLoginHandler() {
  const resetpw = document.getElementById("resetpw");
  resetpw.addEventListener("click", showPasswordform);

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      email.style.borderColor = "red";
      password.style.borderColor = "red";
      showToast(error.message, "error");
    } else {
      console.log("User:", data.user);
      window.location.href = "home.html";
    }
  });
}

function showPasswordform() {
  const container = document.getElementById("form-container");
  container.innerHTML = `
<h2>Passwort vergessen</h2>
<form id="resetForm">
<label for="reset-email">E-Mail-Adresse:</label>
<input type="email" id="reset-email" placeholder="E-Mail-Adresse" required />
<button type="submit">Neues Passwort anfordern</button>

<div class="link">
<a href="#login" onclick="switchToLogin()">Zurück zum Login</a></div>
</form>
`;
  const form = document.getElementById("resetForm");
  form.addEventListener("submit", sendPwLink);
}

async function sendPwLink(e) {
  e.preventDefault();

  const email = document.getElementById("reset-email").value;

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://fionastrz.github.io/digital-probe/update-password.html",
  });

  if (error) {
    showToast("Es ist ein Fehler aufgetreten", "error");
  } else {
    const container = document.getElementById("form-container");
    container.innerHTML = `
            <h2>Bitte prüfe dein E-Mail-Postfach.
            Dort findest du einen Link, mit dem du dein Passwort zurücksetzen kannst.
            </h2>
            <button onclick="window.location.href = 'index.html';">
            Zurück zum Login
            </button>
            `;
  }
}

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

switchToLogin();
