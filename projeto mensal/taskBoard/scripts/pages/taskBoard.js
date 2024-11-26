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
let botaoExcluir1 = document.getElementById("trash1");
let botaoExcluir2 = document.getElementById("trash2");
let botaoExcluir3 = document.getElementById("trash3");
let botaoExcluir4 = document.getElementById("trash4");
let dropdowncontent = document.getElementById("dropdown-content");

let draggedCard;

trilho.addEventListener("click", () => {
    const elementsToToggle = [
        trilho,
        body,
        header,
        dropdown,
        info,
        column1,
        column2,
        column3,
        column4,
        todo,
        doing,
        review,
        done,
        novatarefa1,
        novatarefa2,
        novatarefa3,
        novatarefa4,
        tituloColunaNova,
        botaoColuna,
        botaoExcluir1,
        botaoExcluir2,
        botaoExcluir3,
        botaoExcluir4,
        dropdowncontent
    ];

    elementsToToggle.forEach(element => element.classList.toggle("dark"));
});

const dragStart = (event) => {
    draggedCard = event.target.closest(".card-container"); // Certifica que o contêiner é arrastado
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

    textArea.className = "card";
    textArea.placeholder = "Digite algo...";
    textArea.spellcheck = "false";

    textArea.addEventListener("focusout", () => {
        const value = textArea.value.trim();
        if (value) {
            const newCard = document.createElement("textarea");
            const trashIcon = document.createElement("i");

            // Configuração do card finalizado
            newCard.className = "card";
            newCard.draggable = false; // Não permitir arrastar diretamente o textarea
            newCard.value = value;
            newCard.placeholder = "Digite algo...";
            newCard.addEventListener("focusout", () => {
                if (!newCard.value.trim()) newCard.remove();
            });

            // Configuração do ícone de lixeira
            trashIcon.className = "bi bi-trash3-fill";
            trashIcon.title = "Excluir";
            trashIcon.addEventListener("click", () => {
                const cardContainer = trashIcon.parentElement;
                const resposta = confirm("Tem certeza de que deseja excluir este item?");
                if (resposta) {
                    cardContainer.remove();
                } else {
                   return; 
                }
            });

            // Função para aplicar o tema ao ícone da lixeira
            const applyTrashIconTheme = () => {
                const isDarkMode = body.classList.contains("dark");
                if (isDarkMode) {
                    trashIcon.classList.add("dark"); // Adiciona a classe "dark" para modo escuro
                } else {
                    trashIcon.classList.remove("dark"); // Remove a classe "dark" para modo claro
                }
            };

            // Aplica o tema no ícone ao criar o card
            applyTrashIconTheme();

            // Criar contêiner do card
            const cardContainer = document.createElement("div");
            cardContainer.className = "card-container";
            cardContainer.draggable = true; // Agora o contêiner é arrastável
            cardContainer.addEventListener("dragstart", dragStart); // Atrelado ao contêiner
            cardContainer.append(newCard, trashIcon);

            columnCards.append(cardContainer);
        }
        textArea.remove(); // Remove o textarea inicial após o foco ser perdido
    });

    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";
    cardContainer.append(textArea);

    columnCards.append(cardContainer);

    textArea.focus();

    // Adiciona um ouvinte para mudanças de tema, para atualizar o ícone da lixeira
    trilho.addEventListener("click", () => {
        const isDarkMode = body.classList.contains("dark");
        const trashIcons = columnCards.querySelectorAll(".bi-trash3-fill");
        trashIcons.forEach(trashIcon => {
            if (isDarkMode) {
                trashIcon.classList.add("dark");
            } else {
                trashIcon.classList.remove("dark");
            }
        });
    });
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
        const excluirIcon = column.querySelector("i");
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

    const trashIcon = document.createElement("i");
    trashIcon.classList = "bi bi-trash3-fill";
    trashIcon.alt = "excluir";
    trashIcon.addEventListener("click", excluirColuna);

    const excluirDiv = document.createElement("div");
    excluirDiv.className = "excluir";

    // Função para aplicar o estilo de acordo com o tema atual
    const applyTheme = () => {
        const isDarkMode = body.classList.contains("dark");
        const elementsToStyle = [
            column,
            columnTitle,
            columnCards,
            addButton,
            trashIcon,
            excluirDiv
        ];

        // Se estiver em modo escuro, adiciona a classe "dark"
        if (isDarkMode) {
            elementsToStyle.forEach(element => {
                element.classList.add("dark");
            });
        } else {
            // Se estiver em modo claro, remove a classe "dark"
            elementsToStyle.forEach(element => {
                element.classList.remove("dark");
            });
        }
    };

    // Aplica o tema ao criar a coluna
    applyTheme();

    excluirDiv.append(columnTitle, trashIcon);

    column.append(excluirDiv, addButton, columnCards);

    columnsContainer.append(column);

    addDragAndDropListeners(columnCards);

    // Adiciona um ouvinte para alterações de tema, para atualizar a coluna automaticamente
    trilho.addEventListener("click", applyTheme);
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
    const resposta = confirm("Tem certeza de que deseja excluir este item?");
    if (resposta) {
        coluna.remove();
    } else {
       return; 
    }
};

initializeColumns();