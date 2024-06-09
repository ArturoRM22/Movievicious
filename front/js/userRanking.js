document.addEventListener('DOMContentLoaded', async function () {
    try {
        const movieContainer = document.getElementById('movie-container');

        // Fetch and display movies
        await fetchAndDisplayMovies();

        async function fetchAndDisplayMovies() {
            const userId = getUserIdFromLocalStorage();
            if (!userId) return; // If user is not logged in, stop execution

            const response = await axios.get(`http://localhost:3001/api/user-ranks/${userId}`);
            const movies = response.data.data;

            movieContainer.innerHTML = '';

            movies.forEach(movie => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-4', 'custom-card');

                const cardContent = document.createElement('div');
                cardContent.classList.add('card', 'h-100');

                const posterPath = `https://image.tmdb.org/t/p/w500${movie.movieDetails.poster_path}`;
                const posterImg = document.createElement('img');
                posterImg.classList.add('card-img-top', 'round');
                posterImg.src = posterPath;
                posterImg.alt = `${movie.movieDetails.title} Poster`;
                cardContent.appendChild(posterImg);

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const title = document.createElement('h5');
                title.classList.add('card-title', 'text-center');
                title.textContent = movie.movieDetails.title;
                cardBody.appendChild(title);

                const overview = document.createElement('p');
                overview.classList.add('card-text', 'pl');
                overview.textContent = movie.movieDetails.overview;
                cardBody.appendChild(overview);

                const userRankingFixed = document.createElement('div');
                userRankingFixed.classList.add('card-text', 'pl');

                const starsFixed = document.createElement('div');
                starsFixed.classList.add('star-rating');

                const fixedRatingValue = Math.round(movie.ranking);
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.innerHTML = '★';
                    if (i <= fixedRatingValue) {
                        star.classList.add('filled');
                    }
                    starsFixed.appendChild(star);
                }

                userRankingFixed.appendChild(starsFixed);
                cardBody.appendChild(userRankingFixed);

                const deleteGradeBtn = document.createElement('button');
                deleteGradeBtn.textContent = 'Delete your grade';
                deleteGradeBtn.classList.add('btn', 'btn-outline-danger', 'round', 'mt-3');
                deleteGradeBtn.addEventListener('click', async function () {
                    const userId = getUserIdFromLocalStorage();
                    if (!userId) return; // If user is not logged in, stop execution
                    try {
                        await axios.delete(`http://localhost:3001/api/delete-ranking/${movie.id}`);
                        card.remove();
                    } catch (error) {
                        console.error('Error deleting ranking:', error);
                    }
                });
                cardBody.appendChild(deleteGradeBtn);

                const updateGradeBtn = document.createElement('button');
                updateGradeBtn.textContent = 'Update your grade';
                updateGradeBtn.classList.add('btn', 'btn-outline-info', 'round', 'mt-3', 'mr-2');
                updateGradeBtn.addEventListener('click', function () {
                    userRankingFixed.classList.add('hidden');
                    userRankingMovable.classList.remove('hidden');
                });
                cardBody.appendChild(updateGradeBtn);

                const userRankingMovable = document.createElement('div');
                userRankingMovable.classList.add('card-text', 'pl', 'hidden');

                const starsMovable = document.createElement('div');
                starsMovable.classList.add('star-rating2');

                const ratingValues = [5, 4, 3, 2, 1]; // Assuming ratings from 1 to 5

                ratingValues.forEach(value => {
                    const starInput = document.createElement('input');
                    starInput.type = 'radio';
                    starInput.id = `star${value}-movable-${movie.id}`;
                    starInput.name = `rating-${movie.id}`;
                    starInput.value = value;
                    starsMovable.appendChild(starInput);

                    const starLabel = document.createElement('label');
                    starLabel.htmlFor = `star${value}-movable-${movie.id}`;
                    starLabel.title = `${value} stars`;
                    starLabel.innerHTML = '★';
                    starsMovable.appendChild(starLabel);
                });

                userRankingMovable.appendChild(starsMovable);
                cardBody.appendChild(userRankingMovable);

                const submitGradeBtn = document.createElement('button');
                submitGradeBtn.textContent = 'Submit';
                submitGradeBtn.classList.add('btn', 'btn-outline-success', 'round', 'mt-3');
                submitGradeBtn.addEventListener('click', async function () {
                    const userId = getUserIdFromLocalStorage();
                    if (!userId) return; // If user is not logged in, stop execution
                    const checkedInput = starsMovable.querySelector(`input[name="rating-${movie.id}"]:checked`);
                    console.log(checkedInput); // Log the checked input for debugging
                    if (!checkedInput) {
                        alert('Please select a rating.');
                        return;
                    }

                    const newRating = checkedInput.value;
                    console.log(newRating); // Log the new rating for debugging
                    try {
                        await axios.patch(`http://localhost:3001/api/update-ranking/${movie.id}`, {
                            ranking: newRating
                        });

                        const updatedResponse = await axios.get(`http://localhost:3001/api/user-ranks/${userId}`);
                        const updatedMovies = updatedResponse.data.data;
                        const updatedMovie = updatedMovies.find(m => m.id === movie.id);

                        const fixedRatingValueUpdated = Math.round(updatedMovie.ranking);
                        starsFixed.innerHTML = ''; // Clear previous stars
                        for (let i = 1; i <= 5; i++) {
                            const star = document.createElement('span');
                            star.innerHTML = '★';
                            if (i <= fixedRatingValueUpdated) {
                                star.classList.add('filled');
                            }
                            starsFixed.appendChild(star);
                        }

                        alert('Ranking updated successfully!');
                    } catch (error) {
                        console.error('Error updating ranking:', error);
                        alert('Failed to update ranking.');
                    }
                });
                cardBody.appendChild(submitGradeBtn);

                cardContent.appendChild(cardBody);
                card.appendChild(cardContent);
                movieContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
});

// Function to get user ID from local storage
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
