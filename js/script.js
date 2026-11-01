
// ==========================================
// TESLA BRAZIL - LANDING PAGE
// Main JavaScript
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

// Preço fictício do veículo.
const VEHICLE_PRICE = 299900;

// Substitua pelo número de WhatsApp desejado.
// Formato: código do país + DDD + número.
// Exemplo: 5511999999999
const WHATSAPP_NUMBER = "5511999999999";


// ==========================================
// MENU MOBILE
// ==========================================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

menuToggle.addEventListener("click", () => {

    const isActive = navMenu.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isActive);

});


// Fecha o menu ao selecionar uma seção.

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");

    });

});


// ==========================================
// HEADER AO ROLAR A PÁGINA
// ==========================================

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


// ==========================================
// ANIMAÇÕES DE ENTRADA
// ==========================================

// Seleciona os elementos que receberão animações.

const revealElements = document.querySelectorAll(
    ".section-heading, .spec-card, .technology-image, " +
    ".technology-content, .gallery-item, .price-content, " +
    ".simulator, .contact-form"
);

// Adiciona a classe de animação.

revealElements.forEach(element => {
    element.classList.add("reveal");
});

// Observa quando os elementos entram na tela.

const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.12
});

// Registra os elementos observados.

revealElements.forEach(element => {
    observer.observe(element);
});


// ==========================================
// SIMULADOR DE FINANCIAMENTO
// ==========================================

const entryInput = document.getElementById("entry");
const installmentsInput = document.getElementById("installments");
const interestInput = document.getElementById("interest");

const calculateButton = document.getElementById("calculate");

const monthlyPayment = document.getElementById("monthly-payment");
const totalPayment = document.getElementById("total-payment");


// Formata valores no padrão brasileiro.

function formatCurrency(value) {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

}


// Calcula o valor das parcelas.

function calculateFinancing() {

    const entry = Number(entryInput.value);
    const installments = Number(installmentsInput.value);
    const interest = Number(interestInput.value) / 100;

    // Validação dos dados.

    if (
        !Number.isFinite(entry) ||
        !Number.isFinite(installments) ||
        !Number.isFinite(interest) ||
        entry < 0 ||
        entry >= VEHICLE_PRICE ||
        interest < 0 ||
        interest > 0.10 ||
        installments <= 0
    ) {

        monthlyPayment.textContent = "Dados inválidos";

        totalPayment.textContent =
            "Verifique a entrada e a taxa de juros.";

        return;

    }

    // Valor restante após a entrada.

    const financedAmount = VEHICLE_PRICE - entry;

    let installmentValue;

    // Fórmula de financiamento com juros compostos.
    // Para taxa zero, utiliza divisão simples.

    if (interest === 0) {

        installmentValue = financedAmount / installments;

    } else {

        installmentValue =
            financedAmount *
            interest /
            (1 - Math.pow(1 + interest, -installments));

    }

    // Calcula o total pago.

    const totalInstallments = installmentValue * installments;

    const total = totalInstallments + entry;

    // Atualiza os resultados na interface.

    monthlyPayment.textContent =
        formatCurrency(installmentValue);

    totalPayment.textContent =
        `${installments} parcelas | Total com entrada: ${formatCurrency(total)}`;

}


// Evento do botão de cálculo.

calculateButton.addEventListener("click", calculateFinancing);


// Executa uma simulação inicial.

calculateFinancing();


// ==========================================
// FORMULÁRIO DE CONTATO
// ==========================================

const contactForm = document.getElementById("contact-form");

const formFeedback = document.getElementById("form-feedback");


// Evento de envio.

contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    // Obtém os valores dos campos.

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const message = document.getElementById("message").value.trim();


    // Validação básica.

    if (name.length < 3) {

        showFeedback("Informe um nome válido.", "error");

        return;

    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showFeedback("Informe um e-mail válido.", "error");

        return;

    }

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 11) {

        showFeedback("Informe um telefone brasileiro válido com DDD.", "error");

        return;

    }


    // Monta a mensagem para o WhatsApp.

    const whatsappMessage = `
Olá! Tenho interesse no Tesla Model 3.

Nome: ${name}
E-mail: ${email}
Telefone: ${phone}

Mensagem:
${message || "Gostaria de receber mais informações sobre o veículo."}
    `;

    // Codifica a mensagem para uma URL.

    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Gera o endereço do WhatsApp.

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Informa ao visitante o próximo passo.

    showFeedback(
        "Seus dados foram preparados. Abrindo o WhatsApp...",
        "success"
    );

    // Abre o WhatsApp em uma nova aba.

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

});


// ==========================================
// MENSAGENS DO FORMULÁRIO
// ==========================================

function showFeedback(message, type) {

    formFeedback.textContent = message;

    formFeedback.className = `form-feedback ${type}`;

}


// ==========================================
// ANO AUTOMÁTICO NO FOOTER
// ==========================================

document.getElementById("year").textContent =
    new Date().getFullYear();
