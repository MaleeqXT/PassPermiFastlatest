import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import sophiePhoto from "../mainsecretary/assets/portrait-beautiful.jpg";
import StudentHeader from "./StudentHeader.jsx";
import StudentSidebar from "./StudentSidebar.jsx";
import "./CandidateDashboard.css";
import "./CandidateChatPage.css";

function StrokeIcon({ children, strokeWidth = 2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const ChevronDownIcon = () => <StrokeIcon><path d="m6 9 6 6 6-6" /></StrokeIcon>;
const ChevronRightIcon = () => <StrokeIcon><path d="m9 18 6-6-6-6" /></StrokeIcon>;
const ChevronLeftIcon = () => <StrokeIcon><path d="m15 18-6-6 6-6" /></StrokeIcon>;
const ChatIcon = () => <StrokeIcon><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></StrokeIcon>;
const SearchIcon = () => <StrokeIcon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></StrokeIcon>;
const PencilIcon = () => <StrokeIcon><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></StrokeIcon>;
const MoreIcon = () => <StrokeIcon><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></StrokeIcon>;
const PaperclipIcon = () => <StrokeIcon><path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 0 1-2.8-2.8l8.9-8.9" /></StrokeIcon>;
const SendIcon = () => <StrokeIcon><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></StrokeIcon>;
const MailIcon = () => <StrokeIcon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></StrokeIcon>;
const PhoneIcon = () => <StrokeIcon><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" /></StrokeIcon>;
const CalendarIcon = () => <StrokeIcon><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></StrokeIcon>;
const DocumentIcon = () => <StrokeIcon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></StrokeIcon>;
const ProgressIcon = () => <StrokeIcon><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16v-3M12 16V8M17 16v-5" /></StrokeIcon>;
const ClockIcon = () => <StrokeIcon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></StrokeIcon>;
const GroupIcon = () => <StrokeIcon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></StrokeIcon>;
const CheckReadIcon = () => <StrokeIcon strokeWidth={2.1}><path d="m2 12 4 4L14 8" /><path d="m10 15 2 2 8-9" /></StrokeIcon>;

const INITIAL_CONVERSATIONS = [
  { id: "yacine-reminder", name: "Yacine B.", initials: "YB", role: "Moniteur", preview: "Bonjour Linda, n'oublie pas ton cours de conduite demain à 14h.", time: "10:30", unreadCount: 1, online: true, avatarTone: "green" },
  { id: "permis-exam", name: "Permis Plus", initials: "P", role: "Auto-école", preview: "Votre examen pratique est confirmé le 14 juin à 09h30 à Creil.", time: "Hier", unreadCount: 1, online: true, avatarTone: "brand" },
  { id: "karim", name: "Karim A.", initials: "KA", role: "Moniteur", preview: "Merci pour ton sérieux aujourd'hui, continue comme ça !", time: "Hier", online: true, avatarTone: "dark" },
  { id: "sophie", name: "Sophie D.", initials: "SD", role: "Assistante", preview: "Voici ton attestation de fin de formation.", time: "Lun.", online: true, image: sophiePhoto },
  { id: "group-code", name: "Groupe – Code de la route", initials: "GR", role: "", preview: "Sophie D. a partagé un document", time: "Dim.", group: true, avatarTone: "purple" },
  { id: "yacine-slots", name: "Yacine B.", initials: "YB", role: "Moniteur", preview: "Peux-tu me montrer tes disponibilités pour la semaine prochaine ?", time: "Sam.", online: true, avatarTone: "green" },
  { id: "permis-closure", name: "Permis Plus", initials: "P", role: "Auto-école", preview: "Nous serons fermés le 1er mai. Bon week-end !", time: "26/04", avatarTone: "brand" },
];

const INITIAL_MESSAGES = {
  "yacine-reminder": [
    { id: "m1", direction: "incoming", lines: ["Bonjour Linda !", "N'oublie pas ton cours de conduite demain à 14h.", "On travaillera les créneaux et les ronds-points."], time: "10:30" },
    { id: "m2", direction: "outgoing", lines: ["Bonjour Yacine,", "Merci pour le rappel !", "Tout est noté, à demain 😊"], time: "10:32", read: true },
    { id: "m3", direction: "incoming", lines: ["Parfait ! Pense à venir 10 minutes en avance 😉"], time: "10:33" },
    { id: "m4", direction: "outgoing", lines: ["Pas de souci, je serai là.", "À demain !"], time: "10:33", read: true },
  ],
  "permis-exam": [{ id: "m5", direction: "incoming", lines: ["Bonjour Linda,", "Votre examen pratique est confirmé le 14 juin à 09h30 à Creil."], time: "Hier" }],
  karim: [{ id: "m6", direction: "incoming", lines: ["Merci pour ton sérieux aujourd'hui, continue comme ça !"], time: "Hier" }],
  sophie: [{ id: "m7", direction: "incoming", lines: ["Voici ton attestation de fin de formation."], time: "Lun." }],
  "group-code": [{ id: "m8", direction: "incoming", lines: ["Sophie D. a partagé un document avec le groupe."], time: "Dim." }],
  "yacine-slots": [{ id: "m9", direction: "incoming", lines: ["Peux-tu me montrer tes disponibilités pour la semaine prochaine ?"], time: "Sam." }],
  "permis-closure": [{ id: "m10", direction: "incoming", lines: ["Nous serons fermés le 1er mai.", "Bon week-end !"], time: "26/04" }],
};

const SHORTCUTS = [
  { label: "Mes cours", path: "/student-courses", icon: <CalendarIcon /> },
  { label: "Mon planning", path: "/student-courses", icon: <CalendarIcon /> },
  { label: "Mes documents", path: "/student-documents", icon: <DocumentIcon /> },
  { label: "Ma progression", path: "/student-progress", icon: <ProgressIcon /> },
];

function Avatar({ conversation, size = "medium" }) {
  if (conversation.image) {
    return <span className={`nschat-avatar nschat-avatar--${size}`}><img src={conversation.image} alt="" />{conversation.online && <i />}</span>;
  }
  return (
    <span className={`nschat-avatar nschat-avatar--${size} nschat-avatar--${conversation.avatarTone || "green"}`}>
      {conversation.group ? <GroupIcon /> : conversation.initials}
      {conversation.online && <i />}
    </span>
  );
}

function MessageBubble({ message, conversation }) {
  return (
    <div className={`nschat-message nschat-message--${message.direction}`}>
      {message.direction === "incoming" && <Avatar conversation={conversation} size="small" />}
      <div className="nschat-message-content">
        <div className="nschat-bubble">{message.lines.map((line) => <p key={line}>{line}</p>)}</div>
        <span className="nschat-message-meta">{message.time}{message.read && <CheckReadIcon />}</span>
      </div>
    </div>
  );
}

export default function CandidateChatPage() {
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState(() => INITIAL_CONVERSATIONS.map((conversation) => ({ ...conversation })));
  const [selectedId, setSelectedId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [messageDraft, setMessageDraft] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || conversations[0];
  const activeMessages = messages[selectedConversation.id] || [];

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    return conversations.filter((conversation) => {
      const matchesSearch = !query || [conversation.name, conversation.role, conversation.preview]
        .some((value) => value.toLocaleLowerCase("fr").includes(query));
      const matchesFilter = filter === "all"
        || (filter === "unread" && conversation.unreadCount > 0)
        || (filter === "online" && conversation.online);
      return matchesSearch && matchesFilter;
    });
  }, [conversations, filter, search]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeMessages.length, selectedId]);

  const handleSidebarNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const selectConversation = (conversationId) => {
    setSelectedId(conversationId);
    setConversations((current) => current.map((conversation) => (
      conversation.id === conversationId && conversation.unreadCount > 0
        ? { ...conversation, unreadCount: 0 }
        : conversation
    )));
    setMobileChatOpen(true);
    setMobileDetailsOpen(false);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const value = messageDraft.trim();
    if (!value) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages((current) => ({
      ...current,
      [selectedId]: [...(current[selectedId] || []), { id: `${selectedId}-${Date.now()}`, direction: "outgoing", lines: value.split("\n"), time: now, read: true }],
    }));
    setMessageDraft("");
    messageInputRef.current?.focus();
  };

  const addEmoji = () => {
    setMessageDraft((current) => `${current}${current ? " " : ""}😊`);
    messageInputRef.current?.focus();
  };

  return (
    <div className={`nsd-root nschat-root${mobileChatOpen ? " nschat-mobile-show-chat" : ""}`}>
      <StudentSidebar activePath="/student-messages" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleSidebarNavigate} />

      <main className="nsd-main nschat-main">
        <StudentHeader
          className="nschat-header"
          headingClassName="nschat-heading"
          iconClassName="nschat-heading-icon"
          icon={<ChatIcon />}
          title="Messages"
          subtitle="Échangez facilement avec votre équipe pédagogique."
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <section className="nschat-workspace" aria-label="Messagerie">
          <div className="nschat-conversation-column">
            <div className="nschat-list-controls">
              <label className="nschat-search">
                <span className="nschat-sr-only">Rechercher une conversation</span>
                <input ref={searchInputRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une conversation..." />
                <SearchIcon />
              </label>
              <label className="nschat-filter">
                <span className="nschat-sr-only">Filtrer les conversations</span>
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">Toutes</option>
                  <option value="unread">Non lues</option>
                  <option value="online">En ligne</option>
                </select>
                <ChevronDownIcon />
              </label>
            </div>

            <section className="nschat-card nschat-conversation-card">
              <div className="nschat-conversation-list">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`nschat-conversation-row${selectedId === conversation.id ? " is-active" : ""}`}
                    aria-pressed={selectedId === conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <Avatar conversation={conversation} />
                    <span className="nschat-conversation-copy">
                      <span className="nschat-conversation-name">{conversation.name}{conversation.role && <em>{conversation.role}</em>}</span>
                      <span className="nschat-preview">{conversation.preview}</span>
                    </span>
                    <span className="nschat-conversation-meta"><time>{conversation.time}</time>{conversation.unreadCount > 0 && <b>{conversation.unreadCount}</b>}</span>
                  </button>
                ))}
                {filteredConversations.length === 0 && <p className="nschat-empty">Aucune conversation trouvée.</p>}
              </div>
              <button type="button" className="nschat-show-all" onClick={() => { setSearch(""); setFilter("all"); }}>Voir toutes les conversations</button>
            </section>
          </div>

          <div className="nschat-chat-column">
            <div className="nschat-chat-toolbar">
              <button type="button" className="nschat-new-message" onClick={() => searchInputRef.current?.focus()}><PencilIcon /> Nouveau message</button>
            </div>

            <section className="nschat-card nschat-chat-card" aria-label={`Conversation avec ${selectedConversation.name}`}>
              <header className="nschat-chat-card-header">
                <button type="button" className="nschat-mobile-back" onClick={() => setMobileChatOpen(false)} aria-label="Retour aux conversations"><ChevronLeftIcon /></button>
                <Avatar conversation={selectedConversation} />
                <div><h2>{selectedConversation.name} {selectedConversation.role && <em>{selectedConversation.role}</em>}</h2><p><i /> {selectedConversation.online ? "En ligne" : "Hors ligne"}</p></div>
                <button type="button" className="nschat-mobile-details" onClick={() => setMobileDetailsOpen((open) => !open)}>Détails</button>
                <button type="button" className="nschat-more" aria-label="Plus d’options"><MoreIcon /></button>
              </header>

              <div className="nschat-messages">
                <div className="nschat-day-divider"><span>Aujourd'hui</span></div>
                {activeMessages.map((message) => <MessageBubble key={message.id} message={message} conversation={selectedConversation} />)}
                <span ref={messageEndRef} />
              </div>

              <form className="nschat-composer" onSubmit={sendMessage}>
                <button type="button" aria-label="Joindre un fichier"><PaperclipIcon /></button>
                <label><span className="nschat-sr-only">Écrire un message</span><textarea ref={messageInputRef} rows="1" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }} placeholder="Écrire un message..." /></label>
                <button type="button" className="nschat-emoji" aria-label="Ajouter un emoji" onClick={addEmoji}>☺</button>
                <button type="submit" className="nschat-send" aria-label="Envoyer le message" disabled={!messageDraft.trim()}><SendIcon /></button>
              </form>
            </section>
          </div>

          <aside className={`nschat-info-column${mobileDetailsOpen ? " is-mobile-open" : ""}`}>
            <section className="nschat-card nschat-about-card">
              <h2>À propos</h2>
              <div className="nschat-about-person"><Avatar conversation={selectedConversation} size="large" /><div><strong>{selectedConversation.name}</strong><span>{selectedConversation.role || "Conversation de groupe"}</span></div></div>
              <div className="nschat-contact-links">
                <button type="button"><MailIcon /> Envoyer un email</button>
                <button type="button"><PhoneIcon /> 06 12 34 56 78</button>
              </div>
            </section>

            <section className="nschat-card nschat-shortcuts-card">
              <h2>Raccourcis</h2>
              <div>{SHORTCUTS.map((shortcut) => <button key={shortcut.label} type="button" onClick={() => navigate(shortcut.path)}><span>{shortcut.icon}</span>{shortcut.label}<ChevronRightIcon /></button>)}</div>
            </section>

            <section className="nschat-hours-card">
              <header><ClockIcon /><h2>Horaires de l'auto-école</h2></header>
              <div><p><strong>Lundi - Vendredi</strong><span>09h00 - 19h00</span></p><p><strong>Samedi</strong><span>09h00 - 13h00</span></p></div>
              <button type="button">Nous contacter</button>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
