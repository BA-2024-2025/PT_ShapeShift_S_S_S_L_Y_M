
const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

const passwordChecklistContainer = document.getElementById('password-checklist');

const checklist = {
  length: document.getElementById('check-length'),
  uppercase: document.getElementById('check-uppercase'),
  lowercase: document.getElementById('check-lowercase'),
  number: document.getElementById('check-number'),
  special: document.getElementById('check-special')
};

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function updatePasswordChecklist(password) {
  toggleChecklistItem(checklist.length, password.length >= 8);
  toggleChecklistItem(checklist.uppercase, /[A-Z]/.test(password));
  toggleChecklistItem(checklist.lowercase, /[a-z]/.test(password));
  toggleChecklistItem(checklist.number, /[0-9]/.test(password));
  toggleChecklistItem(checklist.special, /[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/.test(password));
}

function toggleChecklistItem(element, condition) {
  if (condition) {
    element.classList.add('valid');
  } else {
    element.classList.remove('valid');
  }
}


function isValidPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/.test(password)
  );
}

passwordInput.addEventListener('focus', () => {
  passwordChecklistContainer.style.display = 'block';
});


passwordInput.addEventListener('input', () => {
  updatePasswordChecklist(passwordInput.value);
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  usernameError.classList.add('hidden');
  emailError.classList.add('hidden');
  passwordError.classList.add('hidden');

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!validateEmail(email)) {
    emailError.textContent = 'Invalid email format.';
    emailError.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    passwordError.textContent = 'Passwords do not match.';
    passwordError.classList.remove('hidden');
    return;
  }

  if (!isValidPassword(password)) {
    passwordError.textContent = 'Password does not meet the requirements.';
    passwordError.classList.remove('hidden');
    return;
  }

  // Daten an Backend senden
  try {
    const response = await fetch('http://172.16.2.165:3000/users/submit-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password, email })
    });

    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      const data = await response.json();
      if (data.error === 'username_taken') {
        usernameError.textContent = 'Username is already taken.';
        usernameError.classList.remove('hidden');
      } else if (data.error === 'email_taken') {
        emailError.textContent = 'Email is already registered.';
        emailError.classList.remove('hidden');
      } else {
        alert('Signup failed. Please try again.');
      }
    }
  } catch (err) {
    console.error(err);
    alert('Signup failed due to a network error.');
  }
});