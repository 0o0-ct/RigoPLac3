// Lógica Login/Register - conecta modal con UserDAO

(function () {
  const dao = new window.UserDAO();

  let isRegisterMode = false;

  const loginForm = document.getElementById('loginForm');
  if (!loginForm) throw new Error('Login form (#loginForm) no encontrado');
  const loginTitle = document.getElementById('loginTitle');
  if (!loginTitle) throw new Error('Título (#loginTitle) no encontrado');
  const msg = document.getElementById('msg');
  if (!msg) throw new Error('Elemento de mensaje (#msg) no encontrado');
  const registerLink = document.querySelector('.register-link a');
  if (!registerLink) throw new Error('Enlace Register (.register-link a) no encontrado');
  const submitBtn = loginForm.querySelector('.btn');
  if (!submitBtn) throw new Error('Botón principal (.btn) no encontrado');

  const nameInput = document.getElementById('nameInput');
  const lastnameInput = document.getElementById('lastnameInput');
  const pinInput = document.getElementById('pinInput');

  function toggleMode() {
    isRegisterMode = !isRegisterMode;
    loginTitle.textContent = isRegisterMode ? "Register" : "Login";
    submitBtn.textContent = isRegisterMode ? "Create Account" : "Login";

    nameInput.style.display = isRegisterMode ? 'block' : 'none';
    lastnameInput.style.display = isRegisterMode ? 'block' : 'none';
    pinInput.style.display = isRegisterMode ? 'block' : 'none';

    showMsg("", true);
  }

  function showMsg(text, ok = false) {
    msg.textContent = text || "";
    msg.className = ok ? "ok" : "";
  }

  async function handleRegister(name, lastname, username, password, pin) {
    try {
      // Validar PIN
      if (!/^\d{6}$|^\d{8}$/.test(pin)) {
        throw new Error("El PIN debe tener 6 u 8 dígitos.");
      }

      const user = { name, lastname, username, password, pin };

      // Guardar en localStorage
      localStorage.setItem('rigocompra_user', JSON.stringify(user));

      showMsg('¡Felicidades, te has registrado!', true);

      // Cambiar a modo login después de un breve retraso
      setTimeout(() => {
        if (isRegisterMode) {
          toggleMode();
        }
      }, 1500);

    } catch (e) {
      showMsg(e.message || "Error registrando usuario");
    }
  }

  async function handleLogin(username, password) {
    try {
      const userData = localStorage.getItem('rigocompra_user');
      if (!userData) {
        throw new Error("No hay usuarios registrados.");
      }

      const user = JSON.parse(userData);

      if (user.username === username && user.password === password) {
        showMsg('¡Bienvenido a RigoPlace!', true);
        localStorage.setItem('rigocompra_session', username);

        // Desvanecer el mensaje y cerrar el modal
        setTimeout(() => {
          const loginModal = document.getElementById('loginModal');
          loginModal.style.opacity = '0';
          setTimeout(() => {
            loginModal.classList.remove('open');
            loginModal.style.opacity = '1';
          }, 500);
        }, 1500);

      } else {
        showMsg('Credenciales inválidas');
      }
    } catch (e) {
      showMsg(e.message || "Error en login");
    }
  }

  registerLink.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMode();
  });

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = loginForm.name ? loginForm.name.value.trim() : '';
    const lastname = loginForm.lastname ? loginForm.lastname.value.trim() : '';
    const username = loginForm.username ? loginForm.username.value.trim() : '';
    const password = loginForm.password ? loginForm.password.value.trim() : '';
    const pin = loginForm.pin ? loginForm.pin.value.trim() : '';

    if (isRegisterMode) {
      if (!name || !lastname || !username || !password || !pin) {
        showMsg("Completa todos los campos para registrarte.");
        return;
      }
      await handleRegister(name, lastname, username, password, pin);
    } else {
      if (!username || !password) {
        showMsg("Completa usuario y contraseña para continuar.");
        return;
      }
      await handleLogin(username, password);
    }
  });

  // Inicialización
  (function initLoginAuth() {
    isRegisterMode = false;
    loginTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    msg.textContent = "";

    nameInput.style.display = 'none';
    lastnameInput.style.display = 'none';
    pinInput.style.display = 'none';

    showMsg("", true);
  })();

})();
