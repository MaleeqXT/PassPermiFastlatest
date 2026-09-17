import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar.jsx";
import StudentHeader from "./StudentHeader.jsx";
import "./CandidateDashboard.css";
import "./CandidateDocumentsPage.css";

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h6" /></svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" /></svg>
);
const HourglassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12M6 22h12M8 2v4a4 4 0 0 0 1.2 2.8L12 12l2.8-3.2A4 4 0 0 0 16 6V2M8 22v-4a4 4 0 0 1 1.2-2.8L12 12l2.8 3.2A4 4 0 0 1 16 18v4" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const IdCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5.5 16c.7-1.6 1.5-2.3 2.5-2.3s1.8.7 2.5 2.3M13 10h5M13 14h4" /></svg>
);
const MedicalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" /></svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3zM21 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z" /></svg>
);
const ExamDocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3.5h6V7H9zM8.5 12h7M8.5 16h4" /></svg>
);
const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 10 10-5 10 5-10 5Z" /><path d="M6 12.5V17c3 2.3 9 2.3 12 0v-4.5M22 10v6" /></svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
);
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.7 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);
const UploadCloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l-4-4-4 4M12 12v9" /><path d="M20.4 17.5A5 5 0 0 0 18 8.2 7 7 0 0 0 4.3 10.4 4.5 4.5 0 0 0 5.5 19H8" /></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" /></svg>
);
const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3a2 2 0 0 1 2 2v3H6a2 2 0 0 1-2-2zM20 14h-3a2 2 0 0 0-2 2v3h3a2 2 0 0 0 2-2zM15 19c0 1.1-.9 2-2 2h-1" /></svg>
);

const SUMMARY_CARDS = [
  { id: "all", icon: <FolderIcon />, tone: "purple", label: "Tous mes documents", value: "12", meta: "documents disponibles" },
  { id: "valid", icon: <CheckCircleIcon />, tone: "green", label: "À jour", value: "8", meta: "documents à jour" },
  { id: "pending", icon: <HourglassIcon />, tone: "amber", label: "En attente", value: "2", meta: "documents à fournir" },
  { id: "expiring", icon: <ClockIcon />, tone: "green", label: "Expirant bientôt", value: "2", meta: "documents à renouveler" },
];

const DOCUMENTS = [
  { id: 1, title: "Contrat de formation", category: "Administratif", type: "PDF", added: "28/05/2024", status: "À jour", tone: "green", icon: "file", iconTone: "green", downloadable: true },
  { id: 2, title: "Pièce d'identité", category: "Administratif", type: "JPG", added: "20/05/2024", status: "À jour", tone: "green", icon: "identity", iconTone: "amber", downloadable: true },
  { id: 3, title: "Visite médicale", category: "Médical", type: "PDF", added: "15/05/2024", status: "Expirant bientôt", tone: "amber", icon: "medical", iconTone: "purple", downloadable: true, warning: true },
  { id: 4, title: "Livret d'apprentissage", category: "Pédagogique", type: "PDF", added: "10/05/2024", status: "À jour", tone: "green", icon: "book", iconTone: "green", downloadable: true },
  { id: 5, title: "Attestation de participation (code)", category: "Examen", type: "PDF", added: "05/05/2024", status: "En attente", tone: "amber", icon: "exam", iconTone: "rose", downloadable: true },
  { id: 6, title: "Attestation de fin de formation", category: "Pédagogique", type: "PDF", added: "—", status: "Non disponible", tone: "neutral", icon: "graduation", iconTone: "purple", downloadable: false },
  { id: 7, title: "Justificatif de domicile", category: "Administratif", type: "PDF", added: "—", status: "En attente", tone: "amber", icon: "file", iconTone: "amber", downloadable: false },
  { id: 8, title: "Certificat médical", category: "Médical", type: "PDF", added: "02/05/2024", status: "À jour", tone: "green", icon: "medical", iconTone: "green", downloadable: true },
  { id: 9, title: "Convocation examen pratique", category: "Examen", type: "PDF", added: "30/05/2024", status: "À jour", tone: "green", icon: "exam", iconTone: "green", downloadable: true },
];

