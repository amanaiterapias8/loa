import { useState, useEffect, useRef } from "react";

// ─── PALETA DE COLORES ───────────────────────────────────────────────────────
const C = {
  bg: "#0D0A1E",
  bgCard: "#1A1530",
  bgCard2: "#221D3A",
  purple: "#7B4FD4",
  purpleLight: "#9B6FF4",
  purpleDark: "#4A2A8A",
  gold: "#F0C040",
  goldLight: "#FFD966",
  goldDark: "#B8860B",
  pink: "#D45FA0",
  teal: "#4FC4CF",
  green: "#4FD494",
  orange: "#F07840",
  text: "#EDE8FF",
  textMuted: "#9A90C0",
  textDim: "#6A6090",
  border: "#2E2850",
  borderLight: "#3E3870",
  white: "#FFFFFF",
};

// ─── DATOS: ESCALA EMOCIONAL ─────────────────────────────────────────────────
const EMOTIONAL_SCALE = [
  { level: 1, name: "Alegría / Apreciación / Empoderamiento", color: "#FFD700", emoji: "✨" },
  { level: 2, name: "Pasión", color: "#FF8C00", emoji: "🔥" },
  { level: 3, name: "Entusiasmo / Euforia / Felicidad", color: "#FF6B35", emoji: "🌟" },
  { level: 4, name: "Expectativa / Creencia / Optimismo", color: "#90EE90", emoji: "🌱" },
  { level: 5, name: "Esperanza", color: "#66CDAA", emoji: "🌿" },
  { level: 6, name: "Satisfacción", color: "#48D1CC", emoji: "😌" },
  { level: 7, name: "Aburrimiento", color: "#87CEEB", emoji: "😐" },
  { level: 8, name: "Pesimismo", color: "#B0C4DE", emoji: "😕" },
  { level: 9, name: "Frustración / Irritación / Impaciencia", color: "#DDA0DD", emoji: "😤" },
  { level: 10, name: "Abrumamiento", color: "#DA70D6", emoji: "😰" },
  { level: 11, name: "Decepción", color: "#C71585", emoji: "😞" },
  { level: 12, name: "Duda", color: "#DC143C", emoji: "❓" },
  { level: 13, name: "Preocupación", color: "#B22222", emoji: "😟" },
  { level: 14, name: "Culpa / Vergüenza", color: "#8B0000", emoji: "😔" },
  { level: 15, name: "Inseguridad / Culpa / Celos", color: "#800000", emoji: "😣" },
  { level: 16, name: "Odio / Ira", color: "#4B0082", emoji: "😡" },
  { level: 17, name: "Miedo / Dolor / Depresión", color: "#2F0048", emoji: "😱" },
];

// ─── DATOS: HERRAMIENTAS ─────────────────────────────────────────────────────
const TOOLS = [
  { id: "money-game", name: "El Juego del Dinero", icon: "💰", color: C.gold, category: "abundancia", premium: false, desc: "Cambia tu mentalidad de abundancia con este ejercicio guiado" },
  { id: "scripting", name: "Scripting", icon: "✍️", color: C.purple, category: "claridad", premium: false, desc: "Escribe tu futuro deseado como si ya fuera real" },
  { id: "focus-wheel", name: "Rueda de Enfoque", icon: "🎯", color: C.teal, category: "alineacion", premium: false, desc: "Basado en las enseñanzas de Abraham-Hicks" },
  { id: "placemat", name: "El Proceso Mantel", icon: "📋", color: C.green, category: "alineacion", premium: false, desc: "Decide qué harás tú y qué dejará el Universo" },
  { id: "future-paving", name: "Pavimentando el Futuro", icon: "🛣️", color: C.orange, category: "claridad", premium: true, desc: "Guía tu visualización hacia tu vida ideal" },
  { id: "feel-as-if", name: "El Juego Siente Como Si", icon: "🎭", color: C.pink, category: "vibracion", premium: true, desc: "Activa la vibración de tus deseos ya cumplidos" },
  { id: "emergency", name: "Alineación de Emergencia", icon: "🆘", color: "#E55", category: "alineacion", premium: false, desc: "Para días difíciles: vuelve a alinearte rápido" },
  { id: "gratitude", name: "El Juego de la Gratitud", icon: "🙏", color: C.goldLight, category: "gratitud", premium: false, desc: "Construye el hábito de la apreciación diaria" },
  { id: "vision-board", name: "Tablero de Visión", icon: "🖼️", color: C.purpleLight, category: "visualizacion", premium: true, desc: "Crea tu mapa visual de deseos y metas" },
  { id: "timer-68", name: "Temporizador 68 Segundos", icon: "⏱️", color: C.teal, category: "vibracion", premium: false, desc: "68 seg de pensamiento puro activa tu vibración" },
  { id: "affirmations", name: "Afirmaciones IA", icon: "🤖", color: C.purpleLight, category: "ia", premium: true, desc: "Afirmaciones personalizadas con inteligencia artificial" },
  { id: "meditation", name: "Meditación Guiada", icon: "🧘", color: C.teal, category: "vibracion", premium: false, desc: "Meditaciones cortas de 5-15 minutos" },
];

// ─── DATOS: PROMPTS DE SCRIPTING ─────────────────────────────────────────────
const SCRIPTING_PROMPTS = [
  "Estoy tan feliz y agradecido/a ahora que...",
  "Hoy me desperté sintiéndome increíble porque...",
  "Mi vida es maravillosa, especialmente cuando...",
  "Estoy disfrutando plenamente de...",
  "Las personas en mi vida me apoyan de formas como...",
  "Mi situación financiera fluye perfectamente porque...",
  "Mi cuerpo se siente vibrante y saludable cuando...",
  "Las oportunidades llegan a mí fácilmente, como cuando...",
  "Soy tan afortunado/a de poder...",
  "El Universo me sorprende constantemente con...",
];

// ─── DATOS: PREGUNTAS DE GRATITUD ────────────────────────────────────────────
const GRATITUDE_PROMPTS = [
  "¿Qué pequeña cosa de hoy te hizo sonreír?",
  "¿Qué persona en tu vida aprecias profundamente y por qué?",
  "¿Qué habilidad tuya estás agradecido/a de tener?",
  "¿Qué momento de esta semana fue especialmente bueno?",
  "¿Qué comodidad cotidiana das por sentada pero es un regalo?",
  "¿Qué aprendiste recientemente que te haya enriquecido?",
  "¿Qué aspecto de tu salud aprecias hoy?",
  "¿Qué oportunidad se presentó inesperadamente?",
  "¿Qué belleza encontraste hoy en el mundo?",
  "¿Qué amor o conexión sientes en tu vida ahora mismo?",
];

