(function () {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const registerLink = document.getElementById('registerLink');
  const loginLink = document.getElementById('loginLink');
  const msg = document.getElementById('msg');
  const registerMsg = document.getElementById('registerMsg');
  const loginModal = document.getElementById('loginModal');

  // Switch to register form
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.hidden = true;
    registerForm.hidden = false;
  });

  // Switch to login form
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.hidden = false;
    registerForm.hidden = true;
  });

  // Handle registration
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const pin = document.getElementById('pin').value.trim();

    if (!firstName || !lastName || !username || !password || !pin) {
      registerMsg.textContent = 'Por favor, rellene todos los campos.';
      return;
    }

    if (!/^\d{6,8}$/.test(pin)) {
        registerMsg.textContent = 'El PIN debe tener entre 6 y 8 dígitos.';
        return;
    }

    const user = {
      firstName,
      lastName,
      username,
      password,
      pin,
      avatar: ''
    };

    localStorage.setItem('rigocompra_user', JSON.stringify(user));
    registerMsg.textContent = '¡Felicidades, te has registrado!';
    registerMsg.style.color = 'green';

    setTimeout(() => {
        loginForm.hidden = false;
        registerForm.hidden = true;
        registerMsg.textContent = '';
    }, 2000);
  });

  // Handle login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const storedUser = JSON.parse(localStorage.getItem('rigocompra_user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      msg.textContent = '¡Bienvenido a RigoPlace!';
      msg.style.color = 'green';
      localStorage.setItem('rigocompra_session', 'true');

      setTimeout(() => {
        loginModal.classList.add('fade-out');
        setTimeout(() => {
            loginModal.setAttribute('aria-hidden', 'true');
            loginModal.classList.remove('fade-out');
            msg.textContent = '';
        }, 500);
      }, 1000);

    } else {
      msg.textContent = 'Usuario o contraseña incorrectos.';
    }
  });

})();