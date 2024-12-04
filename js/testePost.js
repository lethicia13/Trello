function createBoardButton() {
  const createBoardButton = document.getElementById("createBoard");
  const formContainer = document.getElementById("form-container");

  createBoardButton.addEventListener("click", showCreateBoard);

  function showCreateBoard() {
    formContainer.classList.remove("hidden");

    document.addEventListener("click", hideFormOnClickOutside);
  }

  function hideFormOnClickOutside(event) {
    if (
      !formContainer.contains(event.target) &&
      event.target !== createBoardButton
    ) {
      formContainer.classList.add("hidden");
    }
  }
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

    const boardData = {
      Id: Date.now(),
      Name: boardName,
      Description: boardDescription || "",
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
        alert("Board criada com sucesso!");
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

async function createColumn() {
  const submitColumnButton = document.getElementById("submitColumnButton");
  const submitColumnInput = document.getElementById("submitColumnInput");

  submitColumnButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const columnName = submitColumnInput.value.trim();

    if (!columnName) {
      alert("O nome da column não pode estar vazio!");
      return;
    }

    const boardId = localStorage.getItem("boardId");

    const columnData = {
      Id: Date.now(),
      BoardId: boardId,
      Name: columnName,
      Position: 0,
      IsActive: false,
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
        alert("Coluna criada com sucesso!");
      } else {
        console.error("Erro ao criar a Coluna:", response.statusText);
        alert("Erro ao criar a Coluna. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao criar a Coluna. Verifique sua conexão.");
    }
  });
}

async function createCard() {
    const submitColumnButton = document.getElementById("submitColumnButton");
    const submitColumnInput = document.getElementById("submitColumnInput");
  
    submitColumnButton.addEventListener("click", async (event) => {
      event.preventDefault();
  
      const columnName = submitColumnInput.value.trim();
  
      if (!columnName) {
        alert("O nome da column não pode estar vazio!");
        return;
      }
  
      const boardId = localStorage.getItem("boardId");
  
      const columnData = {
        Id: Date.now(),
        BoardId: boardId,
        Name: columnName,
        Position: 0,
        IsActive: false,
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
          alert("Coluna criada com sucesso!");
        } else {
          console.error("Erro ao criar a Coluna:", response.statusText);
          alert("Erro ao criar a Coluna. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Ocorreu um erro ao criar a Coluna. Verifique sua conexão.");
      }
    });
  }

createColumn();
createBoard();
createBoardButton();
