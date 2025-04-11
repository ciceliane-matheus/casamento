//SLIDE DO BANNER
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  let slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  
  // Clona as extremidades para criar o efeito infinito
  const firstClone = slides[0].cloneNode(true);
  firstClone.classList.add('clone');
  const lastClone = slides[slides.length - 1].cloneNode(true);
  lastClone.classList.add('clone');
  
  // Insere o clone do último slide no início e o clone do primeiro no final
  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);
  
  // Atualiza a lista de slides para incluir os clones
  slides = Array.from(track.children);
  // slides: índice 0 => clone(last)
  // índices 1 a (n) => slides originais
  // último índice => clone(first)
  const originalCount = slides.length - 2;
  
  // Para 3 slides visíveis, definimos que o slide ativo (central) inicial é o de índice 2
  let currentIndex = 5;
  let isAnimating = false;
  
  // Função para atualizar a posição do carrossel e destacar o slide ativo
  function updateSlides(transition = true) {
    // Aplica ou remove a transição para possibilitar o "jump" sem animação
    track.style.transition = transition ? 'transform 0.5s ease' : 'none';
    // Desloca o track para que o slide ativo fique centralizado.
    // Como queremos manter o slide ativo centralizado, usamos a fórmula: translateX( – (currentIndex - 1) * (100/3)% )
    track.style.transform = `translateX(-${(currentIndex - 1) * (100 / 3)}%)`;
    
    // Atualiza o destaque removendo a classe active de todos e adicionando ao slide atual
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentIndex].classList.add('active');
  }
  
  // Função para ir para o próximo slide
  function goToNext() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    updateSlides();
  }
  
  // Função para ir para o slide anterior
  function goToPrev() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    updateSlides();
  }
  
  // Após a transição, reajusta o currentIndex se estiver em um clone para efetuar o looping perfeito
  track.addEventListener('transitionend', () => {
    // Se estiver no clone do último slide (primeiro elemento)
    if (currentIndex === 0) {
      currentIndex = slides.length - 2; // último slide original
      updateSlides(false); // Atualiza sem transição para o jump imperceptível
    } 
    // Se estiver no clone do primeiro slide (último elemento)
    else if (currentIndex === slides.length - 1) {
      currentIndex = 1; // primeiro slide original
      updateSlides(false);
    }
    isAnimating = false;
  });
  
  // Configura os event listeners para os botões; sem reiniciar um timer de auto slide (opção removida)
  function setupEventListeners() {
    nextBtn.addEventListener('click', () => {
      goToNext();
    });
  
    prevBtn.addEventListener('click', () => {
      goToPrev();
    });
  }
  
  // Inicializa o carrossel
  function init() {
    updateSlides(false); // posiciona o slide central sem transição
    setupEventListeners();
  }
  
  init();
});

//CONTADOR
document.addEventListener('DOMContentLoaded', function() {
  // Data final para o contador (21/04/2025 às 16h - Manaus, UTC-4)
  const countDownDate = new Date("2025-04-21T16:00:00-04:00").getTime();
  
  // Seleciona os elementos do contador e o título
  const diasElement = document.getElementById("dias");
  const horasElement = document.getElementById("horas");
  const minutosElement = document.getElementById("minutos");
  const segundosElement = document.getElementById("segundos");
  const tituloContagem = document.querySelector(".titulo-contagem");
  
  // Atualiza o contador a cada segundo
  const interval = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    // Se o tempo acabou...
    if (distance < 0) {
      clearInterval(interval);
      // Zera os valores exibidos
      diasElement.textContent = "0";
      horasElement.textContent = "0";
      minutosElement.textContent = "0";
      segundosElement.textContent = "0";
      
      // Atualiza o título: substitui "CONTAGEM REGRESSIVA" por "O evento começou"
      if (tituloContagem) {
        tituloContagem.textContent = "O EVENTO COMEÇOU!";
      }
      
      return;
    }
    
    // Cálculos para dias, horas, minutos e segundos restantes
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Atualiza os elementos do contador
    diasElement.textContent = days;
    horasElement.textContent = hours;
    minutosElement.textContent = minutes;
    segundosElement.textContent = seconds;
  }, 1000);
});

//menu-mobile
let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay = document.getElementById('overlay-menu')

btnMenu.addEventListener('click', ()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})