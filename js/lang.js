const TEXT = {
  de: {
    login: "Login",
    email: "E-Mail-Adresse",
    password: "Passwort",
    loginBtn: "Anmelden",
    forgot: "Passwort vergessen?",
    noAccount: "Du hast noch keinen Account?",
    alrAccount: "Du hast bereits einen Account?",
    registerNow: "Registrieren",

    register: "Registrierung",
    repeatPw: "Passwort wiederholen",
    success: "Registrierung erfolgreich.",
    agegroup: "Altersgruppe",
    chooseage: "Bitte wählen",
    closeButton: "Schließen",
    cancelButton: "Abbrechen",

    // Datenschutz / Consent
    readConsent: "Einwilligungserklärung lesen",
    consentTitle: "Einwilligungserklärung",
    consentCheckbox:
      "Ich habe die Einwilligungserklärung gelesen und stimme der Verarbeitung meiner Daten zu.",
    consentText:
      "Durch deine Registrierung erklärst du dich im Rahmen einer Masterarbeit an der Universität Rostock mit der Speicherung und Auswertung deiner personenbezogenen Daten und Antworten auf die gestellten Fragen einverstanden.<br>" +
      "Die Teilnahme an der Studie ist freiwillig und kann jederzeit beendet werden.<br>" +
      "Alle persönlichen Daten, die im Rahmen der digitalen Studie erhoben werden, werden vertraulich behandelt und nicht an Dritte weitergegeben. Die Auswertung erfolgt anonymisiert, sodass keine Rückschlüsse auf einzelne Teilnehmer gezogen werden können.",

    // Passwort zurücksetzen
    requestNewPassword: "Neues Passwort anfordern",
    checkEmail:
      "Bitte prüfe dein E-Mail-Postfach. Dort findest du einen Link, mit dem du dein Passwort zurücksetzen kannst.",
    backToLogin: "Zurück zum Login",
  },
  en: {
    login: "Log in",
    email: "Email address",
    password: "Password",
    loginBtn: "Log in",
    forgot: "Forgot password?",
    noAccount: "Don’t have an account?",
    alrAccount: "Already have an account?",
    registerNow: "Sign Up",

    register: "Registration",
    repeatPw: "Repeat password",
    success: "Registration successful.",
    agegroup: "Age group",
    chooseage: "Please choose",
    closeButton: "Close",
    cancelButton: "Cancel",

    readConsent: "Read consent declaration",
    consentTitle: "Consent declaration",
    consentCheckbox:
      "I have read the consent declaration and agree to the processing of my data.",
    consentText:
      "By registering, you agree, as part of a master’s thesis at the University of Rostock, to the storage and analysis of your personal data and your responses to the questions asked.<br>" +
      "Participation in the study is voluntary and can be terminated at any time.<br>" +
      "All personal data collected during the digital study will be treated confidentially and will not be shared with third parties. The analysis is carried out in anonymized form, so that no conclusions can be drawn about individual participants.",

    // Reset password
    requestNewPassword: "Request new password",
    checkEmail:
      "Please check your email inbox. You will find a link there to reset your password.",
    backToLogin: "Back to login",
  },
};

function getLang() {
  return localStorage.getItem("lang") || "de";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
location.reload();

}