// ─── DATOS: AFIRMACIONES ─────────────────────────────────────────────────────
const AFFIRMATIONS = [
  "Soy un imán poderoso para todo lo que deseo",
  "El dinero fluye hacia mí fácil y frecuentemente",
  "Merezco amor, abundancia y alegría",
  "El Universo siempre conspira a mi favor",
  "Mis pensamientos crean mi realidad con gracia",
  "Confío en el timing perfecto del Universo",
  "Soy digno/a de mis sueños más grandes",
  "La abundancia es mi estado natural",
  "Cada día me acerco más a mis deseos",
  "Vivo en un Universo amable y generoso",
  "Mis vibraciones se elevan con cada respiración",
  "Elijo pensamientos que me empoderan",
];

// ─── COMPONENTE: ICONO DE NAVEGACIÓN ─────────────────────────────────────────
function NavIcon({ tab, activeTab, onClick }) {
  const icons = { home: "🏠", tools: "🧰", journal: "📔", goals: "🎯", coach: "✨" };
  const labels = { home: "Inicio", tools: "Herramientas", journal: "Diario", goals: "Metas", coach: "Coach IA" };
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => onClick(tab)}
      style={{
        background: "none", border: "none", cursor: "pointer", display: "flex",
        flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 12px",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 22, filter: isActive ? "none" : "grayscale(0.7) opacity(0.6)" }}>{icons[tab]}</span>
      <span style={{
        fontSize: 10, fontWeight: isActive ? 700 : 400,
        color: isActive ? C.gold : C.textMuted, letterSpacing: 0.3,
      }}>{labels[tab]}</span>
      {isActive && (
        <div style={{
          width: 4, height: 4, borderRadius: "50%",
          background: C.gold, marginTop: -2,
        }} />
      )}
    </button>
  );
}

// ─── COMPONENTE: CARD ────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.bgCard, borderRadius: 16, padding: 20,
      border: `1px solid ${C.border}`, ...style,
    }}>
      {children}
    </div>
  );
}

// ─── COMPONENTE: BADGE PREMIUM ────────────────────────────────────────────────
function PremiumBadge() {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
      color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 6px",
      borderRadius: 6, letterSpacing: 0.5, textTransform: "uppercase",
    }}>PRO</span>
  );
}

