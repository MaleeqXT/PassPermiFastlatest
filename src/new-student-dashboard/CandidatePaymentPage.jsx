import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar.jsx";
import StudentHeader from "./StudentHeader.jsx";
import "./CandidateDashboard.css";
import "./CandidatePaymentPage.css";

function StrokeIcon({ children, strokeWidth = 2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const BellIcon = () => <StrokeIcon><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></StrokeIcon>;
const ChevronDownIcon = () => <StrokeIcon><path d="m6 9 6 6 6-6" /></StrokeIcon>;
const ChevronRightIcon = () => <StrokeIcon><path d="m9 18 6-6-6-6" /></StrokeIcon>;
const HamburgerIcon = () => <StrokeIcon><path d="M4 6h16M4 12h16M4 18h16" /></StrokeIcon>;
const CalendarIcon = () => <StrokeIcon><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></StrokeIcon>;
const CarIcon = () => <StrokeIcon><path d="M5 17H3v-4l2-2 2-4h10l2 4 2 2v4h-2M5 17h14M7 17v2M17 17v2M6 11h12" /><circle cx="7" cy="15" r="1" /><circle cx="17" cy="15" r="1" /></StrokeIcon>;
const CardIcon = () => <StrokeIcon><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h3" /></StrokeIcon>;
const DocumentIcon = () => <StrokeIcon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></StrokeIcon>;
const DownloadIcon = () => <StrokeIcon><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 19v2h14v-2" /></StrokeIcon>;
const BankIcon = () => <StrokeIcon><path d="m3 9 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20" /></StrokeIcon>;
const CashIcon = () => <StrokeIcon><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9H5v1M18 15h1v-1" /></StrokeIcon>;
const InfoIcon = () => <StrokeIcon><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></StrokeIcon>;
const CloseIcon = () => <StrokeIcon><path d="m6 6 12 12M18 6 6 18" /></StrokeIcon>;
const MoreIcon = () => <StrokeIcon><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></StrokeIcon>;
const PlusIcon = () => <StrokeIcon><path d="M12 5v14M5 12h14" /></StrokeIcon>;

const UPCOMING_INSTALLMENTS = [
  { id: "june", date: "15 juin 2025", title: "2ᵉ échéance", subtitle: "Forfait Permis B", amount: "250,00 €" },
  { id: "july", date: "15 juillet 2025", title: "3ᵉ échéance", subtitle: "Forfait Permis B", amount: "240,00 €" },
];

const PAYMENT_HISTORY = [
  { id: "payment-1", date: "15 mai 2025", title: "1re échéance", subtitle: "Forfait Permis B", amount: "350,00 €" },
  { id: "payment-2", date: "15 avril 2025", title: "Acompte à l'inscription", subtitle: "Forfait Permis B", amount: "250,00 €" },
  { id: "payment-3", date: "18 mars 2025", title: "Frais de dossier", amount: "100,00 €" },
  { id: "payment-4", date: "10 mars 2025", title: "Évaluation initiale", amount: "38,00 €" },
];

const INVOICES = [
  { id: "2025-0458", number: "Facture n°2025-0458", date: "15 mai 2025", amount: "350,00 €" },
  { id: "2025-0321", number: "Facture n°2025-0321", date: "15 avril 2025", amount: "250,00 €" },
  { id: "2025-0156", number: "Facture n°2025-0156", date: "18 mars 2025", amount: "100,00 €" },
  { id: "2025-0087", number: "Facture n°2025-0087", date: "10 mars 2025", amount: "38,00 €" },
];

const INITIAL_PAYMENT_METHODS = [
  { id: "card-4242", type: "card", title: "Carte bancaire", lines: ["**** **** **** 4242", "Expire le 12/27"], isDefault: true },
  { id: "bank-1234", type: "bank", title: "Virement bancaire", lines: ["IBAN enregistré", "FR76 **** **** **** 1234"] },
  { id: "cash", type: "cash", title: "Espèces", lines: ["À régler à l'agence"] },
  { id: "alma", type: "alma", title: "Paiement en 3x", lines: ["Financement Alma"], link: "En savoir plus" },
];

const EMPTY_METHOD_DRAFT = { type: "card", displayName: "Carte bancaire", lastFour: "", expiry: "" };

function PaymentMethodIcon({ type }) {
  if (type === "bank") return <BankIcon />;
  if (type === "cash") return <CashIcon />;
  if (type === "alma") return <span className="nspay-alma-mark">alma</span>;
  return <CardIcon />;
}

function SectionHeading({ icon, title, actionLabel }) {
  return (
    <header className="nspay-section-heading">
      <div>{icon && <span className="nspay-section-icon">{icon}</span>}<h2>{title}</h2></div>
      {actionLabel && <button type="button">{actionLabel}</button>}
    </header>
  );
}

function ModalShell({ title, description, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <div className="nspay-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modalRef} className="nspay-modal" role="dialog" aria-modal="true" aria-labelledby="nspay-modal-title" tabIndex="-1">
        <header className="nspay-modal-header">
          <div><h2 id="nspay-modal-title">{title}</h2>{description && <p>{description}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Fermer la fenêtre"><CloseIcon /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default function CandidatePaymentPage() {
  const navigate = useNavigate();
  const invoiceTrackRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENT_METHODS);
  const [methodDraft, setMethodDraft] = useState(EMPTY_METHOD_DRAFT);
  const [methodError, setMethodError] = useState("");
  const [openMethodMenu, setOpenMethodMenu] = useState(null);
  const [methodToDelete, setMethodToDelete] = useState(null);

  useEffect(() => {
    if (!activeModal) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => event.key === "Escape" && setActiveModal(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const handleSidebarNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const openAddMethodModal = () => {
    setMethodDraft(EMPTY_METHOD_DRAFT);
    setMethodError("");
    setOpenMethodMenu(null);
    setActiveModal("add-method");
  };

  const savePaymentMethod = (event) => {
    event.preventDefault();
    const safeName = methodDraft.displayName.trim();
    if (!safeName) {
      setMethodError("Ajoutez un nom d’affichage.");
      return;
    }
    if (methodDraft.type === "card" && !/^\d{4}$/.test(methodDraft.lastFour)) {
      setMethodError("Saisissez uniquement les 4 derniers chiffres de la carte.");
      return;
    }

    const newMethod = {
      id: `local-${crypto.randomUUID()}`,
      type: methodDraft.type,
      title: safeName,
      lines: methodDraft.type === "card"
        ? [`**** **** **** ${methodDraft.lastFour}`, methodDraft.expiry ? `Expire le ${methodDraft.expiry}` : "Expiration non renseignée"]
        : ["Moyen ajouté localement"],
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((current) => [...current, newMethod]);
    setActiveModal(null);
  };

  const setDefaultMethod = (methodId) => {
    setPaymentMethods((current) => current.map((method) => ({ ...method, isDefault: method.id === methodId })));
    setOpenMethodMenu(null);
  };

  const requestMethodRemoval = (method) => {
    setOpenMethodMenu(null);
    setMethodToDelete(method);
    setActiveModal("delete-method");
  };

  const removePaymentMethod = () => {
    setPaymentMethods((current) => {
      const remaining = current.filter((method) => method.id !== methodToDelete?.id);
      if (remaining.length && !remaining.some((method) => method.isDefault)) remaining[0] = { ...remaining[0], isDefault: true };
      return remaining;
    });
    setMethodToDelete(null);
    setActiveModal(null);
  };

  return (
    <div className="nsd-root nspay-root" onClick={() => openMethodMenu && setOpenMethodMenu(null)}>
      <StudentSidebar activePath="/student-payments" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleSidebarNavigate} />

      <main className="nsd-main nspay-main">
        <StudentHeader className="nspay-header" title="Paiements" subtitle="Suivez vos paiements et gérez le financement de votre formation." onMenuOpen={() => setSidebarOpen(true)} />

        <section className="nspay-card nspay-training-card">
          <SectionHeading title="Ma formation en cours" />
          <div className="nspay-training-content">
            <div className="nspay-course-summary">
              <span className="nspay-course-icon"><CarIcon /></span>
              <div><h3>Permis B <small>(Boîte manuelle)</small></h3><p>Agence Creil</p><span>Inscription le 15 avril 2025</span></div>
            </div>
            <div className="nspay-financial-summary">
              <div><span>Prix total</span><strong>1 090,00 €</strong></div>
              <div className="is-paid"><span>Déjà payé</span><strong>600,00 €</strong></div>
              <div className="is-remaining"><span>Reste à payer</span><strong>490,00 €</strong></div>
            </div>
            <button type="button" className="nspay-primary-action" onClick={() => setActiveModal("payment-info")}><CardIcon />Payer maintenant</button>
          </div>
        </section>

        <section className="nspay-card">
          <SectionHeading icon={<CalendarIcon />} title="Prochaines échéances" actionLabel="Voir tout" />
          <div className="nspay-table-wrap">
            <table className="nspay-table nspay-upcoming-table">
              <thead><tr><th>Date</th><th>Description</th><th>Montant</th><th>Statut</th><th><span className="sr-only">Action</span></th></tr></thead>
              <tbody>{UPCOMING_INSTALLMENTS.map((item) => <tr key={item.id}><td><span className="nspay-date-cell"><CalendarIcon />{item.date}</span></td><td><strong>{item.title}</strong><small>{item.subtitle}</small></td><td>{item.amount}</td><td><span className="nspay-status nspay-status--upcoming">À venir</span></td><td><button type="button" className="nspay-row-action" aria-label={`Voir ${item.title}`}><ChevronRightIcon /></button></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="nspay-card">
          <SectionHeading title="Historique des paiements" actionLabel="Voir tout" />
          <div className="nspay-table-wrap">
            <table className="nspay-table nspay-history-table">
              <thead><tr><th>Date</th><th>Description</th><th>Montant</th><th>Moyen de paiement</th><th>Statut</th><th>Reçu</th></tr></thead>
              <tbody>{PAYMENT_HISTORY.map((item) => <tr key={item.id}><td>{item.date}</td><td><strong>{item.title}</strong>{item.subtitle && <small>{item.subtitle}</small>}</td><td>{item.amount}</td><td><span className="nspay-method-cell"><CardIcon /><span>Carte bancaire<small>**** 4242</small></span></span></td><td><span className="nspay-status nspay-status--paid">Payé</span></td><td><button type="button" className="nspay-download-button" aria-label={`Télécharger le reçu de ${item.title}`} title="Aucun reçu réel n’est associé à cette maquette"><DownloadIcon /></button></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="nspay-card nspay-invoices-card">
          <SectionHeading title="Mes factures / reçus" actionLabel="Voir toutes" />
          <div className="nspay-invoice-shell">
            <div ref={invoiceTrackRef} className="nspay-invoice-track">
              {INVOICES.map((invoice) => <article key={invoice.id} className="nspay-invoice"><div className="nspay-invoice-top"><span><DocumentIcon /></span><em>Payé</em></div><h3>{invoice.number}</h3><p>{invoice.date}</p><strong>{invoice.amount}</strong><button type="button" title="Aucune facture réelle n’est associée à cette maquette"><DownloadIcon />Télécharger</button></article>)}
            </div>
            <button type="button" className="nspay-invoice-next" aria-label="Afficher les factures suivantes" onClick={() => invoiceTrackRef.current?.scrollBy({ left: 240, behavior: "smooth" })}><ChevronRightIcon /></button>
          </div>
        </section>

        <section className="nspay-card nspay-methods-card">
          <header className="nspay-section-heading nspay-methods-heading"><div><h2>Moyens de paiement enregistrés</h2></div><button type="button" className="nspay-add-method" onClick={openAddMethodModal}><PlusIcon />Ajouter un moyen de paiement</button></header>
          <div className="nspay-method-grid">
            {paymentMethods.map((method) => (
              <article key={method.id} className="nspay-method-card">
                <div className={`nspay-method-icon nspay-method-icon--${method.type}`}><PaymentMethodIcon type={method.type} /></div>
                <div className="nspay-method-menu-wrap" onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="nspay-more-button" aria-label={`Actions pour ${method.title}`} aria-expanded={openMethodMenu === method.id} onClick={() => setOpenMethodMenu((current) => current === method.id ? null : method.id)}><MoreIcon /></button>
                  {openMethodMenu === method.id && <div className="nspay-method-menu"><button type="button" onClick={() => setDefaultMethod(method.id)} disabled={method.isDefault}>Définir par défaut</button><button type="button" className="danger" onClick={() => requestMethodRemoval(method)}>Supprimer</button></div>}
                </div>
                <h3>{method.title}</h3>
                {method.lines.map((line) => <p key={line}>{line}</p>)}
                {method.isDefault && <span className="nspay-default-badge">Par défaut</span>}
                {method.link && <button type="button" className="nspay-method-link">{method.link}</button>}
              </article>
            ))}
          </div>
        </section>

        <section className="nspay-contact-strip"><span><InfoIcon /></span><p><strong>Une question ?</strong> Contactez votre équipe pédagogique, nous sommes là pour vous accompagner.</p><button type="button">Nous contacter</button></section>
      </main>

      {activeModal === "payment-info" && <ModalShell title="Payer maintenant" description="Le paiement en ligne n’est pas connecté à cette interface de démonstration." onClose={() => setActiveModal(null)}><div className="nspay-payment-notice"><span><CardIcon /></span><div><small>Reste à payer</small><strong>490,00 €</strong><p>Aucune opération bancaire ne sera effectuée depuis cette maquette.</p></div></div><footer className="nspay-modal-actions"><button type="button" className="primary" onClick={() => setActiveModal(null)}>Compris</button></footer></ModalShell>}

      {activeModal === "add-method" && <ModalShell title="Ajouter un moyen de paiement" description="Ajoutez uniquement des informations d’affichage. Aucune donnée bancaire réelle n’est transmise." onClose={() => setActiveModal(null)}><form className="nspay-modal-form" onSubmit={savePaymentMethod}><div className="nspay-form-grid"><label><span>Type de moyen</span><select value={methodDraft.type} onChange={(event) => setMethodDraft((current) => ({ ...current, type: event.target.value }))}><option value="card">Carte bancaire</option><option value="bank">Virement bancaire</option><option value="cash">Espèces</option></select></label><label><span>Nom affiché</span><input type="text" value={methodDraft.displayName} onChange={(event) => setMethodDraft((current) => ({ ...current, displayName: event.target.value }))} required /></label>{methodDraft.type === "card" && <><label><span>4 derniers chiffres uniquement</span><input type="text" inputMode="numeric" autoComplete="off" maxLength="4" value={methodDraft.lastFour} onChange={(event) => setMethodDraft((current) => ({ ...current, lastFour: event.target.value.replace(/\D/g, "") }))} placeholder="4242" required /></label><label><span>Expiration (MM/AA)</span><input type="text" autoComplete="off" maxLength="5" value={methodDraft.expiry} onChange={(event) => setMethodDraft((current) => ({ ...current, expiry: event.target.value }))} placeholder="12/27" /></label></>}</div>{methodError && <p className="nspay-form-error" role="alert">{methodError}</p>}<footer className="nspay-modal-actions"><button type="button" onClick={() => setActiveModal(null)}>Annuler</button><button type="submit" className="primary">Enregistrer</button></footer></form></ModalShell>}

      {activeModal === "delete-method" && <ModalShell title="Supprimer ce moyen ?" description={methodToDelete?.title} onClose={() => setActiveModal(null)}><div className="nspay-delete-confirm"><p>Ce changement reste local à cette interface. Vous pourrez ajouter de nouveau ce moyen plus tard.</p></div><footer className="nspay-modal-actions"><button type="button" onClick={() => setActiveModal(null)}>Annuler</button><button type="button" className="danger" onClick={removePaymentMethod}>Supprimer</button></footer></ModalShell>}
    </div>
  );
}
