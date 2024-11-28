document.addEventListener("DOMContentLoaded", async () => {
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
});

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

    columnsSection.innerHTML = "";

    for (const column of columnsData) {
      const columnSection = document.createElement("section");
      columnSection.className = "column";

      columnSection.innerHTML = `
        <div class="excluir">
          <h2 class="column__title" contenteditable="true">${column.Name}</h2>
          <i class="bi bi-trash3-fill"></i>
        </div>
        <button class="add-card-btn">Nova tarefa</button>
        <section class="column__cards" id="tasks-${column.Id}"></section>
      `;

      columnsSection.appendChild(columnSection);

      const excluirIcon = columnSection.querySelector("i");
      excluirIcon.addEventListener("click", excluirColuna);

      const columnCards = columnSection.querySelector(".column__cards");
      const addButton = columnSection.querySelector(".add-card-btn");
      
      addButton.addEventListener("click", () => createCard(columnCards));

      await carregarTasks(column.Id, columnCards);

      applyThemeToColumn(columnSection);
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

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("card");

        taskDiv.innerHTML = `
          <p class="card__title">${task.Title}</p>
          <p class="card__description">${task.Description}</p>
        `;

        taskDiv.contentEditable = "true";

        taskContainer.appendChild(taskDiv);

        // Criando o ícone de lixeira fora do card, mas associando ao container
        const trashIconContainer = document.createElement("div");
        trashIconContainer.classList.add("trash-container");
        
        const trashIcon = document.createElement("i");
        trashIcon.classList = "bi bi-trash3-fill";
        trashIcon.title = "Excluir";
        trashIcon.addEventListener("click", () => {
          const resposta = confirm("Tem certeza de que deseja excluir este item?");
          if (resposta) {
            taskContainer.remove();
          }
        });

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

function createCard(columnCards) {
  const titleInput = document.createElement("textarea");
  titleInput.className = "card__title-input";
  titleInput.placeholder = "Digite o título aqui...";
  titleInput.spellcheck = "false";

  const descriptionInput = document.createElement("textarea");
  descriptionInput.className = "card__description-input";
  descriptionInput.placeholder = "Digite a descrição aqui...";
  descriptionInput.spellcheck = "false";

  const sendButton = document.createElement("button");
  sendButton.className = "add-card-btn";
  sendButton.textContent = "Criar card";

  const createAndAddCard = () => {
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

      trashIcon.addEventListener("click", () => {
        const resposta = confirm("Tem certeza de que deseja excluir este item?");
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

    titleInput.remove();
    descriptionInput.remove();
    sendButton.remove();
  };

  sendButton.addEventListener("click", createAndAddCard);

  columnCards.appendChild(titleInput);
  columnCards.appendChild(descriptionInput);
  columnCards.appendChild(sendButton);
  
  titleInput.focus();
}


const excluirColuna = (event) => {
  const coluna = event.target.closest(".column");
  const resposta = confirm("Tem certeza de que deseja excluir este item?");
  if (resposta) {
    coluna.remove();
  } else {
    return;
  }
};

function applyThemeToColumn(columnSection) {
  const isDarkMode = document.body.classList.contains("dark");
  const elementsToStyle = [
    columnSection,
    columnSection.querySelector(".column__title"),
    columnSection.querySelector(".add-card-btn"),
    columnSection.querySelector(".bi-trash3-fill"),
  ];

  elementsToStyle.forEach((element) => {
    if (isDarkMode) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}