// ─── PANTALLA: INICIO ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate, onOpenTool }) {
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [emotionalLevel, setEmotionalLevel] = useState(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const todayAffirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  const quickTools = TOOLS.filter(t => !t.premium).slice(0, 4);

  return (
    <div style={{ padding: "0 0 20px" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.purpleDark} 0%, ${C.bg} 100%)`,
        padding: "32px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.purpleLight}33, transparent 70%)`,
        }} />
        <p style={{ color: C.goldLight, fontSize: 13, marginBottom: 4, opacity: 0.9 }}>
          ✨ {greeting}
        </p>
        <h1 style={{ color: C.text, fontSize: 22, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>
          Caja de Herramientas
          <br />
          <span style={{ color: C.gold }}>Ley de Atracción</span>
        </h1>
        <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
          Tu práctica diaria de manifestación
        </p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Afirmación del día */}
        <Card style={{ marginTop: 20, background: `linear-gradient(135deg, ${C.purpleDark}88, ${C.bgCard})`, border: `1px solid ${C.purpleLight}55` }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>
            ✨ Afirmación del Día
          </p>
          <p style={{ color: C.text, fontSize: 16, fontWeight: 600, lineHeight: 1.5, margin: "0 0 12px", fontStyle: "italic" }}>
            "{todayAffirmation}"
          </p>
          <button
            onClick={() => setAffirmationIdx((affirmationIdx + 1) % AFFIRMATIONS.length)}
            style={{
              background: "none", border: `1px solid ${C.purpleLight}66`,
              color: C.purpleLight, fontSize: 12, padding: "6px 14px",
              borderRadius: 20, cursor: "pointer",
            }}
          >
            Nueva afirmación →
          </button>
        </Card>

        {/* Escala emocional rápida */}
        <Card style={{ marginTop: 16 }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>
            🌡️ ¿Cómo te sientes ahora?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["😊 Bien", "😐 Regular", "😔 Mal"].map((label, i) => (
              <button
                key={i}
                onClick={() => {
                  setEmotionalLevel(i);
                  if (i === 2) onOpenTool("emergency");
                  else if (i === 0) onOpenTool("feel-as-if");
                }}
                style={{
                  background: emotionalLevel === i ? C.purple : C.bgCard2,
                  border: `1px solid ${emotionalLevel === i ? C.purpleLight : C.border}`,
                  color: C.text, fontSize: 13, padding: "8px 16px",
                  borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {emotionalLevel !== null && (
            <p style={{ color: C.textMuted, fontSize: 12, marginTop: 10 }}>
              {emotionalLevel === 0 ? "¡Perfecto para amplificar tu momentum! →" :
               emotionalLevel === 1 ? "El Temporizador de 68 segundos puede ayudarte →" :
               "Abriendo tu herramienta de Alineación de Emergencia..."}
            </p>
          )}
        </Card>

        {/* Acceso rápido */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Herramientas Rápidas</p>
            <button
              onClick={() => onNavigate("tools")}
              style={{ background: "none", border: "none", color: C.purpleLight, fontSize: 12, cursor: "pointer" }}
            >
              Ver todas →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {quickTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: 16, cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", gap: 6,
                }}
              >
                <span style={{ fontSize: 28 }}>{tool.icon}</span>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Racha diaria */}
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🔥</div>
          <p style={{ color: C.gold, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Racha Diaria</p>
          <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Completa un ejercicio hoy para mantener tu racha</p>
          {/* TODO: implementar lógica de racha con localStorage y fechas */}
        </Card>

        {/* Quote del día */}
        <Card style={{ marginTop: 16, background: `linear-gradient(135deg, ${C.bgCard2}, ${C.bgCard})` }}>
          <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 8px", letterSpacing: 1 }}>💬 SABIDURÍA DEL DÍA</p>
          <p style={{ color: C.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 8px" }}>
            "Lo que piensas, lo creas. Lo que sientes, lo atraes. Lo que imaginas, lo conviertes en realidad."
          </p>
          <p style={{ color: C.gold, fontSize: 12, margin: 0 }}>— Abraham-Hicks</p>
        </Card>
      </div>
    </div>
  );
}

// ─── PANTALLA: HERRAMIENTAS ───────────────────────────────────────────────────
function ToolsScreen({ onOpenTool }) {
  const [filter, setFilter] = useState("todas");
  const categories = [
    { id: "todas", label: "Todas" },
    { id: "abundancia", label: "Abundancia" },
    { id: "claridad", label: "Claridad" },
    { id: "alineacion", label: "Alineación" },
    { id: "vibracion", label: "Vibración" },
    { id: "gratitud", label: "Gratitud" },
    { id: "ia", label: "Coach IA" },
  ];
  const filtered = filter === "todas" ? TOOLS : TOOLS.filter(t => t.category === filter);

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>🧰 Herramientas</h2>
      <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 20px" }}>25+ ejercicios guiados de manifestación</p>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            style={{
              background: filter === cat.id ? C.purple : C.bgCard,
              border: `1px solid ${filter === cat.id ? C.purpleLight : C.border}`,
              color: filter === cat.id ? C.white : C.textMuted,
              fontSize: 12, padding: "6px 14px", borderRadius: 20,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de herramientas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(tool => (
          <button
            key={tool.id}
            onClick={() => onOpenTool(tool.id)}
            style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: "16px 20px", cursor: "pointer",
              textAlign: "left", display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${tool.color}22`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 26, flexShrink: 0,
              border: `1px solid ${tool.color}44`,
            }}>
              {tool.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{tool.name}</span>
                {tool.premium && <PremiumBadge />}
              </div>
              <p style={{ color: C.textMuted, fontSize: 12, margin: 0, lineHeight: 1.4 }}>{tool.desc}</p>
            </div>
            <span style={{ color: C.textDim, fontSize: 18 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PANTALLA: DIARIO ─────────────────────────────────────────────────────────
function JournalScreen() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("loa_journal") || "[]"); } catch { return []; }
  });
  const [text, setText] = useState("");
  const [tag, setTag] = useState("insight");

  const tags = [
    { id: "insight", label: "💡 Insight", color: C.gold },
    { id: "sync", label: "🌀 Sincronía", color: C.teal },
    { id: "shift", label: "✨ Cambio", color: C.purple },
    { id: "gratitud", label: "🙏 Gratitud", color: C.green },
  ];

  const saveEntry = () => {
    if (!text.trim()) return;
    const newEntry = { id: Date.now(), text: text.trim(), tag, date: new Date().toLocaleDateString("es-ES") };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("loa_journal", JSON.stringify(updated));
    setText("");
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("loa_journal", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>📔 Diario de Progreso</h2>
      <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 20px" }}>Registra insights, sincronías y cambios</p>

      {/* Nueva entrada */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>
          + Nueva Entrada
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="¿Qué insights, sincronías o cambios notaste hoy?..."
          style={{
            width: "100%", minHeight: 100, background: C.bgCard2,
            border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
            color: C.text, fontSize: 14, resize: "vertical", fontFamily: "inherit",
            outline: "none", boxSizing: "border-box", lineHeight: 1.5,
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => setTag(t.id)}
              style={{
                background: tag === t.id ? `${t.color}33` : "none",
                border: `1px solid ${tag === t.id ? t.color : C.border}`,
                color: tag === t.id ? t.color : C.textMuted,
                fontSize: 11, padding: "4px 10px", borderRadius: 12, cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={saveEntry}
          style={{
            marginTop: 12, width: "100%",
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
            border: "none", borderRadius: 12, padding: "12px",
            color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Guardar Entrada
        </button>
      </Card>

      {/* Entradas anteriores */}
      {entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <p style={{ color: C.textMuted, fontSize: 14 }}>Tu diario está vacío. ¡Empieza a registrar tu viaje!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map(entry => {
            const tagData = tags.find(t => t.id === entry.tag) || tags[0];
            return (
              <Card key={entry.id} style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{
                    background: `${tagData.color}22`, border: `1px solid ${tagData.color}55`,
                    color: tagData.color, fontSize: 11, padding: "3px 8px", borderRadius: 10,
                  }}>
                    {tagData.label}
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: C.textDim, fontSize: 11 }}>{entry.date}</span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 14 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{entry.text}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA: METAS ──────────────────────────────────────────────────────────
function GoalsScreen() {
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("loa_goals") || "[]"); } catch { return []; }
  });
  const [text, setText] = useState("");
  const [category, setCategory] = useState("general");

  const categories = [
    { id: "general", label: "🌟 General", color: C.purple },
    { id: "dinero", label: "💰 Dinero", color: C.gold },
    { id: "amor", label: "❤️ Amor", color: C.pink },
    { id: "salud", label: "💚 Salud", color: C.green },
    { id: "carrera", label: "🚀 Carrera", color: C.teal },
  ];

  const addGoal = () => {
    if (!text.trim()) return;
    const newGoal = { id: Date.now(), text: text.trim(), category, manifested: false, date: new Date().toLocaleDateString("es-ES") };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    localStorage.setItem("loa_goals", JSON.stringify(updated));
    setText("");
  };

  const toggleManifested = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, manifested: !g.manifested } : g);
    setGoals(updated);
    localStorage.setItem("loa_goals", JSON.stringify(updated));
  };

  const deleteGoal = (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem("loa_goals", JSON.stringify(updated));
  };

  const manifested = goals.filter(g => g.manifested);
  const pending = goals.filter(g => !g.manifested);

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>🎯 Mis Metas</h2>
      <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 20px" }}>Lista de deseos y manifestaciones</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card style={{ textAlign: "center", background: `linear-gradient(135deg, ${C.purpleDark}88, ${C.bgCard})` }}>
          <div style={{ color: C.purpleLight, fontSize: 28, fontWeight: 800 }}>{pending.length}</div>
          <div style={{ color: C.textMuted, fontSize: 12 }}>En proceso</div>
        </Card>
        <Card style={{ textAlign: "center", background: `linear-gradient(135deg, ${C.gold}22, ${C.bgCard})` }}>
          <div style={{ color: C.gold, fontSize: 28, fontWeight: 800 }}>{manifested.length}</div>
          <div style={{ color: C.textMuted, fontSize: 12 }}>Manifestados ✨</div>
        </Card>
      </div>

      {/* Nueva meta */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 12px", letterSpacing: 1, textTransform: "uppercase" }}>
          + Agregar Deseo
        </p>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addGoal()}
          placeholder="Escribe lo que deseas manifestar..."
          style={{
            width: "100%", background: C.bgCard2, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "12px", color: C.text, fontSize: 14,
            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                background: category === cat.id ? `${cat.color}33` : "none",
                border: `1px solid ${category === cat.id ? cat.color : C.border}`,
                color: category === cat.id ? cat.color : C.textMuted,
                fontSize: 11, padding: "4px 10px", borderRadius: 12, cursor: "pointer",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={addGoal}
          style={{
            marginTop: 12, width: "100%",
            background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
            border: "none", borderRadius: 12, padding: "12px",
            color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          ✨ Declarar al Universo
        </button>
      </Card>

      {/* Lista de metas pendientes */}
      {pending.length > 0 && (
        <>
          <p style={{ color: C.textMuted, fontSize: 12, margin: "0 0 10px", letterSpacing: 1, textTransform: "uppercase" }}>EN PROCESO</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {pending.map(goal => {
              const cat = categories.find(c => c.id === goal.category) || categories[0];
              return (
                <Card key={goal.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                  <button
                    onClick={() => toggleManifested(goal.id)}
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: `2px solid ${cat.color}`, background: "none",
                      cursor: "pointer", flexShrink: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: C.text, fontSize: 14, margin: "0 0 2px" }}>{goal.text}</p>
                    <span style={{ color: cat.color, fontSize: 11 }}>{cat.label}</span>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16 }}
                  >×</button>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Lista de manifestados */}
      {manifested.length > 0 && (
        <>
          <p style={{ color: C.gold, fontSize: 12, margin: "0 0 10px", letterSpacing: 1, textTransform: "uppercase" }}>✨ MANIFESTADOS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {manifested.map(goal => (
              <Card key={goal.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", opacity: 0.8, background: `${C.gold}11` }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: C.gold, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, flexShrink: 0,
                }}>✓</div>
                <p style={{ color: C.text, fontSize: 14, margin: 0, flex: 1, textDecoration: "line-through", opacity: 0.7 }}>{goal.text}</p>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16 }}
                >×</button>
              </Card>
            ))}
          </div>
        </>
      )}

      {goals.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
          <p style={{ color: C.textMuted, fontSize: 14 }}>¡Declara tus deseos al Universo!</p>
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA: COACH IA ───────────────────────────────────────────────────────
function CoachScreen() {
  const [messages, setMessages] = useState([
    {
      role: "coach",
      text: "¡Hola! Soy tu Coach de Manifestación. 🌟 Estoy aquí para ayudarte a alinearte con tus deseos. ¿Sobre qué área de tu vida quieres trabajar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dailyQuestion, setDailyQuestion] = useState(0);
  const messagesEndRef = useRef(null);

  const dailyQuestions = [
    "¿Qué deseo se siente más vivo en ti hoy?",
    "¿Qué creencia limitante quieres disolver esta semana?",
    "¿En qué área de tu vida sientes más resistencia ahora?",
    "¿Qué serías capaz de hacer si supieras que el Universo te apoya?",
    "¿Cómo te verías en tu mejor versión dentro de un año?",
  ];

  // TODO: Reemplazar con llamada real a API de IA (OpenAI, Claude, etc.)
  const generateCoachResponse = (userMsg) => {
    const msg = userMsg.toLowerCase();
    if (msg.includes("dinero") || msg.includes("abundan")) {
      return "💰 Para atraer abundancia, primero necesitamos elevar tu vibración sobre el dinero. El dinero es energía y fluye hacia quienes lo reciben con gratitud. Prueba el Juego del Dinero: imagina que tienes una tarjeta de $1,000 para gastar hoy, ¿en qué la usarías? Este ejercicio activa la emoción de la abundancia.";
    } else if (msg.includes("amor") || msg.includes("relación") || msg.includes("pareja")) {
      return "❤️ El amor comienza con la relación que tienes contigo mismo/a. Para atraer una pareja alineada, visualiza cómo te *sientes* en esa relación, no solo cómo luce. Practica el scripting: escribe una entrada de diario como si ya estuvieras en esa relación perfecta. ¿Cómo te sientes? ¿Qué están haciendo juntos?";
    } else if (msg.includes("trabajo") || msg.includes("carrera") || msg.includes("negocio")) {
      return "🚀 Tu carrera ideal ya existe en el campo cuántico. Lo que necesitas es alinearte vibratoriamente con ella. Empieza con el Proceso Mantel: divide una página en dos. En la izquierda escribe lo que TÚ harás hoy. En la derecha, escribe qué dejarás al Universo. Esto elimina la resistencia del 'cómo'.";
    } else if (msg.includes("salud") || msg.includes("cuerpo") || msg.includes("enferm")) {
      return "💚 Tu cuerpo responde a tus pensamientos y emociones. Comienza agradeciéndole a cada parte de tu cuerpo que funciona bien. La gratitud por la salud que YA tienes atrae más salud. También te recomiendo meditaciones de sanación: visualiza luz dorada fluyendo por cada célula de tu cuerpo.";
    } else if (msg.includes("afirmaci") || msg.includes("mantra")) {
      return "✨ Aquí tienes afirmaciones personalizadas para ti:\n\n• 'Soy un canal abierto para recibir mis deseos'\n• 'Todo lo que necesito llega a mí en el momento perfecto'\n• 'Confío en el proceso del Universo'\n\nRepítelas cada mañana mirándote al espejo con sentimiento y convicción. La clave es SENTIRLAS como verdad.";
    } else if (msg.includes("resistenci") || msg.includes("bloqu") || msg.includes("atascad")) {
      return "🌀 La resistencia es información valiosa. Cuando te sientes bloqueado/a, tu sistema emocional te está señalando una creencia limitante. Pregúntate: '¿Qué historia me estoy contando sobre por qué esto NO puede suceder?' Usa la Rueda de Enfoque para transformar esa creencia paso a paso.";
    } else {
      return "🌟 Gracias por compartir eso conmigo. Recuerda que el Universo siempre está respondiendo a tu vibración dominante. El primer paso es siempre el mismo: ¿cómo puedes sentirte UN POCO mejor ahora mismo? No necesitas saltar de la duda a la alegría. Solo un pequeño paso arriba en la Escala Emocional. ¿Qué herramienta del toolkit quieres usar hoy?";
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "coach", text: generateCoachResponse(userMsg) }]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0" }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>✨ Coach IA</h2>
        <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Guía personalizada de manifestación</p>
      </div>

      {/* Pregunta del día */}
      <div style={{ padding: "0 16px 12px" }}>
        <Card style={{ background: `linear-gradient(135deg, ${C.purpleDark}88, ${C.bgCard})`, border: `1px solid ${C.purpleLight}55` }}>
          <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>
            💡 Pregunta de Hoy
          </p>
          <p style={{ color: C.text, fontSize: 13, margin: "0 0 10px", fontStyle: "italic", lineHeight: 1.5 }}>
            "{dailyQuestions[dailyQuestion]}"
          </p>
          <button
            onClick={() => {
              const q = dailyQuestions[dailyQuestion];
              setInput(q);
              setDailyQuestion((dailyQuestion + 1) % dailyQuestions.length);
            }}
            style={{
              background: `${C.purple}44`, border: `1px solid ${C.purple}77`,
              color: C.purpleLight, fontSize: 11, padding: "5px 12px",
              borderRadius: 12, cursor: "pointer",
            }}
          >
            Explorar esta pregunta →
          </button>
        </Card>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 12 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            {msg.role === "coach" && (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0, marginRight: 8, alignSelf: "flex-end",
              }}>✨</div>
            )}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user"
                ? `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`
                : C.bgCard,
              border: msg.role === "coach" ? `1px solid ${C.border}` : "none",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
            }}>
              <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>✨</div>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: C.purpleLight,
                    animation: `bounce 1s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px 20px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Pregúntale a tu coach..."
            style={{
              flex: 1, background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: 24, padding: "12px 18px", color: C.text,
              fontSize: 14, fontFamily: "inherit", outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              width: 46, height: 46,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              border: "none", borderRadius: "50%", cursor: "pointer",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: HERRAMIENTA ───────────────────────────────────────────────────────
function ToolModal({ toolId, onClose }) {
  const tool = TOOLS.find(t => t.id === toolId);
  const [step, setStep] = useState(0);
  const [content, setContent] = useState("");
  const [timerSecs, setTimerSecs] = useState(68);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [promptIdx, setPromptIdx] = useState(Math.floor(Math.random() * 10));
  const [moneyAmount, setMoneyAmount] = useState(1000);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const timerRef = useRef(null);
  const [focusWheelSpokes, setFocusWheelSpokes] = useState(Array(12).fill(""));
  const [focusWheelCenter, setFocusWheelCenter] = useState("");

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timerRunning && timerSecs > 0) {
      timerRef.current = setTimeout(() => setTimerSecs(s => s - 1), 1000);
    } else if (timerSecs === 0) {
      setTimerRunning(false);
      setTimerDone(true);
    }
  }, [timerRunning, timerSecs]);

  const startTimer = () => {
    setTimerSecs(68);
    setTimerDone(false);
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    clearTimeout(timerRef.current);
  };

  if (!tool) return null;

  const renderToolContent = () => {
    // ── TEMPORIZADOR 68 SEGUNDOS ──
    if (toolId === "timer-68") {
      const progress = ((68 - timerSecs) / 68) * 100;
      const circumference = 2 * Math.PI * 80;
      return (
        <div style={{ padding: "20px 20px 40px", textAlign: "center" }}>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            Mantén un pensamiento puro y positivo durante 68 segundos. Abraham-Hicks enseña que 68 segundos de pensamiento puro y enfocado activa la vibración de lo que deseas.
          </p>
          <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
            <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="90" cy="90" r="80" fill="none" stroke={C.border} strokeWidth="8" />
              <circle
                cx="90" cy="90" r="80" fill="none"
                stroke={timerDone ? C.green : C.purpleLight}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress) / 100}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: timerDone ? C.green : C.text, fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
                {timerDone ? "✓" : timerSecs}
              </span>
              {!timerDone && <span style={{ color: C.textMuted, fontSize: 12 }}>segundos</span>}
            </div>
          </div>
          {timerDone && (
            <div style={{
              background: `${C.green}22`, border: `1px solid ${C.green}55`,
              borderRadius: 12, padding: 16, marginBottom: 20,
            }}>
              <p style={{ color: C.green, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>¡68 Segundos Completados! ✨</p>
              <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Has activado la vibración de tu deseo. El Universo ha registrado tu intención.</p>
            </div>
          )}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="¿En qué pensamiento/deseo te vas a enfocar durante 68 segundos?..."
            style={{
              width: "100%", minHeight: 80, background: C.bgCard2,
              border: `1px solid ${C.border}`, borderRadius: 12, padding: 14,
              color: C.text, fontSize: 14, fontFamily: "inherit", resize: "none",
              outline: "none", boxSizing: "border-box", marginBottom: 16,
            }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            {!timerRunning ? (
              <button
                onClick={startTimer}
                style={{
                  flex: 1, background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
                  border: "none", borderRadius: 14, padding: 16,
                  color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer",
                }}
              >
                {timerDone ? "🔄 Repetir" : "▶ Iniciar Timer"}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                style={{
                  flex: 1, background: C.bgCard2, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: 16, color: C.text, fontSize: 16, cursor: "pointer",
                }}
              >
                ⏸ Pausar
              </button>
            )}
          </div>
        </div>
      );
    }

    // ── SCRIPTING ──
    if (toolId === "scripting") {
      const prompt = SCRIPTING_PROMPTS[promptIdx % SCRIPTING_PROMPTS.length];
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>
            Escribe en presente, como si tu deseo ya se hubiera cumplido. Usa el prompt de hoy como punto de partida.
          </p>
          <Card style={{ marginBottom: 16, background: `${C.purple}22`, border: `1px solid ${C.purple}55` }}>
            <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>Prompt del día</p>
            <p style={{ color: C.text, fontSize: 15, fontStyle: "italic", margin: 0 }}>"{prompt}"</p>
          </Card>
          <button
            onClick={() => setPromptIdx(p => p + 1)}
            style={{
              background: "none", border: `1px solid ${C.border}`, color: C.textMuted,
              fontSize: 12, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              marginBottom: 16, display: "block",
            }}
          >
            Otro prompt →
          </button>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`${prompt}\n\n...escribe tu scripting aquí`}
            style={{
              width: "100%", minHeight: 220, background: C.bgCard2,
              border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
              color: C.text, fontSize: 14, fontFamily: "inherit", resize: "vertical",
              outline: "none", boxSizing: "border-box", lineHeight: 1.7,
            }}
          />
          <button
            onClick={() => {
              if (!content.trim()) return;
              try {
                const entries = JSON.parse(localStorage.getItem("loa_journal") || "[]");
                entries.unshift({ id: Date.now(), text: `📝 Scripting:\n${content}`, tag: "insight", date: new Date().toLocaleDateString("es-ES") });
                localStorage.setItem("loa_journal", JSON.stringify(entries));
              } catch {}
              onClose();
            }}
            style={{
              marginTop: 16, width: "100%",
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              border: "none", borderRadius: 14, padding: 16,
              color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            💾 Guardar en Diario
          </button>
        </div>
      );
    }

    // ── JUEGO DEL DINERO ──
    if (toolId === "money-game") {
      const amounts = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>
            Imagina que tienes esta cantidad para gastar hoy. Detalla CÓMO la gastarías. El objetivo es sentir la emoción real de la abundancia.
          </p>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 10px", letterSpacing: 1, textTransform: "uppercase" }}>
              Elige tu cantidad
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {amounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setMoneyAmount(amt)}
                  style={{
                    background: moneyAmount === amt ? `${C.gold}33` : C.bgCard2,
                    border: `1px solid ${moneyAmount === amt ? C.gold : C.border}`,
                    color: moneyAmount === amt ? C.gold : C.textMuted,
                    fontSize: 12, padding: "6px 12px", borderRadius: 12, cursor: "pointer",
                  }}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <Card style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}44`, marginBottom: 16, textAlign: "center" }}>
            <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 4px" }}>Tienes para gastar hoy:</p>
            <p style={{ color: C.gold, fontSize: 32, fontWeight: 800, margin: 0 }}>
              ${moneyAmount.toLocaleString()}
            </p>
          </Card>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Voy a gastar mis $${moneyAmount.toLocaleString()} en...\n\nPrimero compraría...\nLuego invertiría en...\nTambién regalaría...\nY guardaría...`}
            style={{
              width: "100%", minHeight: 200, background: C.bgCard2,
              border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
              color: C.text, fontSize: 14, fontFamily: "inherit", resize: "vertical",
              outline: "none", boxSizing: "border-box", lineHeight: 1.7,
            }}
          />
          <button
            onClick={() => {
              if (!content.trim()) return;
              try {
                const entries = JSON.parse(localStorage.getItem("loa_journal") || "[]");
                entries.unshift({ id: Date.now(), text: `💰 Juego del Dinero ($${moneyAmount.toLocaleString()}):\n${content}`, tag: "insight", date: new Date().toLocaleDateString("es-ES") });
                localStorage.setItem("loa_journal", JSON.stringify(entries));
              } catch {}
              onClose();
            }}
            style={{
              marginTop: 16, width: "100%",
              background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
              border: "none", borderRadius: 14, padding: 16,
              color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            💾 Guardar Ejercicio
          </button>
        </div>
      );
    }

    // ── GRATITUD ──
    if (toolId === "gratitude") {
      const gratPrompt = GRATITUDE_PROMPTS[promptIdx % GRATITUDE_PROMPTS.length];
      const [items, setItems] = useState(["", "", ""]);
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>
            La gratitud es la frecuencia más alta de atracción. Completa el ejercicio de hoy.
          </p>
          <Card style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}44`, marginBottom: 20 }}>
            <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>Reflexión del día</p>
            <p style={{ color: C.text, fontSize: 14, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>"{gratPrompt}"</p>
          </Card>
          <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Hoy estoy agradecido/a por:</p>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <span style={{ color: C.gold, fontSize: 18, width: 28, textAlign: "center" }}>
                {["🌟", "💫", "✨"][idx]}
              </span>
              <input
                value={item}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx] = e.target.value;
                  setItems(newItems);
                }}
                placeholder={`Cosa ${idx + 1} por la que estoy agradecido/a...`}
                style={{
                  flex: 1, background: C.bgCard2, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "12px", color: C.text, fontSize: 14,
                  fontFamily: "inherit", outline: "none",
                }}
              />
            </div>
          ))}
          <button
            onClick={() => setItems(prev => [...prev, ""])}
            style={{
              background: "none", border: `1px dashed ${C.border}`, color: C.textMuted,
              fontSize: 13, padding: "10px", borderRadius: 10, cursor: "pointer",
              width: "100%", marginBottom: 16,
            }}
          >
            + Agregar otro
          </button>
          <button
            onClick={() => {
              const filled = items.filter(i => i.trim());
              if (!filled.length) return;
              try {
                const entries = JSON.parse(localStorage.getItem("loa_journal") || "[]");
                entries.unshift({ id: Date.now(), text: `🙏 Gratitud:\n${filled.map((f, i) => `${i + 1}. ${f}`).join("\n")}`, tag: "gratitud", date: new Date().toLocaleDateString("es-ES") });
                localStorage.setItem("loa_journal", JSON.stringify(entries));
              } catch {}
              onClose();
            }}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
              border: "none", borderRadius: 14, padding: 16,
              color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            🙏 Guardar Gratitudes
          </button>
        </div>
      );
    }

    // ── ALINEACIÓN DE EMERGENCIA ──
    if (toolId === "emergency") {
      const steps = [
        { icon: "🌬️", title: "Respira", desc: "Toma 5 respiraciones profundas. Inhala 4 segundos, retén 4, exhala 6. Esto activa tu sistema parasimpático." },
        { icon: "🛑", title: "Para el Pensamiento", desc: "Di en voz alta: 'PARO. Este pensamiento no me sirve. Elijo pensar diferente ahora mismo.'" },
        { icon: "🔍", title: "Busca Alivio", desc: "No intentes saltar de la desesperación a la alegría. Solo busca un pensamiento que se sienta LIGERAMENTE mejor." },
        { icon: "🙏", title: "Un Agradecimiento", desc: "Encuentra UNA cosa, cualquier cosa, por la que puedas sentir gratitud ahora mismo. No tiene que ser grande." },
        { icon: "✨", title: "Afirmación de Puente", desc: "Repite: 'Estoy en el proceso de mejorar. Las cosas siempre funcionan para mí. El Universo me apoya.'" },
      ];
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <Card style={{ background: "#E5551122", border: "1px solid #E5551166", marginBottom: 20 }}>
            <p style={{ color: "#FF8888", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              🆘 Esta herramienta es para días difíciles. Te guiará paso a paso para volver a la alineación desde donde estás ahora.
            </p>
          </Card>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, marginBottom: 20,
              opacity: step >= i ? 1 : 0.4, transition: "opacity 0.3s",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: step >= i ? `${C.purple}44` : C.bgCard2,
                border: `1px solid ${step >= i ? C.purple : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <p style={{ color: step >= i ? C.text : C.textDim, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>
                  {i + 1}. {s.title}
                </p>
                <p style={{ color: C.textMuted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
          {step < steps.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, #E55511, #FF7744)`,
                border: "none", borderRadius: 14, padding: 16,
                color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              {step === 0 ? "Comenzar →" : step === steps.length - 1 ? "Último paso →" : `Paso ${step + 1} completado →`}
            </button>
          ) : (
            <Card style={{ background: `${C.green}22`, border: `1px solid ${C.green}55`, textAlign: "center" }}>
              <p style={{ color: C.green, fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>✅ ¡Lo lograste!</p>
              <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Has completado el proceso de alineación de emergencia. Recuerda: cada pequeño paso cuenta.</p>
            </Card>
          )}
        </div>
      );
    }

    // ── RUEDA DE ENFOQUE ──
    if (toolId === "focus-wheel") {
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
            De Abraham-Hicks: Escribe tu tema/deseo central, luego llena cada "radio" con una afirmación que se sienta VERDAD para ti sobre ese tema.
          </p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.gold, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>
              CENTRO — ¿Sobre qué tema quieres trabajar?
            </label>
            <input
              value={focusWheelCenter}
              onChange={e => setFocusWheelCenter(e.target.value)}
              placeholder="Ej: dinero, mi relación, mi salud..."
              style={{
                width: "100%", background: C.bgCard2, border: `1px solid ${C.gold}77`,
                borderRadius: 10, padding: 12, color: C.text, fontSize: 14,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>
            Radios — Afirmaciones que se sienten verdad:
          </p>
          {focusWheelSpokes.slice(0, 8).map((spoke, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <span style={{ color: C.teal, fontSize: 14, width: 24, textAlign: "center", fontWeight: 700 }}>{idx + 1}</span>
              <input
                value={spoke}
                onChange={e => {
                  const newSpokes = [...focusWheelSpokes];
                  newSpokes[idx] = e.target.value;
                  setFocusWheelSpokes(newSpokes);
                }}
                placeholder={`Afirmación ${idx + 1} sobre "${focusWheelCenter || 'tu tema'}"...`}
                style={{
                  flex: 1, background: C.bgCard2, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 13,
                  fontFamily: "inherit", outline: "none",
                }}
              />
            </div>
          ))}
          <button
            onClick={() => {
              const filled = focusWheelSpokes.filter(s => s.trim());
              if (!filled.length) return;
              try {
                const entries = JSON.parse(localStorage.getItem("loa_journal") || "[]");
                entries.unshift({ id: Date.now(), text: `🎯 Rueda de Enfoque — "${focusWheelCenter}":\n${filled.map((f, i) => `${i + 1}. ${f}`).join("\n")}`, tag: "insight", date: new Date().toLocaleDateString("es-ES") });
                localStorage.setItem("loa_journal", JSON.stringify(entries));
              } catch {}
              onClose();
            }}
            style={{
              marginTop: 8, width: "100%",
              background: `linear-gradient(135deg, ${C.teal}, ${C.purple})`,
              border: "none", borderRadius: 14, padding: 16,
              color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            💾 Guardar Rueda de Enfoque
          </button>
        </div>
      );
    }

    // ── ESCALA EMOCIONAL ──
    if (toolId === "placemat") {
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>
            Abraham-Hicks: Divide tu día entre lo que TÚ manejarás y lo que delegas al Universo. Esto reduce la resistencia del "cómo".
          </p>
          <Card style={{ marginBottom: 16 }}>
            <p style={{ color: C.green, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>✅ Hoy YO me encargo de:</p>
            <textarea
              placeholder="Cosas concretas que harás hoy..."
              style={{
                width: "100%", minHeight: 100, background: C.bgCard2,
                border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
                color: C.text, fontSize: 13, fontFamily: "inherit", resize: "none",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </Card>
          <Card style={{ marginBottom: 20 }}>
            <p style={{ color: C.purple, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>🌌 Hoy el UNIVERSO se encarga de:</p>
            <textarea
              placeholder="Cosas que vas a confiar y soltar al flujo universal..."
              style={{
                width: "100%", minHeight: 100, background: C.bgCard2,
                border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
                color: C.text, fontSize: 13, fontFamily: "inherit", resize: "none",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </Card>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${C.green}, ${C.teal})`,
              border: "none", borderRadius: 14, padding: 16,
              color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            ✅ Completar Proceso Mantel
          </button>
        </div>
      );
    }

    // ── MEDITACIÓN ──
    if (toolId === "meditation") {
      const meditations = [
        { title: "Respiración de Alineación", duration: "5 min", desc: "Conecta con tu centro interno y calma la mente.", steps: ["Siéntate cómodamente y cierra los ojos", "Inhala lentamente contando hasta 4", "Retén el aire contando hasta 4", "Exhala completamente contando hasta 6", "Con cada respiración, visualiza que te llenas de luz dorada", "Repite: 'Estoy alineado/a con mi mayor bien'"] },
        { title: "Visualización de Deseos", duration: "10 min", desc: "Visualiza tu vida ideal con detalle y emoción.", steps: ["Relaja tu cuerpo de pies a cabeza", "Imagina que estás en tu vida ideal en 1 año", "¿Dónde estás? ¿Qué ves a tu alrededor?", "¿Quién está contigo?", "¿Cómo se siente tu cuerpo en esa vida?", "Siente la gratitud por esa realidad", "Mantén esa emoción al abrir los ojos"] },
      ];
      const [selected, setSelected] = useState(null);
      return (
        <div style={{ padding: "20px 20px 40px" }}>
          {!selected ? (
            <>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>
                Elige una meditación guiada para elevar tu vibración.
              </p>
              {meditations.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(m)}
                  style={{
                    width: "100%", background: C.bgCard2, border: `1px solid ${C.border}`,
                    borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left",
                    marginBottom: 12, display: "flex", gap: 14, alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 32 }}>🧘</span>
                  <div>
                    <p style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{m.title}</p>
                    <p style={{ color: C.teal, fontSize: 12, margin: "0 0 4px" }}>⏱️ {m.duration}</p>
                    <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>{m.desc}</p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>←</button>
                <div>
                  <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>{selected.title}</p>
                  <p style={{ color: C.teal, fontSize: 12, margin: 0 }}>⏱️ {selected.duration}</p>
                </div>
              </div>
              {selected.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: `${C.teal}33`, border: `1px solid ${C.teal}77`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.teal, fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
              <button
                onClick={onClose}
                style={{
                  marginTop: 8, width: "100%",
                  background: `linear-gradient(135deg, ${C.teal}, ${C.purple})`,
                  border: "none", borderRadius: 14, padding: 16,
                  color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
                }}
              >
                ✅ Meditación Completada
              </button>
            </>
          )}
        </div>
      );
    }

    // ── ESCALA EMOCIONAL / FEEL AS IF / PREMIUM ──
    if (tool.premium) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🔒</div>
          <h3 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Función Premium</h3>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            {tool.name} está disponible en la versión Premium. Desbloquea el acceso completo a las 25+ herramientas de manifestación.
          </p>
          <button
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
              border: "none", borderRadius: 14, padding: "16px 32px",
              color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer",
            }}
          >
            ✨ Actualizar a Premium
          </button>
          {/* TODO: Implementar paywall/suscripción con Stripe o RevenueCat */}
        </div>
      );
    }

    // Fallback genérico
    return (
      <div style={{ padding: "20px 20px 40px" }}>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{tool.desc}</p>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribe tus reflexiones aquí..."
          style={{
            width: "100%", minHeight: 180, background: C.bgCard2,
            border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
            color: C.text, fontSize: 14, fontFamily: "inherit", resize: "vertical",
            outline: "none", boxSizing: "border-box",
          }}
        />
        <button
          onClick={onClose}
          style={{
            marginTop: 16, width: "100%",
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
            border: "none", borderRadius: 14, padding: 16,
            color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >
          ✅ Completar Ejercicio
        </button>
      </div>
    );
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)", display: "flex",
      alignItems: "flex-end", justifyContent: "center",
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.bg, borderRadius: "24px 24px 0 0",
        width: "100%", maxWidth: 480, maxHeight: "90vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        border: `1px solid ${C.border}`,
        animation: "slideUp 0.3s ease",
      }}>
        {/* Header del modal */}
        <div style={{
          padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${tool.color}22`, border: `1px solid ${tool.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>
            {tool.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <h3 style={{ color: C.text, fontSize: 16, fontWeight: 800, margin: 0 }}>{tool.name}</h3>
              {tool.premium && <PremiumBadge />}
            </div>
            <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>{tool.category}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.bgCard2, border: `1px solid ${C.border}`,
              borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
              color: C.textMuted, fontSize: 18, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        {/* Contenido scrollable */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {renderToolContent()}
        </div>
      </div>
    </div>
  );
}

// ─── PANTALLA: ESCALA EMOCIONAL (modal completo) ──────────────────────────────
function EmotionalScaleModal({ onClose }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.9)", display: "flex",
      alignItems: "flex-end", justifyContent: "center",
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.bg, borderRadius: "24px 24px 0 0",
        width: "100%", maxWidth: 480, maxHeight: "85vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ color: C.text, fontSize: 18, fontWeight: 800, margin: 0 }}>🌡️ Escala Emocional</h3>
            <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Abraham-Hicks — Toca tu nivel actual</p>
          </div>
          <button onClick={onClose} style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: C.textMuted, fontSize: 18 }}>×</button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 20px 30px" }}>
          {EMOTIONAL_SCALE.map(e => (
            <button
              key={e.level}
              onClick={() => setSelected(e.level === selected ? null : e.level)}
              style={{
                width: "100%", background: selected === e.level ? `${e.color}22` : C.bgCard,
                border: `1px solid ${selected === e.level ? e.color : C.border}`,
                borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
                textAlign: "left", transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18 }}>{e.emoji}</span>
              <div style={{ flex: 1 }}>
                <span style={{ color: selected === e.level ? e.color : C.text, fontSize: 13, fontWeight: selected === e.level ? 700 : 400 }}>
                  {e.name}
                </span>
              </div>
              <span style={{ color: C.textDim, fontSize: 11, fontWeight: 700 }}>#{e.level}</span>
            </button>
          ))}
          {selected && (
            <Card style={{ marginTop: 8, background: `${C.purple}22`, border: `1px solid ${C.purple}55` }}>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Estás en el nivel <strong style={{ color: C.purple }}>#{selected}</strong>. Para subir en la escala, busca un pensamiento que se sienta <em>ligeramente mejor</em>. No intentes saltar directamente a la alegría — cada paso cuenta.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeTool, setActiveTool] = useState(null);
  const [showEmotionalScale, setShowEmotionalScale] = useState(false);

  const handleOpenTool = (toolId) => {
    setActiveTool(toolId);
  };

  const handleCloseTool = () => {
    setActiveTool(null);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home": return <HomeScreen onNavigate={setActiveTab} onOpenTool={handleOpenTool} />;
      case "tools": return <ToolsScreen onOpenTool={handleOpenTool} />;
      case "journal": return <JournalScreen />;
      case "goals": return <GoalsScreen />;
      case "coach": return <CoachScreen />;
      default: return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column",
        minHeight: "100vh", position: "relative",
        background: C.bg,
      }}>
        {/* Contenido principal */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
          {renderScreen()}
        </div>

        {/* Botón flotante: Escala Emocional */}
        <button
          onClick={() => setShowEmotionalScale(true)}
          style={{
            position: "fixed", right: 16, bottom: 90,
            width: 46, height: 46, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
            border: "none", cursor: "pointer", fontSize: 20,
            boxShadow: `0 4px 20px ${C.purple}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}
          title="Escala Emocional"
        >
          🌡️
        </button>

        {/* Barra de navegación inferior */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: C.bgCard, borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "6px 0 env(safe-area-inset-bottom, 6px)",
          zIndex: 200,
          backdropFilter: "blur(10px)",
        }}>
          {["home", "tools", "journal", "goals", "coach"].map(tab => (
            <NavIcon key={tab} tab={tab} activeTab={activeTab} onClick={setActiveTab} />
          ))}
        </div>

        {/* Modales */}
        {activeTool && <ToolModal toolId={activeTool} onClose={handleCloseTool} />}
        {showEmotionalScale && <EmotionalScaleModal onClose={() => setShowEmotionalScale(false)} />}
      </div>

      {/* Estilos globales */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        button { font-family: inherit; }
        textarea, input { font-family: inherit; }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}