// Aguarda o carregamento do DOM
document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", function() {
      navMenu.classList.toggle("active");
  });
});

//Script para o Contador
const contadorDate = new Date("2025-04-21T00:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = contadorDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("dias").textContent = days;
    document.getElementById("horas").textContent = hours;
    document.getElementById("minutos").textContent = minutes;
    document.getElementById("segundos").textContent = seconds;
}, 1000);

// Script para o slideshow
const slides = document.querySelectorAll('.slideshow-container img');
let currentSlide = 0;

function showNextSlide() {
    slides[currentSlide].classList.remove('active');

    // Avança para a próxima imagem, voltando ao início se necessário
    currentSlide = (currentSlide + 1) % slides.length;

    // Mostra a próxima imagem
    slides[currentSlide].classList.add('active');
}

// Alterna as imagens a cada 2.5 segundos
setInterval(showNextSlide, 2500);

// Esconde o preloader após o carregamento
window.addEventListener("load", () => {
const preloader = document.getElementById("preloader");

// Adiciona um atraso de 3 segundos (3000ms)
setTimeout(() => {
    const modal = document.getElementById("confirmationModal");
if (modal) {
    modal.classList.add("hidden"); // Evita erro se modal não existir
}
    preloader.classList.add("hidden");
}, 3000); // Tempo em milissegundos
});

// Script para slide cerimonia
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".bl-cr1");
    const prevButton = document.querySelector(".prev-btn");
    const nextButton = document.querySelector(".next-btn");
    const slideContainer = document.querySelector(".paletas-container");

    let currentIndex = 0; // Começa no primeiro slide (Noiva)

    function updateSlidePosition() {
        if (slides.length === 0) return;

        const slideWidth = slides[currentIndex].offsetWidth + 20;
        const containerWidth = slideContainer.offsetWidth;

        const offset = -(currentIndex * slideWidth) + (containerWidth / 2 - slideWidth / 2) + 10;
        slideContainer.style.transform = `translateX(${offset}px)`;

        slides.forEach((slide, index) => {
            slide.classList.remove("active");
            slide.style.transform = `scale(${index === currentIndex ? 1 : 0.85})`;
            slide.style.opacity = index === currentIndex ? "1" : "0.6";
        });

        slides[currentIndex].classList.add("active");
    }

    prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateSlidePosition();
    });

    nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateSlidePosition();
    });

    // Ajustar a posição inicial corretamente após o carregamento completo
    window.addEventListener("load", function () {
        setTimeout(updateSlidePosition, 200); // Pequeno delay para garantir o cálculo correto
    });

    // Também ajustar quando a janela for redimensionada
    window.addEventListener("resize", function () {
        setTimeout(updateSlidePosition, 200);
    });
});

//Confirmação de Presença
document.getElementById("rsvp-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const scriptURL = "https://script.google.com/macros/s/AKfycbyTwUmqqiK_mB4Cy01OENTKmY5n_SNB4MWgv7pBG7iaTq4QW_isHf_VhdazD_UaiqJqAw/exec"; // Substitua pela URL correta
  
    const data = {
      nome: document.getElementById("nome").value,
      presenca: document.getElementById("presenca").value,
      acompanhantes: document.getElementById("acompanhantes").value || "0",
      observacoes: document.getElementById("observacoes").value || ""
    };
  
    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(response => {
      if (response.status === "sucesso") {
        document.getElementById("rsvp-form").reset();
        document.getElementById("mensagem").style.display = "block";
        document.getElementById("mensagem").textContent = "Confirmação enviada com sucesso!";
      } else {
        alert("Erro ao enviar confirmação: " + response.mensagem);
      }
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro ao conectar ao servidor.");
    });
  });  