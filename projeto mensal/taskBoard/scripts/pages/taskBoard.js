const columnsContainer = document.querySelector(".columns");
const addColumnInput = document.querySelector("#new-column-title");
const addColumnButton = document.querySelector("#add-column-btn");

let draggedCard;

// Funções de drag & drop
const dragStart = (event) => {
    draggedCard = event.target;
    event.dataTransfer.effectAllowed = "move";
};

const dragOver = (event) => {
    event.preventDefault();
};

const dragEnter = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.add("column--highlight");
    }
};

const dragLeave = ({ target }) => {
    target.classList.remove("column--highlight");
};

const drop = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.remove("column--highlight");
        target.append(draggedCard);
    }
};

// Função para criar um novo cartão
const createCard = (columnCards) => {
    const card = document.createElement("section");
    card.className = "card";
    card.draggable = "true";
    card.contentEditable = "true";
    card.addEventListener("focusout", () => {
        card.contentEditable = "false";
        if (!card.textContent) card.remove();
    });
    card.addEventListener("dragstart", dragStart);
    columnCards.append(card);
    card.focus();
};

// Adiciona os listeners para drag & drop em cada coluna
const addDragAndDropListeners = (columnCards) => {
    columnCards.addEventListener("dragover", dragOver);
    columnCards.addEventListener("dragenter", dragEnter);
    columnCards.addEventListener("dragleave", dragLeave);
    columnCards.addEventListener("drop", drop);
};

// Inicializa as colunas existentes no HTML
const initializeColumns = () => {
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
        const columnCards = column.querySelector(".column__cards");
        const addButton = column.querySelector(".add-card-btn");

        addDragAndDropListeners(columnCards);
        addButton.addEventListener("click", () => createCard(columnCards));
    });
};

// Função para criar colunas dinamicamente
const createColumn = (title) => {
    const column = document.createElement("section");
    column.className = "column";

    const columnTitle = document.createElement("h2");
    columnTitle.className = "column__title";
    columnTitle.textContent = title;

    const columnCards = document.createElement("section");
    columnCards.className = "column__cards";

    const addButton = document.createElement("button");
    addButton.textContent = "Adicionar Cartão";
    addButton.className = "add-card-btn";
    addButton.addEventListener("click", () => createCard(columnCards));

    column.append(columnTitle, columnCards, addButton);
    columnsContainer.append(column);

    addDragAndDropListeners(columnCards); // Adiciona os eventos de drag & drop
};

// Evento para criar uma nova coluna com o botão
addColumnButton.addEventListener("click", () => {
    const columnTitle = addColumnInput.value.trim();

    if (columnTitle) {
        createColumn(columnTitle); // Cria a coluna com o título fornecido
        addColumnInput.value = ""; // Limpa o campo de entrada
    } else {
        alert("Por favor, insira um título para a nova coluna!");
    }
});

// Inicializa as colunas ao carregar a página
initializeColumns();
