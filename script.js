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
    // Oculta a imagem atual
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

// Buscar convidado na lista
const API_URL = "https://script.google.com/macros/s/AKfycbw9bWK428fEX4HBzBACacSpw0AKkSAYSy1C2TbT1BMAStf-Kw6pPetS46Zj-8MaxKh4/exec";  // Substitua pela URL do Web App publicado do Google Apps Script
let convidadosCache = [];

// Exibir sugestões de nomes ao digitar
async function showSuggestions() {
    const input = document.getElementById("guestSearch").value.trim().toLowerCase();
    const suggestionsList = document.getElementById("suggestionsList");

    if (!input) {
        suggestionsList.classList.add("hidden");
        return;
    }

    if (convidadosCache.length === 0) {
        try {
            const response = await fetch(API_URL);
            convidadosCache = await response.json();
        } catch (error) {
            console.error("Erro ao buscar convidados:", error);
            return;
        }
    }

    // Filtrar sugestões
    const filtered = convidadosCache
        .filter(guest => guest.nome.toLowerCase().includes(input))
        .map(guest => `<li onclick="selectSuggestion('${guest.nome}')">${guest.nome}</li>`)
        .join("");

    if (filtered) {
        suggestionsList.innerHTML = filtered;
        suggestionsList.classList.remove("hidden");
    } else {
        suggestionsList.classList.add("hidden");
    }
}

// Preencher campo ao clicar em uma sugestão
function selectSuggestion(name) {
    document.getElementById("guestSearch").value = name;
    document.getElementById("suggestionsList").classList.add("hidden");
}

// Buscar convidado na lista
async function searchGuest() {
    const name = document.getElementById("guestSearch").value.trim();
    const guestInfo = document.getElementById("guestInfo");
    const guestName = document.getElementById("guestName");
    const guestFamily = document.getElementById("guestFamily");
    const loader = document.getElementById("loader");

    if (!name) {
        alert("Digite um nome válido!");
        return;
    }

    loader.classList.remove("hidden"); // Mostrar loader
    guestInfo.classList.add("hidden");

    try {
        const response = await fetch(API_URL);
        const convidados = await response.json();
        const foundGuest = convidados.find(guest => guest.nome.toLowerCase() === name.toLowerCase());

        if (foundGuest) {
            guestInfo.classList.remove("hidden");
            guestName.textContent = `🎉 Olá, ${foundGuest.nome}!`;
            guestFamily.textContent = foundGuest.acompanhantes.length > 0 
                ? `Seu grupo: ${foundGuest.acompanhantes.join(", ")}` 
                : "Você está confirmado(a) individualmente.";
        } else {
            alert("Nome não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar convidados:", error);
        alert("Erro ao conectar-se com o servidor. Tente novamente mais tarde.");
    } finally {
        loader.classList.add("hidden"); // Esconder loader
    }
}

// Confirmar presença
async function confirmPresence() {
    const name = document.getElementById("guestSearch").value.trim();
    if (!name) {
        alert("Busque seu nome primeiro!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?nome=${encodeURIComponent(name)}`);
        const result = await response.json();

        if (result && result.status === "confirmado") {
            document.getElementById("confirmationModal").classList.remove("hidden");
            setTimeout(() => {
                resetSearch();
                updateCounter();
            }, 2000);
        } else {
            alert("Erro ao confirmar presença.");
        }
    } catch (error) {
        console.error("Erro ao confirmar presença:", error);
        alert("Erro ao conectar-se com o servidor. Tente novamente mais tarde.");
    }
}

// Fechar todas as telas e resetar busca
function resetSearch() {
    document.getElementById("guestInfo").classList.add("hidden");
    document.getElementById("confirmationModal").classList.add("hidden");
    document.getElementById("guestSearch").value = "";
}

// Atualizar contador de confirmados
async function updateCounter() {
    try {
        const response = await fetch(API_URL + "?function=getContador");
        const data = await response.json();
        if (data && data.totalConfirmados !== undefined) {
            document.getElementById("guestCounter").textContent = `🎯 Convidados Confirmados: ${data.totalConfirmados}`;
        }
    } catch (error) {
        console.error("Erro ao obter contador:", error);
    }
}

// Atualizar contador ao carregar a página
window.onload = function () {
    updateCounter();
};
