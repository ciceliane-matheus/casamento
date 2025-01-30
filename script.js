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

// Função para buscar o convidado no Firebase
async function searchGuest() {
    const name = document.getElementById("guestSearch").value.trim().toLowerCase();
    const guestInfo = document.getElementById("guestInfo");
    const guestName = document.getElementById("guestName");
    const guestFamily = document.getElementById("guestFamily");

    if (!name) {
        alert("Digite um nome válido!");
        return;
    }

    // Exibe um indicador de carregamento enquanto busca os dados
    guestInfo.innerHTML = "<p>🔍 Buscando...</p>";

    try {
        // Acessa os dados no Firebase
        const snapshot = await database.ref("convidados").once("value");
        const convidados = snapshot.val();

        // Verifica se o nome digitado está na lista
        let foundGuest = null;
        for (const key in convidados) {
            if (convidados[key].nome.toLowerCase() === name) {
                foundGuest = convidados[key];
                break;
            }
        }

        if (foundGuest) {
            guestInfo.innerHTML = `
                <h3>🎉 Olá, ${foundGuest.nome}!</h3>
                <p>${foundGuest.acompanhantes ? "Você está vinculado a: " + foundGuest.acompanhantes.join(", ") : "Você está confirmado(a) individualmente."}</p>
                <button class="confirm-btn" onclick="confirmPresence('${foundGuest.nome}')">Confirmar Presença</button>
            `;
        } else {
            guestInfo.innerHTML = "<p>❌ Nome não encontrado.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar convidados:", error);
        guestInfo.innerHTML = "<p>❌ Erro ao buscar os dados. Tente novamente.</p>";
    }
}

// Função para confirmar a presença
async function confirmPresence(nome) {
    try {
        // Atualiza o status de presença no Firebase
        await database.ref(`convidados/${nome}`).update({ confirmado: true });

        // Mostra uma mensagem de sucesso
        document.getElementById("confirmationModal").innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>✅ Presença Confirmada!</h2>
                <p>Obrigado por confirmar sua presença. Nos vemos no grande dia! 🎉</p>
            </div>
        `;
        document.getElementById("confirmationModal").classList.remove("hidden");
        updateCounter(); // Atualiza o contador após a confirmação
    } catch (error) {
        console.error("Erro ao confirmar presença:", error);
    }
}

// Fecha o modal
function closeModal() {
    document.getElementById("confirmationModal").classList.add("hidden");
}

// Função para contar quantos convidados confirmaram presença
async function updateCounter() {
    try {
        const snapshot = await database.ref("convidados").once("value");
        const convidados = snapshot.val();
        let confirmados = 0;

        for (const key in convidados) {
            if (convidados[key].confirmado) {
                confirmados++;
            }
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
