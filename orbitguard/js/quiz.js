/* ==============================================
   OrbitGuard — quiz.js
   Contém: Slideshow · Quiz · Troca de tema
   Autoras: Gabriella Viana Lisbôa · Isadora Basso Asseiro
============================================== */


/* ============================================
   SLIDESHOW
============================================ */

let slideAtual = 0;
const slides = document.querySelectorAll(".slide");
const dots   = document.querySelectorAll(".dot");

// Mostra o slide de acordo com o índice
function mostrarSlide(index) {
  // Garante que o índice fique entre 0 e o total de slides
  if (index >= slides.length) slideAtual = 0;
  if (index < 0)              slideAtual = slides.length - 1;

  // Remove a classe active de todos e adiciona só no atual
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d   => d.classList.remove("active"));

  slides[slideAtual].classList.add("active");
  dots[slideAtual].classList.add("active");
}

// Avança ou volta um slide (-1 ou +1)
function moverSlide(direcao) {
  slideAtual += direcao;
  mostrarSlide(slideAtual);
}

// Vai direto para um slide ao clicar na bolinha
function irParaSlide(index) {
  slideAtual = index;
  mostrarSlide(slideAtual);
}

// Troca automaticamente a cada 4 segundos
setInterval(() => {
  slideAtual++;
  mostrarSlide(slideAtual);
}, 4000);


/* ============================================
   QUIZ — 10 perguntas sobre o tema
============================================ */

const perguntas = [
  {
    pergunta: "Qual agência espacial disponibiliza dados gratuitos de eventos naturais como queimadas e enchentes?",
    opcoes: ["SpaceX", "NASA", "ESA", "INPE"],
    correta: 1,
  },
  {
    pergunta: "O OrbitGuard utiliza dados de qual tipo de tecnologia para monitorar o clima?",
    opcoes: ["Câmeras de rua", "Satélites e sensores IoT", "Drones particulares", "Estações de rádio"],
    correta: 1,
  },
  {
    pergunta: "Qual das opções NÃO é um tipo de desastre natural monitorado pelo OrbitGuard?",
    opcoes: ["Queimadas", "Enchentes", "Eruções vulcânicas", "Secas"],
    correta: 2,
  },
  {
    pergunta: "Qual é o principal público-alvo do OrbitGuard?",
    opcoes: ["Apenas empresas privadas", "Agricultores, Defesa Civil e Comunidades", "Só pesquisadores científicos", "Apenas o governo federal"],
    correta: 1,
  },
  {
    pergunta: "O que significa a sigla IoT?",
    opcoes: ["Imagens of Technology", "Internet of Things", "Index of Terrain", "Input of Tasks"],
    correta: 1,
  },
  {
    pergunta: "Qual linguagem de programação é usada no back-end do OrbitGuard para processar dados climáticos?",
    opcoes: ["Java", "C#", "Python", "Ruby"],
    correta: 2,
  },
  {
    pergunta: "Qual microcontrolador é usado como sensor IoT no projeto OrbitGuard?",
    opcoes: ["Raspberry Pi", "Arduino", "ESP8266", "NodeMCU"],
    correta: 1,
  },
  {
    pergunta: "Quando a temperatura está acima de 35°C e a umidade abaixo de 30%, o OrbitGuard identifica risco de:",
    opcoes: ["Enchente", "Deslizamento", "Seca ou queimada", "Ciclone"],
    correta: 2,
  },
  {
    pergunta: "A API Open-Meteo fornece quais dados para o OrbitGuard?",
    opcoes: ["Fotos de satélite", "Temperatura, umidade e precipitação", "Dados populacionais", "Preço de commodities agrícolas"],
    correta: 1,
  },
  {
    pergunta: "Qual ODS (Objetivo de Desenvolvimento Sustentável) da ONU está mais diretamente ligado ao OrbitGuard?",
    opcoes: ["ODS 4 — Educação de qualidade", "ODS 13 — Ação climática", "ODS 8 — Trabalho digno", "ODS 16 — Paz e justiça"],
    correta: 1,
  },
];

let perguntaAtual  = 0;
let pontuacao      = 0;
let respondeu      = false; // impede clicar duas vezes na mesma pergunta

// Inicializa o quiz mostrando a primeira pergunta
function iniciarQuiz() {
  perguntaAtual = 0;
  pontuacao     = 0;
  respondeu     = false;

  document.getElementById("quiz-area").style.display     = "block";
  document.getElementById("quiz-resultado").style.display = "none";

  mostrarPergunta();
}

