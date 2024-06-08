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
        
        // Now that navbar.html is loaded, add event listener
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

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

                // Close the modal after successful login
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.hide();

                // Optionally, perform actions after login like fetching data
                // Example:
                // fetchData();

            } catch (error) {
                console.error('Error logging in:', error);
                // Display error message to user
                // Example:
                // const errorMessageElement = document.getElementById('loginErrorMessage');
                // errorMessageElement.innerText = 'Invalid username or password';
            }
        });

        // Function to fetch protected resource using stored JWT token
        async function fetchProtectedResource() {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    console.error('JWT token not found.');
                    return;
                }

                // Fetch protected resource using the stored token
                const protectedResponse = await axios.get('http://localhost:3001/api/protected', {
                    headers: {
                        Authorization: `Bearer ${token}` // Set Authorization header with stored JWT token
                    },
                    withCredentials: true // Ensure cookies are sent
                });

                console.log('Protected route response:', protectedResponse.data);
            } catch (error) {
                console.error('Error fetching protected resource:', error);
            }
        }

        // Call the fetchProtectedResource function to test fetching protected data
        fetchProtectedResource(); // Uncomment if you want to test fetching protected data on page load

    } catch (error) {
        console.error('Error loading HTML:', error);
    }
});


