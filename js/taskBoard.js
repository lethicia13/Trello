async function carregarTemas() {
  const user = JSON.parse(localStorage.getItem("user"));
  const personId = user.id;
  console.log(personId);

  try {
    const response = await fetch(
      `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/PersonConfigById?PersonId=${personId}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    applyTheme(data);
  } catch (error) {
    console.error("Erro ao carregar o tema:", error);
  }
}

async function carregarDropdown() {
  const dropdownContent = document.getElementById("dropdown-content");
  const columnsSection = document.querySelector(".columns");

  try {
    const response = await fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    populateDropdown(data, dropdownContent, columnsSection);
  } catch (error) {
    console.error("Erro ao carregar os boards:", error);
    dropdownContent.innerHTML = "<li>Erro ao carregar dados</li>";
  }
}

async function carregarColunas(boardId, columnsSection) {
  try {
    const response = await fetch(
      `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const columnsData = await response.json();
    console.log(columnsData);
    const main = document.querySelector("main");
    main.classList.remove("hidden");
    columnsSection.innerHTML = "";

    for (const column of columnsData) {
      const columnSection = document.createElement("section");
      columnSection.className = "column";

      const excluirDiv = document.createElement("div");
      excluirDiv.className = "divExcluir";

      const columnTitle = document.createElement("h2");
      columnTitle.className = "column__title";
      columnTitle.contentEditable = "true";
      columnTitle.textContent = column.Name;

      const excluirIcon = document.createElement("i");
      excluirIcon.className = "bi bi-trash3-fill";
      excluirIcon.addEventListener("click", excluirColuna);
      addDragAndDropListeners(columnSection);

      excluirDiv.appendChild(columnTitle);
      excluirDiv.appendChild(excluirIcon);

      const addCardButton = document.createElement("button");
      addCardButton.className = "add-card-btn";
      addCardButton.textContent = "Nova tarefa";

      const columnCards = document.createElement("section");
      columnCards.className = "column__cards";
      columnCards.id = `tasks-${column.Id}`;

      const isDarkMode = document.body.classList.contains("dark");

      if (isDarkMode) {
        columnSection.classList.add("dark");
        columnTitle.classList.add("dark");
        excluirIcon.classList.add("dark");
        addCardButton.classList.add("dark");
        columnCards.classList.add("dark");
      } else {
        columnSection.classList.remove("dark");
        columnTitle.classList.remove("dark");
        excluirIcon.classList.remove("dark");
        addCardButton.classList.remove("dark");
        columnCards.classList.remove("dark");
      }

      addCardButton.addEventListener("click", () => createCard(columnCards));

      columnSection.appendChild(excluirDiv);
      columnSection.appendChild(addCardButton);
      columnSection.appendChild(columnCards);

      columnsSection.appendChild(columnSection);

      await carregarTasks(column.Id, columnCards);
    }
  } catch (error) {
    console.error("Erro ao carregar as colunas:", error);
    columnsSection.innerHTML = "<p>Erro ao carregar as colunas</p>";
  }
}

async function carregarTasks(columnId, columnCards) {
  try {
    const response = await fetch(
      `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId=${columnId}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const tasksData = await response.json();
    console.log(`Tasks para a coluna ${columnId}:`, tasksData);

    if (tasksData.length === 0) {
      return;
    } else {
      tasksData.forEach((task) => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("card-container");
        taskContainer.draggable = true;
        taskContainer.addEventListener("dragstart", dragStart);

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("card");

        taskDiv.innerHTML = `
          <p class="card__title">${task.Title}</p>
          <p class="card__description">${task.Description}</p>
        `;

        taskDiv.contentEditable = "true";

        taskContainer.appendChild(taskDiv);

        const trashIconContainer = document.createElement("div");
        trashIconContainer.classList.add("trash-container");

        const trashIcon = document.createElement("i");
        trashIcon.classList = "bi bi-trash3-fill";
        trashIcon.title = "Excluir";
        trashIcon.addEventListener("click", () => {
          const resposta = confirm(
            "Tem certeza de que deseja excluir este item?"
          );
          if (resposta) {
            taskContainer.remove();
          }
        });

        const isDarkMode = document.body.classList.contains("dark");

        if (isDarkMode) {
          taskDiv.classList.add("dark");
          trashIcon.classList.add("dark");
        } else {
          taskDiv.classList.remove("dark");
          trashIcon.classList.remove("dark");
        }

        trashIconContainer.appendChild(trashIcon);
        taskContainer.appendChild(trashIconContainer);

        columnCards.appendChild(taskContainer);
      });
    }
  } catch (error) {
    console.error(
      `Erro ao carregar as tasks para a coluna ${columnId}:`,
      error
    );
    const tasksContainer = document.getElementById(`tasks-${columnId}`);
    tasksContainer.innerHTML = "<p>Erro ao carregar as tasks</p>";
  }
}

function applyTheme(data) {
  if (data.DefaultThemeId === 1) {
    const classNames = [
      "dropdown",
      "dropbtn",
      "dropdown-content",
      "dropdown-item",
      "info-logout-darkmode",
      "trilho",
      "indicador",
      "columns",
      "column",
      "excluir",
      "column__title",
      "bi bi-trash3-fill",
      "add-card-btn",
      "column__cards",
      "card__title-input",
      "card__description-input",
      "add-column-btn",
      "new-column-title"
    ];

    classNames.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach((element) => {
        element.classList.toggle("dark");
      });
    });

    const body = document.querySelector("body");
    const header = document.querySelector("header");

    if (body) {
      body.classList.toggle("dark");
    } else {
      console.log("<body> não encontrado.");
    }

    if (header) {
      header.classList.toggle("dark");
    } else {
      console.log("<header> não encontrado.");
    }

    console.log("Tema 'dark' aplicado aos elementos especificados.");
  } else if (data.DefaultThemeId === 2) {
    console.log("DefaultThemeId é 2, nenhuma ação será realizada.");
  }
}

function recuperarDados() {
  const userData = localStorage.getItem("user");

  if (userData) {
    const user = JSON.parse(userData);
    console.log(user);

    const userNameElement = document.getElementById("nomeFulana");

    const primeiroNome = user.nome.split(" ")[0];
    userNameElement.innerHTML = `Olá, ${primeiroNome}!`;
  } else {
    userNameElement.innerHTML = "Bem vindo!";
  }
}

function populateDropdown(data, dropdownContent, columnsSection) {
  dropdownContent.innerHTML = "";

  data.forEach((board) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.textContent = board.Name;

    link.addEventListener("click", () => {
      carregarColunas(board.Id, columnsSection);
    });

    listItem.appendChild(link);
    dropdownContent.appendChild(listItem);
  });
}

function createCard(columnCards) {
  const titleInput = document.createElement("textarea");
  titleInput.className = "card__title-input";
  titleInput.placeholder = "Digite o título aqui";
  titleInput.spellcheck = "false";

  const descriptionInput = document.createElement("textarea");
  descriptionInput.className = "card__description-input";
  descriptionInput.placeholder = "Digite a descrição aqui";
  descriptionInput.spellcheck = "false";

  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  inputContainer.appendChild(titleInput);
  inputContainer.appendChild(descriptionInput);

  const sendButton = document.createElement("button");
  sendButton.textContent = "Criar Card";
  sendButton.classList = "add-card-btn";
  inputContainer.appendChild(sendButton);

  columnCards.appendChild(inputContainer);

  titleInput.addEventListener("blur", () => {
    if (!titleInput.value.trim() && !descriptionInput.value.trim()) {
      inputContainer.remove();
    }
  });

  descriptionInput.addEventListener("blur", () => {
    if (!titleInput.value.trim() && !descriptionInput.value.trim()) {
      inputContainer.remove();
    }
  });

  const isDarkMode = document.body.classList.contains("dark");

  if (isDarkMode) {
    titleInput.classList.add("dark");
    descriptionInput.classList.add("dark");
    sendButton.classList.add("dark");
  } else {
    titleInput.classList.remove("dark");
    descriptionInput.classList.remove("dark");
    sendButton.classList.remove("dark");
  }

  sendButton.addEventListener("click", () => {
    const titleValue = titleInput.value.trim();
    const descriptionValue = descriptionInput.value.trim();

    if (titleValue || descriptionValue) {
      const cardContainer = document.createElement("div");
      cardContainer.className = "card-container";

      const card = document.createElement("div");
      card.className = "card";

      const cardTitle = document.createElement("p");
      cardTitle.className = "card__title";
      cardTitle.textContent = titleValue || "Sem título";

      const cardDescription = document.createElement("p");
      cardDescription.className = "card__description";
      cardDescription.textContent = descriptionValue || "Sem descrição";

      const trashIcon = document.createElement("i");
      trashIcon.className = "bi bi-trash3-fill";
      trashIcon.title = "Excluir";

      const isDarkMode = document.body.classList.contains("dark");

      if (isDarkMode) {
        trashIcon.classList.add("dark");
        cardDescription.classList.add("dark");
        cardContainer.classList.add("dark");
        card.classList.add("dark");
        cardTitle.classList.add("dark");
        cardDescription.classList.add("dark");
      } else {
        trashIcon.classList.remove("dark");
        cardDescription.classList.remove("dark");
        cardContainer.classList.remove("dark");
        card.classList.remove("dark");
        cardTitle.classList.remove("dark");
        cardDescription.classList.remove("dark");
      }

      trashIcon.addEventListener("click", () => {
        const resposta = confirm(
          "Tem certeza de que deseja excluir este item?"
        );
        if (resposta) {
          cardContainer.remove();
        }
      });

      card.appendChild(cardTitle);
      card.appendChild(cardDescription);

      cardContainer.appendChild(card);
      cardContainer.appendChild(trashIcon);

      columnCards.appendChild(cardContainer);
    }

    inputContainer.remove();
  });

  titleInput.focus();
}

function botaoCriarColuna() {
  const addColumnBtn = document.getElementById("add-column-btn");
  const newColumnTitleInput = document.getElementById("new-column-title");

  addColumnBtn.addEventListener("click", () => {
    const title = newColumnTitleInput.value.trim();

    if (title) {
      criarColuna(title);
      newColumnTitleInput.value = "";
    } else {
      alert("Por favor, insira um título para a coluna.");
    }
  });
}

function criarColuna(title) {
  const columnSection = document.createElement("section");
  columnSection.className = "column";

  const isDarkMode = document.body.classList.contains("dark");

  const excluirDiv = document.createElement("div");
  excluirDiv.className = "excluir";

  const columnTitle = document.createElement("h2");
  columnTitle.className = "column__title";
  columnTitle.contentEditable = "true";
  columnTitle.textContent = title;

  const excluirIcon = document.createElement("i");
  excluirIcon.className = "bi bi-trash3-fill";
  excluirIcon.addEventListener("click", excluirColuna);

  excluirDiv.appendChild(columnTitle);
  excluirDiv.appendChild(excluirIcon);

  const addCardButton = document.createElement("button");
  addCardButton.className = "add-card-btn";
  addCardButton.textContent = "Nova tarefa";

  const columnCards = document.createElement("section");
  columnCards.className = "column__cards";

  columnSection.appendChild(excluirDiv);
  columnSection.appendChild(addCardButton);
  columnSection.appendChild(columnCards);

  const columnsSection = document.querySelector(".columns");
  columnsSection.appendChild(columnSection);

  if (isDarkMode) {
    columnSection.classList.add("dark");
    columnTitle.classList.add("dark");
    excluirIcon.classList.add("dark");
    addCardButton.classList.add("dark");
    columnCards.classList.add("dark");
  } else {
    columnSection.classList.remove("dark");
    columnTitle.classList.remove("dark");
    excluirIcon.classList.remove("dark");
    addCardButton.classList.remove("dark");
    columnCards.classList.remove("dark");
  }

  addCardButton.addEventListener("click", () => createCard(columnCards));
}

let draggedCard;

const dragStart = (event) => {
  draggedCard = event.target.closest(".card-container");
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

const addDragAndDropListeners = (columnCards) => {
  columnCards.addEventListener("dragover", dragOver);
  columnCards.addEventListener("dragenter", dragEnter);
  columnCards.addEventListener("dragleave", dragLeave);
  columnCards.addEventListener("drop", drop);
};

const excluirColuna = (event) => {
  const coluna = event.target.closest(".column");
  const resposta = confirm("Tem certeza de que deseja excluir este item?");
  if (resposta) {
    coluna.remove();
  } else {
    return;
  }
};

function trilhoDark() {
  const trilho = document.getElementById("trilho");

  trilho.addEventListener("click", () => {
    const classNames = [
      "dropdown",
      "dropbtn",
      "dropdown-content",
      "dropdown-item",
      "info-logout-darkmode",
      "trilho",
      "indicador",
      "columns",
      "column",
      "excluir",
      "column__title",
      "bi bi-trash3-fill",
      "add-card-btn",
      "column__cards",
      "card__title-input",
      "card__description-input",
      "card",
      "add-column-btn",
      "new-column-title"
    ];

    classNames.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach((element) => {
        element.classList.toggle("dark");
      });
    });

    const body = document.querySelector("body");
    const header = document.querySelector("header");

    if (body) {
      body.classList.toggle("dark");
    } else {
      console.log("<body> não encontrado.");
    }

    if (header) {
      header.classList.toggle("dark");
    } else {
      console.log("<header> não encontrado.");
    }

    console.log("Tema 'dark' aplicado aos elementos especificados.");
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

trilhoDark();
botaoCriarColuna();
recuperarDados();
carregarDropdown();
carregarTemas();
