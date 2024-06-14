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
            const recommendationsButton = document.getElementById('recommendationsButton');


            if (isLoggedIn()) {
                loginButton.style.display = 'none';
                logoutButton.style.display = 'block';
                signupButton.style.display = 'none';
                yourRanksLink.style.display = 'block';
                recommendationsButton.style.display = 'block';

            } else {
                loginButton.style.display = 'block';
                signupButton.style.display = 'block'; // Show signup button if not logged in
                logoutButton.style.display = 'none';
                yourRanksLink.style.display = 'none';
                recommendationsButton.style.display = 'none';

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

        document.getElementById('recommendationsButton').addEventListener('click', async function() {
            const userId = getUserIdFromLocalStorage(); // Replace with dynamic user ID if needed
            const recommendationsContent = document.getElementById('recommendationsContent');

            try {
                const response = await axios.get(`http://localhost:3001/api/recommendations/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });

                console.log('Recommendations fetched successfully!', response.data);
                const recommendations = response.data.recommendations;

                // Convert recommendations to HTML
                let recommendationsHtml = '<ul class="list-group">';
                //console.log(recommendations)
                if (recommendations == "No rankings found for the user.") {
                    recommendationsHtml += '<p>No hay recomendaciones, necesitas añadir rankings para poderte recomendar películas</p>';
                } else {
                recommendations.forEach(rec => {
                    if (rec.Recommendation) {
                        recommendationsHtml += `
                            <li class="list-group-item">
                                <p><strong>Recomendación:</strong> ${rec.Recommendation}</p>
                            </li>
                        `;
                    } else {
                        recommendationsHtml += `
                            <li class="list-group-item">
                                <h5>${rec.title}</h5>
                                <p>${rec.description}</p>
                            </li>
                        `;
                    }
                });
            }
                recommendationsHtml += '</ul>';

                recommendationsContent.innerHTML = recommendationsHtml;
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                recommendationsContent.innerHTML = '<div class="alert alert-danger">Failed to fetch recommendations. Please try again.</div>';
            }
        });

    } catch (error) {
        console.error('Error loading HTML:', error);
    }
});

function getUserIdFromLocalStorage() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('JWT token not found.');
        alert("Please log in to interact with the page");
        return null;
    }

    try {
        const decodedToken = parseJwt(token);
        return decodedToken.userId;
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}

// Function to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return {};
    }
}
