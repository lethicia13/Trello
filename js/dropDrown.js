document.addEventListener("DOMContentLoaded", async () => {
  const dropdownContent = document.getElementById("dropdown-content");

  try {
    const response = await fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    populateColumns(data, dropdownContent);
  } catch (error) {
    console.error("Erro ao carregar as colunas:", error);
    dropdownContent.innerHTML = "<li>Erro ao carregar dados</li>";
  }
});

function populateColumns(data, dropdownContent) {
  dropdownContent.innerHTML = "";

  data.forEach((board) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.innerHTML = board.Name;

    const boardId = board.Id;
    carregarColunas(boardId);

    listItem.appendChild(link);
    dropdownContent.appendChild(listItem);
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

async function carregarColunas(boardId) {
  try {
    const response = await fetch(
      `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("Erro ao carregar as colunas:", error);
  }
}