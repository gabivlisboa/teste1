/* ==============================================
   OrbitGuard — plataforma.js
   Integração: Open-Meteo (clima) + NASA EONET (eventos naturais)
   Autoras: Gabriella Viana Lisbôa · Isadora Basso Asseiro
============================================== */

// ── 1. ESTADO GLOBAL ──────────────────────────────────────
let perfilSelecionado = null;

// ── 2. COORDENADAS DOS ESTADOS ────────────────────────────
const COORDS = {
  "Acre":               { lat: -9.97,  lon: -67.81 },
  "Alagoas":            { lat: -9.57,  lon: -36.78 },
  "Amapá":              { lat: 0.90,   lon: -52.00 },
  "Amazonas":           { lat: -3.47,  lon: -65.10 },
  "Bahia":              { lat: -12.97, lon: -41.33 },
  "Ceará":              { lat: -5.20,  lon: -39.53 },
  "Distrito Federal":   { lat: -15.78, lon: -47.93 },
  "Espírito Santo":     { lat: -19.19, lon: -40.34 },
  "Goiás":              { lat: -15.83, lon: -49.83 },
  "Maranhão":           { lat: -5.42,  lon: -45.44 },
  "Mato Grosso":        { lat: -12.64, lon: -55.42 },
  "Mato Grosso do Sul": { lat: -20.51, lon: -54.54 },
  "Minas Gerais":       { lat: -18.10, lon: -44.38 },
  "Pará":               { lat: -3.79,  lon: -52.48 },
  "Paraíba":            { lat: -7.24,  lon: -36.78 },
  "Paraná":             { lat: -24.89, lon: -51.55 },
  "Pernambuco":         { lat: -8.38,  lon: -37.86 },
  "Piauí":              { lat: -7.72,  lon: -42.73 },
  "Rio de Janeiro":     { lat: -22.91, lon: -43.17 },
  "Rio Grande do Norte":{ lat: -5.81,  lon: -36.59 },
  "Rio Grande do Sul":  { lat: -30.17, lon: -53.50 },
  "Rondônia":           { lat: -11.22, lon: -62.80 },
  "Roraima":            { lat: 2.72,   lon: -62.08 },
  "Santa Catarina":     { lat: -27.45, lon: -50.95 },
  "São Paulo":          { lat: -23.55, lon: -46.63 },
  "Sergipe":            { lat: -10.57, lon: -37.45 },
  "Tocantins":          { lat: -10.25, lon: -48.25 },
};

