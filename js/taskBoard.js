async function carregarTemas() {
  const user = JSON.parse(localStorage.getItem("user"));
  const personId = user.id;

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
    trilhoDark(data, personId);
  } catch (error) {
    console.error("Erro ao carregar o tema:", error);
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

function trilhoDark(data, personId) {
  const trilho = document.getElementById("trilho");

  trilho.addEventListener("click", async () => {
    let newThemeId = data.DefaultThemeId === 1 ? 2 : 1;
    const themeConfig = { ThemeId: newThemeId };

    try {
      const response = await fetch(
        `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ConfigPersonTheme?PersonId=${personId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(themeConfig),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao trocar o tema na API");
      }

      data.DefaultThemeId = newThemeId;
      applyTheme(data);

      console.log("Tema trocado com sucesso!");
    } catch (error) {
      console.error("Erro ao trocar o tema:", error);
    }
  });
}

function applyTheme(data) {
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
    "bi-trash3-fill",
    "bi-pencil-square", 
    "bi-file-plus-fill",
    "add-card-btn",
    "column__cards",
    "card",
    "card-container",
    "card__title-input",
    "card__description-input",
    "add-column-btn",
    "new-column-title",
    "modal",
    "modal-content",
  ];

  if (data.DefaultThemeId === 1) {
    classNames.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach((element) => {
        element.classList.add("dark");
      });
    });

    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const h1 = document.querySelector("h1");

    body.classList.add("dark");
    header.classList.add("dark");
    h1.classList.add("dark");

    console.log("Tema dark aplicado aos elementos especificados.");
  } else if (data.DefaultThemeId === 2) {
    classNames.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach((element) => {
        element.classList.remove("dark");
      });
    });

    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const h1 = document.querySelector("h1");

    body.classList.remove("dark");
    header.classList.remove("dark");
    h1.classList.remove("dark");

    console.log("Tema dark removido dos elementos especificados.");
  }
}

async function carregarDropdown() {
  try {
    const response = await fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    populateDropdown(data);
  } catch (error) {
    console.error("Erro ao carregar os boards:", error);
  }
}

function populateDropdown(data) {
  const dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.innerHTML = "";

  data.forEach((board) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.textContent = board.Name;

    link.addEventListener("click", () => {
      fetchColunas(board.Id);
    });

    listItem.appendChild(link);
    dropdownContent.appendChild(listItem);
  });
}

function createBoardButton() {
  const modal = document.getElementById("modalCriarBoard");
  const openModalButton = document.getElementById("openModal");

  openModalButton.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

async function createBoard() {
  const submitBoardButton = document.getElementById("submitBoard");
  const boardNameInput = document.getElementById("boardName");
  const descriptionInput = document.getElementById("boardDescription");

  submitBoardButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const boardName = boardNameInput.value.trim();
    const boardDescription = descriptionInput.value.trim();

    if (!boardName) {
      alert("O nome da board não pode estar vazio!");
      return;
    }

    if (boardName.length < 10) {
      alert("O nome da board precisa ter no mínimo 10 caracteres");
      return;
    }

    if (!boardDescription) {
      alert("A descrição da board não pode estar vazia!");
      return;
    }

    const boardData = {
      Id: Date.now(),
      Name: boardName,
      Description: boardDescription,
      HexaBackgroundCoor: "",
      IsActive: true,
      CreatedBy: 6,
      UpdatedBy: 2,
    };

    try {
      const response = await fetch(
        "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(boardData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Board criada com sucesso:", result);
        window.location.href = "/telas/taskBoard.html";
      } else {
        console.error("Erro ao criar a board:", response.statusText);
        alert("Erro ao criar a board. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao criar a board. Verifique sua conexão.");
    }
  });
}

function excluirBoardButton() {
  const excluirButton = document.getElementById("excluirBoard");
  excluirButton.addEventListener("click", () => {
    const isConfirmed = window.confirm("Deseja excluir essa board?");
    if (isConfirmed) {
      excluirBoard();
    } else {
      return;
    }
  });
}

function excluirBoard() {
  const boardId = localStorage.getItem("boardId");

  const boardData = {
    BoardId: boardId,
  };

  fetch(
    `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board?BoardId=${boardId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boardData),
    }
  )
    .then((data) => {
      console.log("Board excluida com sucesso:", data);
      window.location.href = "/telas/taskBoard.html";
    })
    .catch((error) => {
      console.error("Erro ao excluir a board:", error);
    });
}

async function fetchColunas(boardId) {
  try {
    const response = await fetch(
      `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const columnsData = await response.json();
    localStorage.setItem("boardId", boardId);
    carregarColunas(columnsData);
  } catch (error) {
    console.error("Erro ao carregar as colunas:", error);
  }
}

async function carregarColunas(columnsData) {
  const main = document.querySelector("main");
  main.classList.remove("hidden");
  const columnsSection = document.querySelector(".columns");
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
    columnTitle.spellcheck = "false";

    const excluirIcon = document.createElement("i");
    excluirIcon.className = "bi bi-trash3-fill";

    excluirIcon.addEventListener("click", () => {
      const resposta = confirm("Tem certeza de que deseja excluir este item?");
      if (resposta) {
        excluirColuna();
      }
    });

    excluirDiv.appendChild(columnTitle);
    excluirDiv.appendChild(excluirIcon);

    const addCardButton = document.createElement("button");
    addCardButton.className = "add-card-btn";
    addCardButton.textContent = "Nova tarefa";

    const columnCards = document.createElement("section");
    columnCards.className = "column__cards";
    columnCards.id = `tasks-${column.Id}`;

    columnCards.draggable = true;
    columnCards.addEventListener("dragstart", dragStart);

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

    columnSection.appendChild(excluirDiv);
    columnSection.appendChild(addCardButton);
    columnSection.appendChild(columnCards);

    columnsSection.appendChild(columnSection);
    addDragAndDropListenersToColumns(columnSection);

    await carregarTasks(column.Id, columnCards);
    columnSection.addEventListener("mouseover", () => {
      localStorage.setItem("columnId", column.Id);
      localStorage.setItem("columnName", column.Name);
    });
    addCardButton.addEventListener("click", () =>
      createCard(columnCards, column.Id)
    );
  }
}

function botaoCriarColuna() {
  const modal = document.getElementById("formAdicionarColuna");
  const openModalButton = document.getElementById("adicionarColuna");

  openModalButton.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function adicionarColunaFunction() {
  const addColumnBtn = document.getElementById("submitColumnButton");
  const newColumnTitleInput = document.getElementById("submitColumnInput");

  addColumnBtn.addEventListener("click", () => {
    const title = newColumnTitleInput.value.trim();

    if (title) {
      createColumn(title);
      const modal = document.getElementById("formAdicionarColuna");
      modal.style.display = "none";
    } else {
      alert("Por favor, insira um título para a coluna.");
    }
  });
}

async function createColumn(title) {
  const columnName = title;

  if (!columnName) {
    alert("O nome da column não pode estar vazio!");
    return;
  }

  const boardId = localStorage.getItem("boardId");

  const columnData = {
    Id: Date.now(),
    BoardId: boardId,
    Name: columnName || "",
    Position: 0,
    IsActive: true,
    CreatedBy: 6,
    UpdatedBy: 2,
  };

  try {
    const response = await fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(columnData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Coluna criada com sucesso:", result);
      fetchColunas(boardId);
      return;
    } else {
      console.error("Erro ao criar a Coluna:", response.statusText);
      alert("Erro ao criar a Coluna. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Ocorreu um erro ao criar a Coluna. Verifique sua conexão.");
  }
}

async function excluirColuna() {
  const boardId = localStorage.getItem("boardId");
  const columnId = localStorage.getItem("columnId");

  const columnData = {
    ColumnId: columnId,
  };

  fetch(
    `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column?ColumnId=${columnId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(columnData),
    }
  )
    .then((data) => {
      console.log("Coluna arquivado com sucesso:", data);
      fetchColunas(boardId);
    })
    .catch((error) => {
      console.error("Erro ao arquivar a coluna:", error);
    });
}

function createCard(columnCards, columnId) {
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
  sendButton.className = "add-card-btn";
  inputContainer.appendChild(sendButton);

  columnCards.appendChild(inputContainer);

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

  titleInput.focus();

  titleInput.addEventListener("blur", () => {
    if (!titleInput.value.trim() && !descriptionInput.value.trim()) {
      inputContainer.remove();
    }
  });

  postCard(titleInput, descriptionInput, sendButton, columnId);
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

    tasksData.forEach((task) => {
      const taskContainer = document.createElement("div");
      taskContainer.classList.add("card-container");
      taskContainer.draggable = true;
      taskContainer.addEventListener("dragstart", dragStart);

      taskContainer.addEventListener("mouseover", () => {
        localStorage.setItem("taskId", task.Id);
      });

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

      const editIcon = document.createElement("i");
      editIcon.classList = "bi bi-pencil-square";
      editIcon.addEventListener("click", () => {
        const modal = document.getElementById("modalEditarTask");

        modal.style.display = "flex";

        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });
      });

      const trashIcon = document.createElement("i");
      trashIcon.classList = "bi bi-trash3-fill";
      trashIcon.title = "Excluir";
      trashIcon.addEventListener("click", () => {
        const resposta = confirm(
          "Tem certeza de que deseja excluir essa task?"
        );
        if (resposta) {
          excluirTasks();
        }
      });

      const isDarkMode = document.body.classList.contains("dark");

      if (isDarkMode) {
        taskDiv.classList.add("dark");
        trashIcon.classList.add("dark");
        editIcon.classList.add("dark");
      } else {
        taskDiv.classList.remove("dark");
        trashIcon.classList.remove("dark");
        editIcon.classList.remove("dark");
      }

      trashIconContainer.appendChild(editIcon);
      trashIconContainer.appendChild(trashIcon);
      taskContainer.appendChild(trashIconContainer);

      columnCards.appendChild(taskContainer);
    });

    addDragAndDropListenersToCards(columnCards);
  } catch (error) {
    console.error(
      `Erro ao carregar as tasks para a coluna ${columnId}:`,
      error
    );
  }
}

function postCard(titleInput, descriptionInput, sendButton, columnId) {
  sendButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const taskName = titleInput.value.trim();
    const taskDescription = descriptionInput.value.trim();

    const taskData = {
      Id: Date.now(),
      ColumnId: columnId,
      Title: taskName,
      Description: taskDescription || " ",
      IsActive: false,
      CreatedBy: 6,
      UpdatedBy: 2,
    };

    try {
      const response = await fetch(
        "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Tarefa criada com sucesso:", result);
        const boardId = localStorage.getItem("boardId");
        fetchColunas(boardId);
      } else {
        console.error("Erro ao criar a Tarefa:", response.statusText);
        alert("Erro ao criar a Tarefa. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao criar a Tarefa. Verifique sua conexão.");
    }
  });
}

