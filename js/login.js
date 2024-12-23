import { API_BASE_URL } from "../js/apiConfig.js";
import { saveToLocalStorage } from "../js/storage.js";

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
    const response = await fetch(
      `${API_BASE_URL}/GetPersonByEmail?Email=${email}`
    );
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
    saveToLocalStorage("user", {
      id: userData.Id,
      email: userData.Email,
      nome: userData.Name,
    });
    window.location.href = "telas/taskBoard.html";
  } catch (error) {
    showError(
      "Falha ao se conectar com o servidor. Tente novamente mais tarde"
    );
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

function trilhoDark() {
  const trilho = document.getElementById("trilho");

  trilho.addEventListener("click", () => {
    const classNames = ["login-container", "trilho"];

    classNames.forEach((className) => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach((element) => {
        element.classList.toggle("dark");
      });
    });

    const loginForm = document.getElementById("login-form");
    const body = document.querySelector("body");

    body.classList.toggle("dark");
    loginForm.classList.toggle("dark");
    console.log("Tema 'dark' aplicado aos elementos especificados.");
  });
}

trilhoDark();
