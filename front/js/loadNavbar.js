function loadHTML(id, url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
            throw error; // Propagate the error further
        });
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        await loadHTML('navbar', 'navbar.html');

        function isLoggedIn() {
            return localStorage.getItem('jwtToken') !== null;
        }

        function toggleLoginButtons() {
            const loginButton = document.getElementById('loginButton');
            const logoutButton = document.getElementById('logoutButton');
            const signupButton = document.getElementById('signupButton');
            const yourRanksLink = document.getElementById('your_ranks');

            if (isLoggedIn()) {
                loginButton.style.display = 'none';
                logoutButton.style.display = 'block';
                signupButton.style.display = 'none';
                yourRanksLink.style.display = 'block';
            } else {
                loginButton.style.display = 'block';
                signupButton.style.display = 'block'; // Show signup button if not logged in
                logoutButton.style.display = 'none';
                yourRanksLink.style.display = 'none';
            }
        }

        toggleLoginButtons();

        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginMessage = document.getElementById('loginMessage');

            try {
                const response = await axios.post('http://localhost:3001/auth/login', {
                    username,
                    password
                }, {
                    withCredentials: true
                });

                console.log('Login successful!', response.data);

                const token = response.data.token;
                localStorage.setItem('jwtToken', token);

                loginMessage.innerHTML = '<div class="alert alert-success">Login successful!</div>';

                setTimeout(() => {
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    loginModal.hide();
                    loginMessage.innerHTML = ''; // Clear the message after hiding
                    window.location.reload(); // Reload the page after login
                }, 2000);

                toggleLoginButtons();

            } catch (error) {
                console.error('Error logging in:', error);
                loginMessage.innerHTML = '<div class="alert alert-danger">Invalid username or password.</div>';
            }
        });

        document.getElementById('signUpForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('signUpUsername').value;
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            const signUpMessage = document.getElementById('signUpMessage');

            if (!validateEmail(email)) {
                signUpMessage.innerHTML = '<div class="alert alert-danger">Please enter a valid email address.</div>';
                return;
            }

            try {
                const response = await axios.post('http://localhost:3001/auth/register', {
                    username,
                    email,
                    password
                });

                console.log('Sign-up successful!', response.data);

                signUpMessage.innerHTML = '<div class="alert alert-success">Sign-up successful! You can now log in.</div>';

                setTimeout(() => {
                    const signUpModal = bootstrap.Modal.getInstance(document.getElementById('signUpModal'));
                    signUpModal.hide();
                    signUpMessage.innerHTML = ''; // Clear the message after hiding
                }, 2000);

                toggleLoginButtons();

            } catch (error) {
                console.error('Error signing up:', error);
                signUpMessage.innerHTML = '<div class="alert alert-danger">Sign-up failed. Please try again.</div>';
            }
        });

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        document.getElementById('logoutButton').addEventListener('click', function() {
            localStorage.removeItem('jwtToken');
            console.log('Logout successful!');
            alert('You have been logged out successfully.');
            toggleLoginButtons();
            window.location.reload(); // Reload the page after logout
        });

    } catch (error) {
        console.error('Error loading HTML:', error);
    }
});
