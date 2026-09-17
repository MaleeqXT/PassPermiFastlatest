import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar.jsx";
import StudentHeader from "./StudentHeader.jsx";
import "./CandidateDashboard.css";
import "./CandidateExamPage.css";

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" /></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3.5h6V7H9zM9 11h6M9 15h6M9 19h4" /></svg>
);
const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 16 6-6 4 4 6-7" /><path d="M15 7h5v5" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const IdCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5.5 16c.7-1.6 1.5-2.3 2.5-2.3s1.8.7 2.5 2.3M13 10h5M13 14h4" /></svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3v-4l2-2 2-4h10l2 4 2 2v4h-2M5 17h14M7 17v2M17 17v2M6 11h12" /><circle cx="7" cy="15" r="1" /><circle cx="17" cy="15" r="1" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 5 11 7-11 7z" /></svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3zM21 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z" /></svg>
);
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.7 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 21h8M9 17h6M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" /></svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);
const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);

const SUMMARY_CARDS = [
  { id: "practical", icon: <CalendarIcon />, tone: "green", label: "Examen pratique prévu", value: "14 juin 2024", meta: "Dans 18 jours" },
  { id: "mock", icon: <CheckCircleIcon />, tone: "success", label: "Examens blancs réalisés", value: "3 / 5", meta: "Continuez à vous entraîner !" },
  { id: "rate", icon: <StarIcon />, tone: "amber", label: "Taux de réussite estimé", value: "72%", meta: "En progression", trend: true },
  { id: "attempts", icon: <ClipboardIcon />, tone: "purple", label: "Tentatives d'examen", value: "0", meta: "Pas encore présenté" },
];

const TIMELINE_STEPS = [
  { id: "registration", label: "Inscription", detail: "Validée", state: "complete" },
  { id: "file", label: "Dossier validé", detail: "Le 15/05/2024", state: "complete" },
  { id: "exam", label: "Examen prévu", detail: "14/06/2024", state: "current" },
  { id: "result", label: "Résultat", detail: "À venir", state: "future" },
];

const IMPORTANT_INFO = [
  { id: "identity", icon: <IdCardIcon />, title: "Pièce d'identité obligatoire", description: "Pensez à vous munir de votre pièce d'identité originale le jour de l'examen." },
  { id: "vehicle", icon: <CarIcon />, title: "Véhicule", description: "Le véhicule d'examen sera celui de l'auto-école." },
  { id: "arrival", icon: <ClockIcon />, title: "Arrivez 15 min avant", description: "Présentez-vous au moins 15 minutes avant l'heure de votre examen." },
];

const MOCK_EXAMS = [
  { id: 3, score: 72, date: "Le 28/05/2024", status: "Réussi", tone: "green" },
  { id: 2, score: 58, date: "Le 14/05/2024", status: "À améliorer", tone: "amber" },
  { id: 1, score: 68, date: "Le 30/04/2024", status: "Réussi", tone: "green" },
];

const PREPARATION_ITEMS = [
  { id: "simulator", icon: <PlayIcon />, tone: "purple", title: "Simulateur d'examen", description: "Entraînez-vous avec des examens blancs." },
  { id: "guides", icon: <BookIcon />, tone: "green", title: "Fiches conseils", description: "Nos conseils pour réussir le jour J." },
  { id: "mistakes", icon: <WarningIcon />, tone: "amber", title: "Erreurs fréquentes", description: "Découvrez les erreurs à éviter." },
];

function SummaryCard({ card }) {
  return (
    <article className="nse-summary-card">
      <span className={`nse-summary-icon nse-tone-${card.tone}`}>{card.icon}</span>
      <div className="nse-summary-copy">
        <span>{card.label}</span>
        <strong>{card.value}</strong>
        <small className={card.id === "practical" ? "nse-summary-meta-accent" : ""}>{card.meta}{card.trend && <TrendUpIcon />}</small>
      </div>
    </article>
  );
}

function ScoreRing({ score, tone }) {
  return <span className={`nse-score-ring nse-score-ring--${tone}`} style={{ "--nse-score-angle": `${score * 3.6}deg` }} aria-label={`${score} %`}><strong>{score}%</strong></span>;
}