function editarTasks() {
  const editarTasksButton = document.getElementById("editBoard");

  editarTasksButton.addEventListener("click", () => {
    const taskId = localStorage.getItem("taskId");
    const columnId = localStorage.getItem("columnId");
    const editTaskName = document.getElementById("editTaskName");
    const editTaskDescription = document.getElementById("editTaskDescription");

    const taskName = editTaskName.value.trim();
    const taskDescription = editTaskDescription.value.trim();

    if(!taskName){
      alert("Insira um nome para a task");
        return;
    }

    const editTaskData = {
      Id: taskId,
      ColumnId: columnId,
      Title: taskName || " ",
      Description: taskDescription || " ",
    };

    fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTaskData),
      }
    )
      .then((data) => {
        console.log("Task editada com sucesso:", data);
        const modal = document.getElementById("modalEditarTask")
        modal.style.display = "none";
        const boardId = localStorage.getItem("boardId");
        fetchColunas(boardId);
      })
      .catch((error) => {
        console.error("Erro ao editar a task:", error);
      });
  });
}

function excluirTasks() {
  const taskId = localStorage.getItem("taskId");

  const taskData = {
    TaskId: taskId,
  };

  fetch(
    `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task?TaskId=${taskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    }
  )
    .then((data) => {
      console.log("Task deletada com sucesso:", data);
      boardId = localStorage.getItem("boardId");
      fetchColunas(boardId);
    })
    .catch((error) => {
      console.error("Erro ao excluir a task:", error);
    });
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
  if (target.classList.contains("column__cards")) {
    target.classList.remove("column--highlight");
  }
};

const drop = ({ target }) => {
  if (target.classList.contains("column__cards")) {
    target.classList.remove("column--highlight");
    target.append(draggedCard);
  }
};

const addDragAndDropListenersToCards = (columnCards) => {
  columnCards.draggable = "true";
  columnCards.addEventListener("dragover", dragOver);
  columnCards.addEventListener("dragenter", dragEnter);
  columnCards.addEventListener("dragleave", dragLeave);
  columnCards.addEventListener("drop", drop);
};

let draggedColumn;

const dragStartColumn = (event) => {
  draggedColumn = event.target.closest(".column");
  event.dataTransfer.effectAllowed = "move";
};

const dragOverColumn = (event) => {
  event.preventDefault();
};

const dragEnterColumn = ({ target }) => {
  if (target.classList.contains("column") && target !== draggedColumn) {
    target.classList.add("column--highlight");
  }
};

const dragLeaveColumn = ({ target }) => {
  if (target.classList.contains("column")) {
    target.classList.remove("column--highlight");
  }
};

const dropColumn = ({ target }) => {
  if (target.classList.contains("column") && target !== draggedColumn) {
    target.classList.remove("column--highlight");
    const parent = target.parentNode;
    const targetIndex = Array.from(parent.children).indexOf(target);
    const draggedIndex = Array.from(parent.children).indexOf(draggedColumn);

    if (draggedIndex < targetIndex) {
      parent.insertBefore(draggedColumn, target.nextSibling);
    } else {
      parent.insertBefore(draggedColumn, target);
    }
  }
};

const addDragAndDropListenersToColumns = (columnSection) => {
  columnSection.draggable = true;
  columnSection.addEventListener("dragstart", dragStartColumn);
  columnSection.addEventListener("dragover", dragOverColumn);
  columnSection.addEventListener("dragenter", dragEnterColumn);
  columnSection.addEventListener("dragleave", dragLeaveColumn);
  columnSection.addEventListener("drop", dropColumn);
};

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

botaoCriarColuna();
recuperarDados();
carregarDropdown();
carregarTemas();
createBoard();
createBoardButton();
adicionarColunaFunction();
excluirBoardButton();
editarTasks();