const TABS = [
  { label: "Tous", category: null },
  { label: "Administratifs", category: "Administratif" },
  { label: "Pédagogiques", category: "Pédagogique" },
  { label: "Médicaux", category: "Médical" },
  { label: "Examens", category: "Examen" },
];

const REQUIRED_DOCUMENTS = [
  { id: 1, title: "Pièce d'identité", detail: "Document valide", state: "valid" },
  { id: 2, title: "Photo d'identité", detail: "Document valide", state: "valid" },
  { id: 3, title: "Justificatif de domicile", detail: "En attente de réception", state: "pending" },
  { id: 4, title: "ASSR 2 / ASR", detail: "Document valide", state: "valid" },
];

const DOCUMENT_ICONS = {
  file: <FileTextIcon />,
  identity: <IdCardIcon />,
  medical: <MedicalIcon />,
  book: <BookIcon />,
  exam: <ExamDocumentIcon />,
  graduation: <GraduationIcon />,
};

const ACCEPTED_FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const ACCEPTED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function parseDate(value) {
  if (value === "—") return null;
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SummaryCard({ card }) {
  return (
    <article className="nsdoc-summary-card">
      <span className={`nsdoc-summary-icon nsdoc-tone-${card.tone}`}>{card.icon}</span>
      <div className="nsdoc-summary-copy"><span>{card.label}</span><strong>{card.value}</strong><small>{card.meta}</small></div>
    </article>
  );
}

function DocumentRow({ document }) {
  return (
    <article className="nsdoc-document-row">
      <div className="nsdoc-document-main">
        <div className="nsdoc-document-identity">
          <span className={`nsdoc-document-icon nsdoc-tone-${document.iconTone}`}>{DOCUMENT_ICONS[document.icon]}</span>
          <div><strong>{document.title}</strong><span>{document.category}<i aria-hidden="true">•</i>{document.type}</span></div>
        </div>
        <div className="nsdoc-added-date"><span>Ajouté le</span><strong>{document.added}</strong></div>
        <span className={`nsdoc-status nsdoc-status--${document.tone}`}>{document.status}</span>
        {document.downloadable ? <button type="button" className="nsdoc-icon-action nsdoc-download" title="Télécharger" aria-label={`Télécharger ${document.title}`}><DownloadIcon /></button> : <span className="nsdoc-action-placeholder" />}
        <button type="button" className="nsdoc-icon-action nsdoc-more" title="Plus d'options" aria-label={`Plus d'options pour ${document.title}`}><MoreIcon /></button>
      </div>
      {document.warning && (
        <div className="nsdoc-expiry-warning"><span><WarningIcon /></span><p><strong>Expire le 15/06/2024</strong><i aria-hidden="true">•</i>Pensez à renouveler votre visite médicale.</p><button type="button">En savoir plus</button></div>
      )}
    </article>
  );
}

export default function CandidateDocumentsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("recent");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const visibleDocuments = useMemo(() => {
    const selectedCategory = TABS.find((tab) => tab.label === activeTab)?.category;
    const filtered = selectedCategory ? DOCUMENTS.filter((document) => document.category === selectedCategory) : DOCUMENTS;

    return [...filtered].sort((first, second) => {
      if (sortOrder === "name") return first.title.localeCompare(second.title, "fr");
      const firstDate = parseDate(first.added);
      const secondDate = parseDate(second.added);
      if (firstDate === null) return 1;
      if (secondDate === null) return -1;
      return sortOrder === "oldest" ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [activeTab, sortOrder]);

  const handleSidebarNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;

    let nextError = "";
    const validFiles = [];

    files.forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (file.size > MAX_FILE_SIZE) {
        nextError ||= "Le fichier dépasse la limite de 10 Mo.";
        return;
      }
      if (!ACCEPTED_FILE_TYPES.has(file.type) && !ACCEPTED_EXTENSIONS.has(extension)) {
        nextError ||= "Format non pris en charge.";
        return;
      }

      validFiles.push({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: extension.toUpperCase(),
      });
    });

    if (validFiles.length) setUploadedFiles((current) => [...current, ...validFiles]);
    setUploadError(nextError);
  };

  const handleFileChange = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div className="nsd-root nsdoc-root">
      <StudentSidebar activePath="/student-documents" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleSidebarNavigate} />

      <main className="nsd-main nsdoc-main">
        <StudentHeader className="nsdoc-header" headingClassName="nsdoc-page-heading" titleNode={<div className="nsdoc-title-row"><span className="nsdoc-title-icon"><FileTextIcon /></span><h1 className="nsd-greeting-title">Mes documents</h1></div>} subtitle="Retrouvez ici tous vos documents importants." onMenuOpen={() => setSidebarOpen(true)} />

        <section className="nsdoc-summary-grid" aria-label="Résumé des documents">
          {SUMMARY_CARDS.map((card) => <SummaryCard key={card.id} card={card} />)}
        </section>

        <div className="nsdoc-content-grid">
          <section className="nsdoc-panel nsdoc-list-card">
            <div className="nsdoc-list-toolbar">
              <div className="nsdoc-tabs" role="tablist" aria-label="Filtrer les documents">
                {TABS.map((tab) => <button key={tab.label} type="button" role="tab" aria-selected={activeTab === tab.label} className={activeTab === tab.label ? "active" : ""} onClick={() => setActiveTab(tab.label)}>{tab.label}</button>)}
              </div>
              <label className="nsdoc-sort"><span>Trier par</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Trier les documents"><option value="recent">Plus récent</option><option value="oldest">Plus ancien</option><option value="name">Nom A-Z</option></select><ChevronDownIcon /></label>
            </div>

            <div className="nsdoc-document-list" role="tabpanel" aria-label={`Documents ${activeTab.toLowerCase()}`}>
              {visibleDocuments.map((document) => <DocumentRow key={document.id} document={document} />)}
            </div>
          </section>

          <aside className="nsdoc-right-column">
            <section className="nsdoc-panel nsdoc-upload-card">
              <h2>Ajouter un document</h2>
              <div className={`nsdoc-upload-zone${isDragging ? " is-dragging" : ""}`} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple onChange={handleFileChange} aria-label="Choisir des documents à importer" />
                <button type="button" onClick={() => fileInputRef.current?.click()}><span className="nsdoc-upload-icon"><UploadCloudIcon /></span><strong>Glissez-déposez votre fichier ici</strong><span>ou cliquez pour parcourir</span><small>PDF, JPG, PNG (max. 10 Mo)</small></button>
              </div>
              {uploadError && <p className="nsdoc-upload-error" role="alert">{uploadError}</p>}
              {uploadedFiles.length > 0 && (
                <div className="nsdoc-uploaded-list" aria-label="Documents importés">
                  {uploadedFiles.map((file) => <article key={file.id} className="nsdoc-uploaded-file"><span className="nsdoc-uploaded-icon"><FileTextIcon /></span><div><strong>{file.name}</strong><span>{file.type} <i aria-hidden="true">•</i> {file.size}</span></div><span className="nsdoc-uploaded-status">Importé</span><button type="button" title="Supprimer" aria-label={`Supprimer ${file.name}`} onClick={() => setUploadedFiles((current) => current.filter((item) => item.id !== file.id))}><TrashIcon /></button></article>)}
                </div>
              )}
            </section>

            <section className="nsdoc-panel nsdoc-required-card">
              <h2>Documents requis</h2>
              <p>Voici les documents demandés pour votre formation.</p>
              <div className="nsdoc-required-list">
                {REQUIRED_DOCUMENTS.map((document) => <button key={document.id} type="button" className="nsdoc-required-row"><span className={`nsdoc-required-state nsdoc-required-state--${document.state}`}>{document.state === "valid" ? <CheckCircleIcon /> : <HourglassIcon />}</span><span><strong>{document.title}</strong><small>{document.detail}</small></span><ChevronRightIcon /></button>)}
              </div>
            </section>

            <section className="nsdoc-help-card">
              <span className="nsdoc-help-icon"><HeadsetIcon /></span>
              <div><strong>Une question sur vos documents ?</strong><p>Contactez votre auto-école, nous sommes là pour vous aider.</p><button type="button">Nous contacter <span aria-hidden="true">→</span></button></div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
