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

<div id="checkbox-datenschutz">
<input type="checkbox" name="datenschutz" id="datenschutz" required>
<label for="datenschutz">Einwilligungserklärung zur Verarbeitung personenbezogener Daten</label>
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
<label for="login-email">E-Mail</label>
<input type="email" id="login-email" placeholder="E-Mail eingeben" required />


<label for="login-password">Passwort</label>
<input type="password" id="login-password" placeholder="Passwort eingeben" required />

<button type="submit">Anmelden</button>


<div class="link">
<a href="#reset" id="resetpw">Passwort vergessen?</a>
</div>
</form>
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
      showToast("Registrierung erfolgreich.", "success");
      switchToLogin();
    }
  });
}

function attachLoginHandler() {
  const resetpw = document.getElementById("resetpw");
  resetpw.addEventListener("click", showPasswordform);

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      showToast(error.message, "error");
      console.error("Login Error:", error.message);
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
<label for="reset-email">E-Mail</label>
<input type="email" id="reset-email" placeholder="E-Mail eingeben" required />
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
    showToast(error.message, "error");
  } else {
    showToast("E-Mail zum Zurücksetzen wurde versendet.", "success");
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