// ── 3. RECOMENDAÇÕES POR PERFIL E SITUAÇÃO ────────────────
const RECOS = {
  agricultor: {
    seca: {
      badge:   "🌵 Risco de seca — Alto",
      classe:  "badge-alto",
      recos: [
        { emoji: "💧", texto: "Iniciar irrigação preventiva nos próximos dias" },
        { emoji: "🌱", texto: "Usar cobertura morta para reter umidade do solo" },
        { emoji: "📊", texto: "Monitorar umidade do solo a cada 6 horas" },
      ],
      medidas: [
        { texto: "💧 Irrigar lavoura",    urgente: true },
        { texto: "🌿 Mulching",           urgente: false },
        { texto: "📡 Monitorar sensores", urgente: false },
        { texto: "🔔 Ativar alertas",     urgente: false },
      ],
    },
    enchente: {
      badge:   "🌧️ Risco de enchente — Médio",
      classe:  "badge-medio",
      recos: [
        { emoji: "🚜", texto: "Evitar maquinário pesado em áreas encharcadas" },
        { emoji: "🌾", texto: "Verificar drenagem nas bordas das lavouras" },
        { emoji: "📋", texto: "Registrar perdas para acionar seguro rural" },
      ],
      medidas: [
        { texto: "🚜 Suspender colheita", urgente: true },
        { texto: "🌊 Checar drenagem",    urgente: true },
        { texto: "📋 Acionar seguro",     urgente: false },
        { texto: "📡 Monitorar chuvas",   urgente: false },
      ],
    },
    normal: {
      badge:   "✅ Condições estáveis",
      classe:  "badge-baixo",
      recos: [
        { emoji: "📱", texto: "Ativar notificações para alertas da sua região" },
        { emoji: "📅", texto: "Acompanhar a previsão dos próximos 7 dias" },
        { emoji: "🌡️", texto: "Registrar temperaturas para histórico da safra" },
      ],
      medidas: [
        { texto: "✅ Condições ok",        urgente: false },
        { texto: "📡 Monitorar",           urgente: false },
        { texto: "📋 Planejar safra",      urgente: false },
        { texto: "🔔 Alertas ativos",      urgente: false },
      ],
    },
  },

  defesa: {
    seca: {
      badge:   "🔥 Risco de queimada — Alto",
      classe:  "badge-alto",
      recos: [
        { emoji: "🔥", texto: "Proibir queimadas e uso de fogo em propriedades rurais" },
        { emoji: "🚒", texto: "Posicionar equipes de combate a incêndio em prontidão" },
        { emoji: "📡", texto: "Monitorar focos via satélite a cada 30 minutos" },
      ],
      medidas: [
        { texto: "🔥 Proibir queimadas", urgente: true },
        { texto: "🚒 Brigadistas",       urgente: true },
        { texto: "🚁 Sobrevoo",          urgente: false },
        { texto: "📡 Satélite ativo",    urgente: false },
      ],
    },
    enchente: {
      badge:   "🚨 Risco de enchente — Crítico",
      classe:  "badge-alto",
      recos: [
        { emoji: "🚨", texto: "Acionar equipes de evacuação nas zonas de risco" },
        { emoji: "📡", texto: "Emitir alerta sonoro nas regiões afetadas" },
        { emoji: "🏥", texto: "Ativar abrigos de emergência municipais" },
      ],
      medidas: [
        { texto: "🚨 Evacuar áreas",  urgente: true },
        { texto: "📢 Emitir alertas", urgente: true },
        { texto: "🏥 Abrir abrigos",  urgente: true },
        { texto: "🗺️ Bloquear rotas", urgente: false },
      ],
    },
    normal: {
      badge:   "✅ Sem alertas críticos",
      classe:  "badge-baixo",
      recos: [
        { emoji: "📋", texto: "Manter equipes de plantão para respostas rápidas" },
        { emoji: "🗺️", texto: "Atualizar mapeamento de áreas de risco" },
        { emoji: "📡", texto: "Verificar funcionamento dos sensores de campo" },
      ],
      medidas: [
        { texto: "✅ Plantão ativo",   urgente: false },
        { texto: "📡 Sensores ok",     urgente: false },
        { texto: "🗺️ Mapas atualizados", urgente: false },
        { texto: "📞 Canal aberto",    urgente: false },
      ],
    },
  },

  comunidade: {
    seca: {
      badge:   "⚠️ Onda de calor — Atenção",
      classe:  "badge-medio",
      recos: [
        { emoji: "💧", texto: "Beba bastante água e evite exposição ao sol no pico do calor" },
        { emoji: "🏠", texto: "Mantenha janelas fechadas durante o dia e abertas à noite" },
        { emoji: "📞", texto: "Verifique vizinhos idosos e crianças com frequência" },
      ],
      medidas: [
        { texto: "💧 Hidratar-se",         urgente: true },
        { texto: "🏠 Ficar em local fresco", urgente: true },
        { texto: "📱 Alertas ativos",       urgente: false },
        { texto: "📞 Apoiar vizinhos",      urgente: false },
      ],
    },
    enchente: {
      badge:   "🌊 Risco de alagamento — Médio",
      classe:  "badge-medio",
      recos: [
        { emoji: "🏠", texto: "Evite áreas de encosta e baixadas alagáveis" },
        { emoji: "📱", texto: "Mantenha celular carregado para receber alertas" },
        { emoji: "🚗", texto: "Não tente atravessar ruas alagadas de carro" },
      ],
      medidas: [
        { texto: "🏠 Ficar em casa",     urgente: true },
        { texto: "📱 Alertas ativos",    urgente: true },
        { texto: "🚗 Evitar sair",       urgente: false },
        { texto: "📞 Defesa Civil",      urgente: false },
      ],
    },
    normal: {
      badge:   "✅ Situação estável",
      classe:  "badge-baixo",
      recos: [
        { emoji: "📱", texto: "Ative notificações para alertas da sua região" },
        { emoji: "🗂️", texto: "Mantenha um kit de emergência em casa" },
        { emoji: "🏠", texto: "Identifique as rotas de evacuação do seu bairro" },
      ],
      medidas: [
        { texto: "✅ Tudo estável",        urgente: false },
        { texto: "📱 Alertas ligados",     urgente: false },
        { texto: "🗂️ Kit emergência",      urgente: false },
        { texto: "📞 Salvar contatos",     urgente: false },
      ],
    },
  },
};

// Ícone e subtítulo por perfil
const PERFIS_INFO = {
  agricultor: { icon: "🌾", nome: "Agricultor",    sub: "Planeja e protege sua produção" },
  defesa:     { icon: "🛡️", nome: "Defesa Civil",  sub: "Previne e protege vidas" },
  comunidade: { icon: "🏘️", nome: "Comunidade",    sub: "Informações para sua segurança" },
};

// ── 4. SELEÇÃO DE PERFIL ──────────────────────────────────
document.querySelectorAll(".perfil-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".perfil-card").forEach(c => c.classList.remove("selecionado"));
    card.classList.add("selecionado");
    perfilSelecionado = card.dataset.perfil;
  });
});

