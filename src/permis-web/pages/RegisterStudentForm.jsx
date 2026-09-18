import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import http from "../../helpers/http.jsx";
import "./RegisterStudentForm.css";

/* ────────────────────────────────────────────────────────────────────────
   WHAT THIS FILE IS
   A standalone React component that recreates the Vue "RegisterStudentform"
   fields, but wrapped in the visual design language of StudentProfile.jsx
   (same white rounded cards, same grey inputs, same dark button, same
   success modal). It does NOT talk to any backend — it's frontend only,
   exactly as requested. Wire up `onSubmit` from the parent to actually
   send the data somewhere.
   ──────────────────────────────────────────────────────────────────────── */

// ── Icon (copied style from StudentProfile.jsx so the eye icon matches) ───
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
  </svg>
);

// ── Success Modal (same pattern as StudentProfile.jsx) ─────────────────────
function SuccessModal({ message, onClose }) {
  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sp-modal-header">
          <IconInfo />
          <span className="sp-modal-header-text">Succès</span>
        </div>
        <div className="sp-modal-body">
          <p className="sp-modal-msg">{message}</p>
        </div>
        <div className="sp-modal-footer">
          <button className="sp-modal-close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ── Every field from RegisterStudentform.vue, starting empty ──────────────
// NOTE: "gearbox_type" existed in the Vue form's data object but was never
// actually rendered as a visible input anywhere in the template, so it's
// left out here too. Ask if you want it added as a real field.
const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  boite_type: "",       // Boîte Manuelle (BM) / Boîte Automatique (BA)
  ville: "",             // Centre de formation — Creil / Toulouse
  neph_status: "",       // Sans NEPH / Avec NEPH
  neph_document_requirement: "",
  sexe: "",              // Homme / Femme
  date_naissance: "",
  postal: "",            // auto-filled from ville, hidden from the user (matches Vue's "hidden" div)
  postal_code_1: "",
  has_neph: "",          // Oui / Non — only controls whether the NEPH field shows
  neph: "",
  date_code: "",
  how_know: "",
  adresse: "",
  password: "",
  password_confirmation: "",
};

// Same postal-code lookup table as the Vue file's `postalCodes` object
const POSTAL_CODES = {
  Creil: "60100",
  Toulouse: "31300",
};

const NEPH_DOCUMENT_OPTIONS = {
  sans_neph: [
    "Carte d'identité — obligatoire",
    "Justificatif de domicile — obligatoire",
    "ASSR 2 — non obligatoire (à préciser lors de l'appel)",
    "Carte d'identité du représentant légal — non obligatoire, si l'élève vit chez ses parents",
    "Attestation d'hébergement datée et signée des deux parties",
    "E-photos — non obligatoire",
  ],
  avec_neph: ["Cerfa 02", "Feuille de code"],
};

