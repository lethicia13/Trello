import { API_BASE_URL } from "../../config/apiConfig.js";
import { saveToLocalStorage } from "../utils/storage.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  if (!email) {
    showError("Por favor informe um email válido.");
    return;
  }

  const submitButton = loginForm.querySelector("button");
  disableButton(submitButton, true);

  try {
    const response = await fetch(`${API_BASE_URL}/GetPersonByEmail?Email=${email}`);
    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json();
        showError(errorData.Errors[0]);
      } else {
        showError("Aconteceu um erro inesperado, tente novamente.");
      }
      return;
    }

    const userData = await response.json();
    saveToLocalStorage("user", { id: userData.Id, email: userData.Email });
    window.location.href = "taskBoard.html";
  } catch (error) {
    showError("Falha ao se conectar com o servidor. Tente novamente mais tarde");
  } finally {
    disableButton(submitButton, false);
  }
});

function disableButton(button, disable) {
  
  button.disabled = disable;
  button.textContent = disable ? "Carregando..." : "Acessar";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}
