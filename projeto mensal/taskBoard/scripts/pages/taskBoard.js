const columnsContainer = document.querySelector(".columns");
const addColumnInput = document.querySelector("#new-column-title");
const addColumnButton = document.querySelector("#add-column-btn");
let trilho = document.getElementById("trilho");
let body = document.querySelector("body");
let header = document.querySelector("header");
let dropdown = document.getElementById("dropbtn");
let info = document.getElementById("info-logout-darkmode");
let column1 = document.getElementById("column1");
let column2 = document.getElementById("column2");
let column3 = document.getElementById("column3");
let column4 = document.getElementById("column4");
let todo = document.getElementById("todo");
let doing = document.getElementById("doing");
let review = document.getElementById("review");
let done = document.getElementById("done");
let novatarefa1 = document.getElementById("novatarefa1");
let novatarefa2 = document.getElementById("novatarefa2");
let novatarefa3 = document.getElementById("novatarefa3");
let novatarefa4 = document.getElementById("novatarefa4");
let tituloColunaNova = document.getElementById("new-column-title");
let botaoColuna = document.getElementById("add-column-btn");

trilho.addEventListener("click", () => {
    trilho.classList.toggle("dark");
    body.classList.toggle("dark");
    header.classList.toggle("dark");
    dropdown.classList.toggle("dark");
    info.classList.toggle("dark");
    column1.classList.toggle("dark");
    column2.classList.toggle("dark");
    column3.classList.toggle("dark");
    column4.classList.toggle("dark");
    todo.classList.toggle("dark");
    doing.classList.toggle("dark");
    review.classList.toggle("dark");
    done.classList.toggle("dark");
    novatarefa1.classList.toggle("dark");
    novatarefa2.classList.toggle("dark");
    novatarefa3.classList.toggle("dark");
    novatarefa4.classList.toggle("dark");
    tituloColunaNova.classList.toggle("dark");
    botaoColuna.classList.toggle("dark");
});

let draggedCard;

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

const createCard = (columnCards) => {
    const textArea = document.createElement("textarea");
    const button = document.createElement("button");
    button.className = "add-column-btn";

    textArea.className = "card";
    textArea.draggable = true;
    textArea.placeholder = "Digite algo...";
    textArea.spellcheck = "false";

    textArea.addEventListener("focusout", () => {
        if (!textArea.value.trim()) {
            textArea.remove();
            button.remove();
        } else {
            button.remove();
        }
    });

    button.textContent = "Enviar";
    button.addEventListener("click", () => {
        const value = textArea.value.trim();
        if (value) {
            const newCard = document.createElement("textarea");
            newCard.className = "card";
            newCard.draggable = true;
            newCard.value = value;
            newCard.placeholder = "Digite algo...";
            newCard.addEventListener("focusout", () => {
                if (!newCard.value.trim()) newCard.remove();
            });
            newCard.addEventListener("dragstart", dragStart);

            const cardContainer = document.createElement("div");
            cardContainer.className = "card-container";
            cardContainer.append(newCard, button);

            criarIconeLixeira(cardContainer);

            columnCards.append(cardContainer);

            textArea.value = "";
            textArea.remove();
            button.remove();
        }
    });

    textArea.addEventListener("dragstart", dragStart);

    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";
    cardContainer.append(textArea, button);


    columnCards.append(cardContainer);

    textArea.focus();
};

const addDragAndDropListeners = (columnCards) => {
    columnCards.addEventListener("dragover", dragOver);
    columnCards.addEventListener("dragenter", dragEnter);
    columnCards.addEventListener("dragleave", dragLeave);
    columnCards.addEventListener("drop", drop);
};

const initializeColumns = () => {
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
        const excluirIcon = column.querySelector("img[alt='excluir']");
        excluirIcon.addEventListener("click", excluirColuna);
        const columnCards = column.querySelector(".column__cards");
        const addButton = column.querySelector(".add-card-btn");

        addDragAndDropListeners(columnCards);
        addButton.addEventListener("click", () => createCard(columnCards));
    });
};

const createColumn = (title) => {
    const column = document.createElement("section");
    column.className = "column";

    const columnTitle = document.createElement("h2");
    columnTitle.className = "column__title";
    columnTitle.textContent = title;
    columnTitle.contentEditable = "true";

    const columnCards = document.createElement("section");
    columnCards.className = "column__cards";

    const addButton = document.createElement("button");
    addButton.textContent = "Nova tarefa";
    addButton.className = "add-card-btn";
    addButton.addEventListener("click", () => createCard(columnCards));

    const trashIcon = document.createElement("img");
    trashIcon.src = "/projeto mensal/taskBoard/scripts/utils/trash.png";
    trashIcon.alt = "excluir";
    trashIcon.addEventListener("click", excluirColuna);

    const excluirDiv = document.createElement("div");
    excluirDiv.className = "excluir";
    excluirDiv.append(columnTitle, trashIcon);

    column.append(excluirDiv, addButton, columnCards);

    columnsContainer.append(column);

    addDragAndDropListeners(columnCards);
};


addColumnButton.addEventListener("click", () => {
    const columnTitle = addColumnInput.value.trim();

    if (columnTitle) {
        createColumn(columnTitle);
        addColumnInput.value = "";
    } else {
        alert("Por favor, insira um título para a nova coluna!");
    }
});

const excluirColuna = (event) => {
    const coluna = event.target.closest('.column');
    if (coluna) {
        window.alert("Tem certeza que deseja excluir essa coluna?");
        coluna.remove();
    }
};

initializeColumns();