export default function RegisterStudentForm({ onSubmit = () => {} }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedRequirementDocuments, setSelectedRequirementDocuments] = useState([]);
  const requirementFileInputRef = useRef(null);
  const pendingRequirementTypeRef = useRef("");

  // "Is anything different from the blank form?" — used to enable/disable
  // the submit button, same idea as Vue's `form.isDirty`.
  const isDirty = Object.keys(form).some((key) => form[key] !== INITIAL_FORM[key]);

  // Generic field updater: pass the field name and the new value.
  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Equivalent of Vue's `watch(() => form.ville, ...)`:
  // whenever the chosen city changes, auto-fill the (hidden) postal code.
  useEffect(() => {
    setField("postal", POSTAL_CODES[form.ville] || "");
  }, [form.ville]);

  // Equivalent of Vue's `watch(() => form.has_neph, ...)`:
  // when the answer isn't "Oui", clear whatever was typed into neph.
  useEffect(() => {
    if (form.has_neph !== "Oui") {
      setField("neph", "");
    }
  }, [form.has_neph]);

  // Simple frontend-only validation, mirroring which fields the Vue
  // template actually marks as `required`.
  function validate(values) {
    const next = {};
    if (!values.first_name.trim()) next.first_name = "Le prénom est requis.";
    if (!values.last_name.trim()) next.last_name = "Le nom est requis.";
    if (!values.email.trim()) next.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Adresse e-mail invalide.";
    if (!values.phone.trim()) next.phone = "Le numéro de téléphone est requis.";
    if (!values.password) next.password = "Le mot de passe est requis.";
    if (!values.password_confirmation) {
      next.password_confirmation = "Merci de confirmer le mot de passe.";
    } else if (values.password && values.password !== values.password_confirmation) {
      next.password_confirmation = "Les mots de passe ne correspondent pas.";
    }
    return next;
  }

  // Same idea as the Vue file's `@blur="checkPassword(form)"` — check the
  // match as soon as the user leaves the confirm-password field.
  function checkPasswordMatch() {
    if (form.password_confirmation && form.password !== form.password_confirmation) {
      setErrors((prev) => ({ ...prev, password_confirmation: "Les mots de passe ne correspondent pas." }));
    } else {
      setErrors((prev) => ({ ...prev, password_confirmation: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value ?? ""));
      selectedRequirementDocuments.forEach((document, index) => {
        payload.append(`documents[${index}][type]`, document.type);
        document.files.forEach((file) => payload.append(`documents[${index}][files][]`, file));
      });
      await http.post("/public/register/student", payload, { headers: { "Content-Type": "multipart/form-data" } });
      onSubmit(form);
      navigate("/login-page", { replace: true });
    } catch (error) {
      const serverErrors = error.response?.data?.errors ?? {};
      const firstError = Object.values(serverErrors).flat()[0] ?? error.response?.data?.message ?? "Une erreur est survenue lors de l'inscription.";
      setErrors({ form: firstError });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sp-page rf-page">
      {/* ── Header, matching the text from RegisterStudentPage.vue ── */}
      <div className="rf-header">
        <h1 className="rf-title">S'inscrire à votre espace</h1>
        <p className="rf-subtitle">
          Tu es déjà membre ?{" "}
          <NavLink to="/login-page" className="rf-link">Se connecter</NavLink>
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Card 1 : identity ── */}
        <div className="sp-form-card">
          <div className="sp-section">
            <div className="sp-grid sp-grid--two">
              <label className="sp-field">
                <span className="sp-label">Prénom <span className="sp-required">*</span></span>
                <input
                  className="sp-input"
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                />
                {errors.first_name && <span className="rf-error">{errors.first_name}</span>}
              </label>

              <label className="sp-field">
                <span className="sp-label">Nom <span className="sp-required">*</span></span>
                <input
                  className="sp-input"
                  value={form.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                />
                {errors.last_name && <span className="rf-error">{errors.last_name}</span>}
              </label>
            </div>

            <div className="sp-grid sp-grid--two">
              <label className="sp-field">
                <span className="sp-label">Email <span className="sp-required">*</span></span>
                <input
                  type="email"
                  className="sp-input"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
                {errors.email && <span className="rf-error">{errors.email}</span>}
              </label>

              <label className="sp-field">
                <span className="sp-label">Numéro de téléphone <span className="sp-required">*</span></span>
                <input
                  type="tel"
                  className="sp-input"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
                {errors.phone && <span className="rf-error">{errors.phone}</span>}
              </label>
            </div>
          </div>
        </div>

        {/* ── Card 2 : training details + address ── */}
        <div className="sp-form-card">
          <div className="sp-section">

            <label className="sp-field">
              <span className="sp-label">Pour votre formation, quel type de véhicule souhaitez-vous utiliser ?</span>
              <select
                className="sp-input"
                value={form.boite_type}
                onChange={(e) => setField("boite_type", e.target.value)}
              >
                <option value="">Choisir le type de boîte</option>
                <option value="0">Boîte Manuelle (BM)</option>
                <option value="1">Boîte Automatique (BA)</option>
              </select>
            </label>

            <label className="sp-field">
              <span className="sp-label">Centre de formation</span>
              <select
                className="sp-input"
                value={form.ville}
                onChange={(e) => setField("ville", e.target.value)}
              >
                <option value="">Choisissez votre centre de formation</option>
                <option value="Creil">Creil</option>
                <option value="Toulouse">Toulouse</option>
              </select>
            </label>

            <div className="sp-grid sp-grid--two">
              <label className="sp-field">
                <span className="sp-label">Genre</span>
                <select
                  className="sp-input"
                  value={form.sexe}
                  onChange={(e) => setField("sexe", e.target.value)}
                >
                  <option value="">Genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </label>

              <label className="sp-field">
                <span className="sp-label">Date de naissance</span>
                <input
                  type="date"
                  className="sp-input sp-date-input"
                  value={form.date_naissance}
                  onChange={(e) => setField("date_naissance", e.target.value)}
                />
              </label>
            </div>

            {/* Warning box — same text as the Vue template */}
            <div className="rf-warning">
              <span className="rf-warning-icon">⚠️</span>
              <div className="rf-warning-text">
                <p className="rf-warning-title">Important – Choix de la ville</p>
                <p>Merci de bien sélectionner la ville la plus proche de chez vous lors de votre inscription.</p>
                <p>
                  En cas d'erreur (choix d'une autre ville), vous ne pourrez pas planifier vos heures de conduite
                  avec les enseignants rattachés à votre agence. Cela risque d'entraîner des retards dans votre
                  planning et dans votre préparation à l'examen.
                </p>
                <p className="rf-warning-strong">
                  👉 Vérifiez attentivement votre ville avant de valider votre inscription afin de bénéficier d'un
                  suivi optimal avec la bonne équipe pédagogique.
                </p>
              </div>
            </div>

            {/* NOTE: this second "Ville" dropdown is bound to the exact same
                `ville` field as "Centre de formation" above — that's how the
                original Vue file is written (looks like a leftover
                duplicate). Kept as-is so nothing is missing, per your
                request not to change behaviour. */}
            <label className="sp-field">
              <span className="sp-label">Ville</span>
              <select
                className="sp-input"
                value={form.ville}
                onChange={(e) => setField("ville", e.target.value)}
              >
                <option value="">Ville</option>
                <option value="Creil">Creil</option>
                <option value="Toulouse">Toulouse</option>
              </select>
            </label>

            <label className="sp-field">
              <span className="sp-label">NEPH</span>
              <select
                className="sp-input"
                value={form.neph_status}
                onChange={(e) => {
                  pendingRequirementTypeRef.current = "";
                  setSelectedRequirementDocuments([]);
                  setForm((previous) => ({ ...previous, neph_status: e.target.value, neph_document_requirement: "" }));
                }}
              >
                <option value="">Sélectionnez une option</option>
                <option value="sans_neph">Sans NEPH</option>
                <option value="avec_neph">Avec NEPH</option>
              </select>
            </label>

            {form.neph_status && (
              <label className="sp-field">
                <span className="sp-label">Documents à fournir</span>
                <select
                  key={form.neph_status}
                  className="sp-input"
                  value={form.neph_document_requirement}
                  onChange={(e) => {
                    const documentType = e.target.value;
                    setField("neph_document_requirement", documentType);
                    pendingRequirementTypeRef.current = documentType;
                    if (documentType) {
                      window.setTimeout(() => requirementFileInputRef.current?.click(), 0);
                    }
                  }}
                >
                  <option value="" disabled>Sélectionnez un document</option>
                  {NEPH_DOCUMENT_OPTIONS[form.neph_status].map((document) => <option key={document} value={document}>{document}</option>)}
                </select>
                <input
                  ref={requirementFileInputRef}
                  type="file"
                  className="rf-hidden-file-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    const documentType = pendingRequirementTypeRef.current;
                    if (!documentType || files.length === 0) return;

                    setSelectedRequirementDocuments((previous) => {
                      const existing = previous.find((document) => document.type === documentType);
                      if (existing) {
                        return previous.map((document) => document.type === documentType
                          ? { ...document, files: [...document.files, ...files] }
                          : document);
                      }
                      return [...previous, { type: documentType, files }];
                    });
                    e.target.value = "";
                  }}
                />
                {selectedRequirementDocuments.length > 0 && (
                  <span className="rf-selected-file">
                    {selectedRequirementDocuments.map((document) => (
                      <span key={document.type} style={{ display: "block" }}>
                        {document.type} : {document.files.map((file) => file.name).join(", ")}
                      </span>
                    ))}
                  </span>
                )}
              </label>
            )}

            <label className="sp-field">
              <span className="sp-label">Code postal 1</span>
              <input
                className="sp-input"
                placeholder="Entrez un second code postal si besoin"
                value={form.postal_code_1}
                onChange={(e) => setField("postal_code_1", e.target.value)}
              />
            </label>

            <label className="sp-field">
              <span className="sp-label">Avez-vous un numéro NEPH ?</span>
              <select
                className="sp-input"
                value={form.has_neph}
                onChange={(e) => setField("has_neph", e.target.value)}
              >
                <option value="">Sélectionnez une option</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </label>

            {form.has_neph === "Oui" && (
              <label className="sp-field">
                <span className="sp-label">Veuillez entrer votre numéro NEPH</span>
                <input
                  className="sp-input"
                  value={form.neph}
                  onChange={(e) => setField("neph", e.target.value)}
                />
              </label>
            )}

            <div className="sp-grid sp-grid--two">
              <label className="sp-field">
                <span className="sp-label">Date d'obtention du code de la route ?</span>
                <input
                  type="date"
                  className="sp-input sp-date-input"
                  value={form.date_code}
                  onChange={(e) => setField("date_code", e.target.value)}
                />
              </label>

              <label className="sp-field">
                <span className="sp-label">Comment avez-vous connu PassPermisFacile ?</span>
                <select
                  className="sp-input"
                  value={form.how_know}
                  onChange={(e) => setField("how_know", e.target.value)}
                >
                  <option value="">Choisir une option</option>
                  <option value="Internet">Internet</option>
                  <option value="Publicité">Publicité</option>
                  <option value="Bouche à oreilles">Bouche à oreilles</option>
                  <option value="Flyers">Flyers</option>
                  <option value="Auto école">Auto école</option>
                  <option value="Autres">Autres</option>
                </select>
              </label>
            </div>

            <label className="sp-field">
              <span className="sp-label">Adresse complète</span>
              <textarea
                className="sp-input sp-textarea"
                value={form.adresse}
                onChange={(e) => setField("adresse", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* ── Card 3 : password + terms ── */}
        <div className="sp-form-card">
          <div className="sp-section">
            <div className="sp-grid sp-grid--two">
              <label className="sp-field">
                <span className="sp-label">Mot de passe <span className="sp-required">*</span></span>
                <span className="sp-password-wrap">
                  <input
                    className="sp-input sp-password-input"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                  />
                  <button
                    className="sp-password-toggle"
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <IconEye />
                  </button>
                </span>
                {errors.password && <span className="rf-error">{errors.password}</span>}
              </label>

              <label className="sp-field">
                <span className="sp-label">Mot de passe confirmation <span className="sp-required">*</span></span>
                <span className="sp-password-wrap">
                  <input
                    className="sp-input sp-password-input"
                    type={showConfirm ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={(e) => setField("password_confirmation", e.target.value)}
                    onBlur={checkPasswordMatch}
                  />
                  <button
                    className="sp-password-toggle"
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <IconEye />
                  </button>
                </span>
                {errors.password_confirmation && <span className="rf-error">{errors.password_confirmation}</span>}
              </label>
            </div>

            <div className="rf-terms">
              <p><span className="sp-required">*</span> Champs obligatoires</p>
              <p>
                En vous inscrivant, vous confirmez avoir lu et accepté les{" "}
                <a href="/conditions-utilisation" className="rf-link">conditions générales d'utilisation</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="sp-save-bar">
          {errors.form && <span className="rf-error">{errors.form}</span>}
          <button className="sp-save-btn" type="submit" disabled={!isDirty || submitting}>
            {submitting ? "Inscription en cours…" : "S'inscrire maintenant"}
          </button>
        </div>
      </form>

      {showModal && (
        <SuccessModal message={successMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
