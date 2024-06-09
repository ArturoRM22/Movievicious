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

        // Function to check if user is logged in (JWT token present)
        function isLoggedIn() {
            return localStorage.getItem('jwtToken') !== null;
        }

        // Function to toggle visibility of login/logout buttons
        function toggleLoginButtons() {
            const loginButton = document.getElementById('loginButton');
            const logoutButton = document.getElementById('logoutButton');
            const signupButton = document.getElementById('signupButton');

            if (isLoggedIn()) {
                loginButton.style.display = 'none';
                logoutButton.style.display = 'block';   
                signupButton.style.display = 'none';
            } else {
                loginButton.style.display = 'block';
                signupButton.style.display = 'block'; // Show signup button if not logged in
                logoutButton.style.display = 'none';   
            }
        }

        // Initial toggle based on user's logged in status
        toggleLoginButtons();
        
        // Now that navbar.html is loaded, add event listener
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginMessage = document.getElementById('loginMessage');

            try {
                // Send login request to server
                const response = await axios.post('http://localhost:3001/auth/login', {
                    username,
                    password
                }, {
                    withCredentials: true // Ensure cookies are sent
                });

                console.log('Login successful!', response.data);

                // Store token in localStorage
                const token = response.data.token;
                localStorage.setItem('jwtToken', token);

                 // Show success message
                 loginMessage.innerHTML = '<div class="alert alert-success">Login successful!</div>';

                 // Close the modal after a short delay
                 setTimeout(() => {
                     const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                     loginModal.hide();
                 }, 2000);

                 toggleLoginButtons();//Update the buttons in the UI
 
             } catch (error) {
                 console.error('Error logging in:', error);
                 loginMessage.innerHTML = '<div class="alert alert-danger">Invalid username or password.</div>';
             }
});

// sign up logic

document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('signUpUsername').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const signUpMessage = document.getElementById('signUpMessage');

    // Email validation
    if (!validateEmail(email)) {
        signUpMessage.innerHTML = '<div class="alert alert-danger">Please enter a valid email address.</div>';
        return;
    }

    try {
        // Send sign-up request to server
        const response = await axios.post('http://localhost:3001/auth/register', {
            username,
            email,
            password
        });

        console.log('Sign-up successful!', response.data);

        // Show success message
        signUpMessage.innerHTML = '<div class="alert alert-success">Sign-up successful! You can now log in.</div>';

        // Close the modal after a short delay
        setTimeout(() => {
            const signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
            signUpModal.hide();
        }, 2000);

        toggleLoginButtons(); //Update the buttons in the UI

        } catch (error) {
        console.error('Error signing up:', error);
        signUpMessage.innerHTML = '<div class="alert alert-danger">Sign-up failed. Please try again.</div>';
        }
});

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Logout button event listener
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('jwtToken');
        console.log('Logout successful!');
        alert('You have been logged out successfully.');
        toggleLoginButtons();
        // Optionally, you can add more UI changes on logout here
    });
 
    // Call the fetchProtectedResource function to test fetching protected data
    // fetchProtectedResource(); // Uncomment if you want to test fetching protected data on page load

} catch (error) {
    console.error('Error loading HTML:', error);
}
});






