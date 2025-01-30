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

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAI7KFY9-BUsqBVwNAThvxzlnd7Sny5w3Q",
    authDomain: "lista-de-casamento-522c8.firebaseapp.com",
    databaseURL: "https://lista-de-casamento-522c8-default-rtdb.firebaseio.com",
    projectId: "lista-de-casamento-522c8",
    storageBucket: "lista-de-casamento-522c8.appspot.com",
    messagingSenderId: "97679461314",
    appId: "1:97679461314:web:287affb90dfedd71d0e45b"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Exibe sugestões enquanto o usuário digita
function showSuggestions() {
    const input = document.getElementById("guestSearch").value.trim().toLowerCase();
    const suggestionsList = document.getElementById("suggestionsList");

    if (!input) {
        suggestionsList.innerHTML = "";
        suggestionsList.classList.add("hidden");
        return;
    }

    database.ref("convidados").once("value", (snapshot) => {
        const convidados = snapshot.val();
        if (!convidados) return;

        const filteredGuests = Object.values(convidados).filter(guest => 
            guest.nome && guest.nome.toLowerCase().includes(input)
        );

        suggestionsList.innerHTML = "";
        suggestionsList.classList.remove("hidden");

        filteredGuests.forEach(guest => {
            const li = document.createElement("li");
            li.textContent = guest.nome;
            li.onclick = () => {
                document.getElementById("guestSearch").value = guest.nome;
                suggestionsList.innerHTML = "";
                suggestionsList.classList.add("hidden");
            };
            suggestionsList.appendChild(li);
        });
    }).catch(error => {
        console.error("Erro ao buscar sugestões:", error);
    });
}

// Função para buscar convidados no Firebase
async function searchGuest() {
    const name = document.getElementById("guestSearch").value.trim().toLowerCase();
    const guestInfo = document.getElementById("guestInfo");
    const guestName = document.getElementById("guestName");
    const guestFamily = document.getElementById("guestFamily");
    const loader = document.getElementById("loader");

    if (!name) {
        alert("Digite um nome válido!");
        return;
    }

    // Exibe loader durante a busca
    loader.classList.remove("hidden");
    guestInfo.classList.add("hidden");

    try {
        const snapshot = await database.ref("convidados").once("value");
        const convidados = snapshot.val();

        if (!convidados) {
            loader.classList.add("hidden");
            alert("Nenhum convidado cadastrado.");
            return;
        }

        const foundGuest = Object.values(convidados).find(guest => 
            guest.nome && guest.nome.toLowerCase() === name
        );

        loader.classList.add("hidden");

        if (foundGuest) {
            guestInfo.classList.remove("hidden");
            guestName.textContent = `🎉 Olá, ${foundGuest.nome}!`;
            guestFamily.textContent = foundGuest.acompanhantes 
                ? `Seu grupo: ${foundGuest.acompanhantes.join(", ")}` 
                : "Você está confirmado(a) individualmente.";
        } else {
            alert("Nome não encontrado.");
        }
    } catch (error) {
        loader.classList.add("hidden");
        console.error("Erro ao buscar convidados:", error);
        alert("Erro ao conectar-se ao servidor. Verifique sua conexão.");
    }
}

// Função para confirmar a presença
async function confirmPresence() {
    const name = document.getElementById("guestSearch").value.trim();
    if (!name) {
        alert("Busque seu nome primeiro!");
        return;
    }

    try {
        await database.ref(`convidados/${name}`).update({ confirmado: true });

        document.getElementById("confirmationModal").classList.remove("hidden");
        updateCounter();
    } catch (error) {
        console.error("Erro ao confirmar presença:", error);
        alert("Erro ao confirmar presença.");
    }
}

// Fecha o modal e reseta a busca
function resetSearch() {
    document.getElementById("confirmationModal").classList.add("hidden");
    document.getElementById("guestSearch").value = "";
    document.getElementById("guestInfo").classList.add("hidden");
    document.getElementById("suggestionsList").classList.add("hidden");
}

// Atualiza o contador de confirmados
async function updateCounter() {
    try {
        const snapshot = await database.ref("convidados").once("value");
        const convidados = snapshot.val();
        let confirmados = 0;

        for (const key in convidados) {
            if (convidados[key].confirmado) confirmados++;
        }

        document.getElementById("guestCounter").textContent = `🎯 Convidados Confirmados: ${confirmados}`;
    } catch (error) {
        console.error("Erro ao contar convidados confirmados:", error);
    }
}

// Atualiza o contador ao carregar a página
window.onload = function () {
    updateCounter();
};