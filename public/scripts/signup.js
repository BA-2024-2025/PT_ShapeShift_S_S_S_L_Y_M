const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');

function isValidPassword(password) {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasLetter && hasNumber;
}

async function checkUsernameAvailability(username) {
  const response = await fetch('/check-username', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  const data = await response.json();
  return data.available === true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  usernameError.classList.add('hidden');
  passwordError.classList.add('hidden');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const isUsernameAvailable = await checkUsernameAvailability(username);

  if (!isUsernameAvailable) {
    usernameError.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword || !isValidPassword(password)) {
    passwordError.classList.remove('hidden');
    return;
  }

  const response = await fetch('http://172.16.2.165:3000/submit-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    window.location.href = '/login';
  } else {
    alert('Signup failed. Please try again.');
  }
});
