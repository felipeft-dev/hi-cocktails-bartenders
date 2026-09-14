const WHATSAPP_NUMBER = "5567998567418";

const DRINKS_INCLUDED = 3;
const EXTRA_DRINK_PRICE = 4; // R$ por pessoa, por drink além dos inclusos

const state = {
  pessoas: 100,
  horas: 5,
  tier: "Clássica",
  drinks: new Set(["Caipirinha", "Moscow Mule", "Gin Tônica"])
};

const testis = [
  {
    quote: "“O bar foi um dos pontos altos do casamento. Os drinks fizeram sucesso do início ao fim, e a equipe se antecipou a tudo o que precisávamos.”",
    who: "Camila e Rafael, casamento em outubro"
  },
  {
    quote: "“Contratamos para os 15 anos da minha filha e o retorno dos convidados foi só elogio. Bar bonito, drinks equilibrados e time super atencioso.”",
    who: "Marta, aniversário de 15 anos"
  },
  {
    quote: "“Serviço pontual do início ao fim, sem nenhum imprevisto na formatura. Recomendo para quem quer tranquilidade no dia do evento.”",
    who: "Diego, formatura de Direito"
  }
];
let testiIndex = 0;

function toggleMenu(){
  document.getElementById('navlinks').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('navlinks').classList.remove('open');
}

function showView(view){
  document.getElementById('view-home').style.display = view === 'home' ? 'block' : 'none';
  document.getElementById('view-orcamento').style.display = view === 'orcamento' ? 'block' : 'none';
  window.scrollTo(0, 0);
  closeMenu();
  if(view === 'orcamento'){ calcular(); }
}

function ajustarPessoas(delta){
  state.pessoas = Math.max(20, state.pessoas + delta);
  document.getElementById('pessoasVal').textContent = state.pessoas;
  calcular();
}

function ajustarHoras(delta){
  state.horas = Math.max(2, state.horas + delta);
  document.getElementById('horasVal').textContent = state.horas;
  calcular();
}

function toggleDrink(name, el){
  if(state.drinks.has(name)){
    if(state.drinks.size <= 1) return; // mantém ao menos 1 drink escolhido
    state.drinks.delete(name);
    el.classList.remove('active');
  } else {
    state.drinks.add(name);
    el.classList.add('active');
  }
  calcular();
}

function setTier(tier, el){
  state.tier = tier;
  document.querySelectorAll('.tier').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  calcular();
}

function calcular(){
  const evento = document.getElementById('tipoEvento').value;
  const basePerPerson = state.tier === 'Premium' ? 27 : 19;
  const extraHours = Math.max(0, state.horas - 4);
  const extraDrinks = Math.max(0, state.drinks.size - DRINKS_INCLUDED);

  let total = state.pessoas * basePerPerson;
  total += extraHours * state.pessoas * 1.5;
  total += extraDrinks * state.pessoas * EXTRA_DRINK_PRICE;

  const low = Math.round(total * 0.94 / 10) * 10;
  const high = Math.round(total * 1.14 / 10) * 10;

  document.getElementById('resEvento').textContent = evento;
  document.getElementById('resPessoas').textContent = state.pessoas;
  document.getElementById('resHoras').textContent = state.horas + ' horas';
  document.getElementById('resTier').textContent = state.tier;
  document.getElementById('resDrinks').textContent =
    state.drinks.size + (state.drinks.size === 1 ? ' drink' : ' drinks');

  const estimateEl = document.getElementById('resEstimate');
  estimateEl.textContent =
    'R$ ' + low.toLocaleString('pt-BR') + ' – R$ ' + high.toLocaleString('pt-BR');
  estimateEl.classList.remove('pulse');
  // reflow before re-adding the class so the animation can retrigger
  void estimateEl.offsetWidth;
  estimateEl.classList.add('pulse');

  atualizarWhatsapp(evento, low, high);
}

function atualizarWhatsapp(evento, low, high){
  const nome = document.getElementById('nome').value.trim();
  const data = document.getElementById('data').value.trim();
  const cidade = document.getElementById('cidade').value.trim();

  let msg = 'Olá! Gostaria de solicitar um orçamento para meu evento.\n\n';
  if(nome) msg += 'Nome: ' + nome + '\n';
  msg += 'Evento: ' + evento + '\n';
  msg += 'Convidados: ' + state.pessoas + '\n';
  msg += 'Duração: ' + state.horas + ' horas\n';
  msg += 'Experiência: ' + state.tier + '\n';
  msg += 'Drinks: ' + Array.from(state.drinks).join(', ') + '\n';
  if(data) msg += 'Data: ' + data + '\n';
  if(cidade) msg += 'Cidade/local: ' + cidade + '\n';
  msg += 'Estimativa: R$ ' + low.toLocaleString('pt-BR') + ' - R$ ' + high.toLocaleString('pt-BR');

  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
  document.getElementById('whatsBtn').setAttribute('href', url);
}

function changeTesti(dir){
  const content = document.getElementById('testiContent');
  content.classList.add('fade');
  setTimeout(() => {
    testiIndex = (testiIndex + dir + testis.length) % testis.length;
    document.getElementById('testi-quote').textContent = testis[testiIndex].quote;
    document.getElementById('testi-who').textContent = testis[testiIndex].who;
    content.classList.remove('fade');
  }, 220);
}

function onScroll(){
  const header = document.querySelector('header');
  if(window.scrollY > 12){
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function init(){
  // Navigation into the calculator view
  document.getElementById('navQuoteBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showView('orcamento');
  });
  document.getElementById('heroQuoteBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showView('orcamento');
  });
  document.getElementById('finalQuoteBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showView('orcamento');
  });
  document.getElementById('backBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showView('home');
  });
  document.getElementById('logoLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('home');
  });

  // Smooth-scroll anchors on the home page
  document.querySelectorAll('.nav-anchor').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      const target = document.querySelector(a.getAttribute('href'));
      if(target){ target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Mobile menu
  document.getElementById('burgerBtn').addEventListener('click', toggleMenu);

  // Header depth on scroll
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Testimonial carousel
  document.getElementById('testiPrev').addEventListener('click', () => changeTesti(-1));
  document.getElementById('testiNext').addEventListener('click', () => changeTesti(1));

  // Calculator controls
  document.getElementById('tipoEvento').addEventListener('change', calcular);
  document.getElementById('pessoasMinus').addEventListener('click', () => ajustarPessoas(-10));
  document.getElementById('pessoasPlus').addEventListener('click', () => ajustarPessoas(10));
  document.getElementById('horasMinus').addEventListener('click', () => ajustarHoras(-1));
  document.getElementById('horasPlus').addEventListener('click', () => ajustarHoras(1));

  document.querySelectorAll('.tier').forEach(el => {
    el.addEventListener('click', () => setTier(el.dataset.tier, el));
  });

  document.querySelectorAll('.drink-card').forEach(el => {
    el.addEventListener('click', () => toggleDrink(el.dataset.drink, el));
  });

  ['nome','data','cidade'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcular);
  });

  showView('home');
}

document.addEventListener('DOMContentLoaded', init);