// ── 5. BOTÃO "VER ALERTAS" ────────────────────────────────
async function verAlertas() {
  const estado = document.getElementById("select-estado").value;
  const erroMsg = document.getElementById("erro-msg");

  // Validação
  if (!perfilSelecionado || !estado) {
    erroMsg.style.display = "block";
    return;
  }
  erroMsg.style.display = "none";

  // Preencher cabeçalho do dashboard
  const info = PERFIS_INFO[perfilSelecionado];
  document.getElementById("dash-icon").textContent       = info.icon;
  document.getElementById("dash-perfil-nome").textContent = info.nome;
  document.getElementById("dash-perfil-sub").textContent  = info.sub;
  document.getElementById("dash-estado-nome").textContent = estado;

  // Mostrar tela 2
  document.getElementById("tela-onboarding").classList.remove("active");
  const telaDash = document.getElementById("tela-dashboard");
  telaDash.classList.add("active");

  // Mostrar loading, esconder conteúdo
  document.getElementById("loading-clima").style.display  = "flex";
  document.getElementById("dash-conteudo").style.display  = "none";

  try {
    // Buscar dados das APIs em paralelo
    const [clima, eventos] = await Promise.all([
      buscarClima(estado),
      buscarEventosNASA(),
    ]);

    // Determinar situação com base nos dados
    const situacao = determinarSituacao(clima, eventos, perfilSelecionado);

    // Preencher a interface
    preencherDashboard(clima, situacao, perfilSelecionado);

  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    // Fallback com dados indicativos
    preencherFallback(perfilSelecionado);
  }
}

// ── 6. API OPEN-METEO — CLIMA ─────────────────────────────
async function buscarClima(estado) {
  const coord = COORDS[estado];
  if (!coord) throw new Error("Estado não encontrado");

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coord.lat}&longitude=${coord.lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation` +
    `&timezone=America%2FSao_Paulo`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha na API Open-Meteo");

  const data = await res.json();
  const c    = data.current;

  return {
    temp:    Math.round(c.temperature_2m),
    umidade: Math.round(c.relative_humidity_2m),
    chuva:   Math.round(c.precipitation * 10) / 10,
  };
}

// ── 7. API NASA EONET — EVENTOS NATURAIS ──────────────────
async function buscarEventosNASA() {
  // Bounding box do Brasil: Sul-Norte (-34 a 5), Oeste-Leste (-73 a -35)
  const url =
    `https://eonet.gsfc.nasa.gov/api/v3/events` +
    `?status=open&bbox=-73,-34,-35,5`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha na API NASA EONET");

  const data   = await res.json();
  const events = data.events || [];

  return {
    queimadas: events.filter(e =>
      e.categories.some(c => c.id === "wildfires")
    ).length,
    enchentes: events.filter(e =>
      e.categories.some(c => c.id === "floods")
    ).length,
    secas: events.filter(e =>
      e.categories.some(c => c.id === "droughts")
    ).length,
  };
}

// ── 8. LÓGICA DE SITUAÇÃO ─────────────────────────────────
function determinarSituacao(clima, eventos, perfil) {
  const { temp, umidade, chuva } = clima;

  // Critérios baseados nos dados climáticos + eventos NASA
  const riscoSeca =
    (temp > 33 && umidade < 35) ||
    (eventos.queimadas > 0 && umidade < 40);

  const riscoEnchente =
    (chuva > 20) ||
    (umidade > 85 && chuva > 5) ||
    (eventos.enchentes > 0);

  if (riscoSeca)     return "seca";
  if (riscoEnchente) return "enchente";
  return "normal";
}

// ── 9. PREENCHER DASHBOARD ────────────────────────────────
function preencherDashboard(clima, situacao, perfil) {
  // Chips de clima
  document.getElementById("chip-temp").textContent  = `${clima.temp}°C`;
  document.getElementById("chip-umid").textContent  = `${clima.umidade}% umid.`;
  document.getElementById("chip-chuva").textContent = `${clima.chuva}mm/dia`;

  // Badge de situação
  const dados   = RECOS[perfil][situacao];
  const badge   = document.getElementById("badge-situacao");
  badge.textContent = dados.badge;
  badge.className   = `badge-situacao ${dados.classe}`;

  // Recomendações
  const recosBox = document.getElementById("recos-box");
  recosBox.innerHTML = dados.recos.map(r =>
    `<div class="reco-item">
      <span class="reco-emoji">${r.emoji}</span>
      <span>${r.texto}</span>
    </div>`
  ).join("");

  // Medidas
  const medidasGrid = document.getElementById("medidas-grid");
  medidasGrid.innerHTML = dados.medidas.map(m =>
    `<div class="medida-chip ${m.urgente ? "medida-urgente" : "medida-normal"}">
      ${m.texto}
    </div>`
  ).join("");

  // Esconder loading, mostrar conteúdo
  document.getElementById("loading-clima").style.display = "none";
  document.getElementById("dash-conteudo").style.display = "flex";
}

// ── 10. FALLBACK (se API falhar) ──────────────────────────
function preencherFallback(perfil) {
  // Usa dados estimados e situação padrão por perfil
  const climaEstimado = { temp: 28, umidade: 55, chuva: 5 };
  preencherDashboard(climaEstimado, "normal", perfil);
  console.warn("APIs indisponíveis. Exibindo dados estimados.");
}

// ── 11. VOLTAR PARA ONBOARDING ────────────────────────────
function voltar() {
  document.getElementById("tela-dashboard").classList.remove("active");
  document.getElementById("tela-onboarding").classList.add("active");
}