export default function CandidateExamPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="nsd-root nse-root">
      <StudentSidebar activePath="/student-exams" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleSidebarNavigate} />

      <main className="nsd-main nse-main">
        <StudentHeader className="nse-header" headingClassName="nse-page-heading" titleNode={<div className="nse-title-row"><span className="nse-title-icon"><ClipboardIcon /></span><h1 className="nsd-greeting-title">Mes examens</h1></div>} subtitle="Suivez vos examens, simulez et préparez-vous sereinement." onMenuOpen={() => setSidebarOpen(true)} />

        <section className="nse-summary-grid" aria-label="Résumé des examens">
          {SUMMARY_CARDS.map((card) => <SummaryCard key={card.id} card={card} />)}
        </section>

        <div className="nse-content-grid">
          <section className="nse-panel nse-practical-card">
            <h2>Mon examen pratique</h2>

            <ol className="nse-timeline" aria-label="Avancement de l'examen pratique">
              {TIMELINE_STEPS.map((step, index) => (
                <li key={step.id} className={`nse-timeline-step nse-timeline-step--${step.state}`}>
                  <span className="nse-timeline-marker">{step.state === "complete" ? <CheckIcon /> : step.state === "current" ? <CalendarIcon /> : index + 1}</span>
                  <strong>{step.label}</strong>
                  <small>{step.detail}</small>
                </li>
              ))}
            </ol>

            <div className="nse-exam-strip">
              <div className="nse-exam-strip-block"><span className="nse-strip-icon"><CalendarIcon /></span><p>Votre examen pratique est prévu le :<strong>Vendredi 14 juin 2024 à 09h30</strong></p></div>
              <div className="nse-exam-strip-block"><span className="nse-strip-icon"><MapPinIcon /></span><p><strong>Centre d'examen de Creil</strong><small>60100 Creil</small></p></div>
              <button type="button" className="nse-button nse-button--outline">Voir le détail</button>
            </div>

            <div className="nse-important">
              <h3>Informations importantes</h3>
              <div className="nse-important-list">
                {IMPORTANT_INFO.map((item) => <article key={item.id} className="nse-info-row"><span className="nse-info-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></article>)}
              </div>
            </div>

            <div className="nse-practical-actions">
              <button type="button" className="nse-button nse-button--outline">Voir le détail de l'examen</button>
              <button type="button" className="nse-button nse-button--solid">Modifier ou reporter</button>
            </div>
          </section>

          <aside className="nse-right-column">
            <section className="nse-panel nse-mock-card">
              <div className="nse-panel-heading"><h2>Mes examens blancs</h2><button type="button">Voir tout</button></div>
              <div className="nse-mock-list">
                {MOCK_EXAMS.map((exam) => (
                  <article key={exam.id} className="nse-mock-row">
                    <ScoreRing score={exam.score} tone={exam.tone} />
                    <div className="nse-mock-copy"><strong>Examen blanc #{exam.id}</strong><span>{exam.date}</span></div>
                    <span className={`nse-status-pill nse-status-pill--${exam.tone}`}>{exam.status}</span>
                    <button type="button" className="nse-row-action" aria-label={`Voir l'examen blanc ${exam.id}`}><ChevronRightIcon /></button>
                  </article>
                ))}
              </div>
              <button type="button" className="nse-reserve-button"><CalendarIcon />Réserver un examen blanc</button>
            </section>

            <section className="nse-panel nse-preparation-card">
              <h2>Se préparer à l'examen</h2>
              <div className="nse-preparation-list">
                {PREPARATION_ITEMS.map((item) => (
                  <button key={item.id} type="button" className="nse-preparation-row">
                    <span className={`nse-preparation-icon nse-tone-${item.tone}`}>{item.icon}</span>
                    <span className="nse-preparation-copy"><strong>{item.title}</strong><small>{item.description}</small></span>
                    <ChevronRightIcon />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="nse-advice-banner"><span><TrophyIcon /></span><div><strong>Conseil Permis Plus</strong><p>La régularité et la pratique sont vos meilleures alliées. Continuez vos cours et vos entraînements ! 💪</p></div></section>
      </main>
    </div>
  );
}