// Renderiza a pergunta e as opções no HTML
function mostrarPergunta() {
  const dados = perguntas[perguntaAtual];
  respondeu   = false;

  // Atualiza número e barra de progresso
  document.getElementById("quiz-num").textContent =
    `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

  const pct = ((perguntaAtual + 1) / perguntas.length) * 100;
  document.getElementById("barra-fill").style.width = `${pct}%`;

  // Texto da pergunta
  document.getElementById("quiz-pergunta").textContent = dados.pergunta;

  // Feedback e botão próxima resetados
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-feedback").className   = "quiz-feedback";
  document.getElementById("btn-proxima").style.display = "none";

  // Gera os botões de opção
  const opcoesCont = document.getElementById("quiz-opcoes");
  opcoesCont.innerHTML = "";

  dados.opcoes.forEach((texto, index) => {
    const btn = document.createElement("button");
    btn.className   = "opcao-btn";
    btn.textContent = texto;
    btn.onclick     = () => verificarResposta(index, btn);
    opcoesCont.appendChild(btn);
  });
}

// Verifica se a resposta está certa ou errada
function verificarResposta(indexEscolhido, btnClicado) {
  if (respondeu) return; // bloqueia clique duplo
  respondeu = true;

  const dados      = perguntas[perguntaAtual];
  const feedback   = document.getElementById("quiz-feedback");
  const todasOpcoes = document.querySelectorAll(".opcao-btn");

  // Destaca a opção correta sempre
  todasOpcoes[dados.correta].classList.add("correta");

  if (indexEscolhido === dados.correta) {
    pontuacao++;
    btnClicado.classList.add("correta");
    feedback.textContent = "✅ Correto!";
    feedback.classList.add("feedback-ok");
  } else {
    btnClicado.classList.add("errada");
    feedback.textContent = `❌ Errado! A resposta correta era: "${dados.opcoes[dados.correta]}"`;
    feedback.classList.add("feedback-erro");
  }

  // Desabilita todos os botões após responder
  todasOpcoes.forEach(btn => btn.disabled = true);

  // Mostra botão de próxima pergunta
  document.getElementById("btn-proxima").style.display = "inline-block";
}

// Avança para a próxima pergunta ou mostra o resultado
function proximaPergunta() {
  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
}

// Mostra a tela de resultado final
function mostrarResultado() {
  document.getElementById("quiz-area").style.display      = "none";
  document.getElementById("quiz-resultado").style.display = "block";

  const total = perguntas.length;
  let emoji, titulo, texto;

  if (pontuacao === total) {
    emoji  = "🏆";
    titulo = "Perfeito! Você é um especialista!";
    texto  = `Você acertou todas as ${total} perguntas. Incrível!`;
  } else if (pontuacao >= total * 0.7) {
    emoji  = "🌟";
    titulo = "Muito bem!";
    texto  = `Você acertou ${pontuacao} de ${total} perguntas. Ótimo resultado!`;
  } else if (pontuacao >= total * 0.4) {
    emoji  = "📚";
    titulo = "Bom esforço!";
    texto  = `Você acertou ${pontuacao} de ${total} perguntas. Continue estudando!`;
  } else {
    emoji  = "💪";
    titulo = "Continue tentando!";
    texto  = `Você acertou ${pontuacao} de ${total} perguntas. Que tal jogar de novo?`;
  }

  document.getElementById("resultado-emoji").textContent  = emoji;
  document.getElementById("resultado-titulo").textContent = titulo;
  document.getElementById("resultado-texto").textContent  = texto;

  // Atualiza a barra para 100%
  document.getElementById("barra-fill").style.width = "100%";
  document.getElementById("quiz-num").textContent   = `Resultado: ${pontuacao}/${total}`;
}

// Reinicia o quiz do zero
function reiniciarQuiz() {
  iniciarQuiz();
}

// Inicia o quiz quando a página carrega
iniciarQuiz();


/* ============================================
   TROCA DE TEMA
============================================ */

function trocarTema(tema) {
  const root = document.documentElement;

  // Remove active de todos os botões e adiciona no clicado
  document.querySelectorAll(".tema-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tema-${tema}`).classList.add("active");

  // Troca as variáveis CSS de acordo com o tema escolhido
  if (tema === "verde") {
    root.style.setProperty("--green",       "#1a7a5e");
    root.style.setProperty("--green-dark",  "#085041");
    root.style.setProperty("--green-light", "#E1F5EE");
    root.style.setProperty("--bg",          "#f3f5f3");
    root.style.setProperty("--bg-alt",      "#eaf0ea");
  }

  if (tema === "azul") {
    root.style.setProperty("--green",       "#185FA5");
    root.style.setProperty("--green-dark",  "#0C3D70");
    root.style.setProperty("--green-light", "#E6F1FB");
    root.style.setProperty("--bg",          "#f0f4f8");
    root.style.setProperty("--bg-alt",      "#e8eef5");
  }

  if (tema === "bege") {
    root.style.setProperty("--green",       "#8a6a1a");
    root.style.setProperty("--green-dark",  "#5c4510");
    root.style.setProperty("--green-light", "#FDF5E6");
    root.style.setProperty("--bg",          "#faf6ee");
    root.style.setProperty("--bg-alt",      "#f5efe2");
  }
}
