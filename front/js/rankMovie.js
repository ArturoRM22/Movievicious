document.addEventListener('DOMContentLoaded', async function() {
    const movieId = getMovieIdFromUrl();
    const userId = getUserIdFromLocalStorage();
    console.log(movieId);

    function getMovieIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function getUserIdFromLocalStorage() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('JWT token not found.');
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

    if (movieId) {
        //console.log("Intentó");
        await getMovieDetails(movieId);
    }

    function submitRanking(movieId) {
        const rating = document.querySelector('input[name="rating"]:checked').value;
        axios.post('http://localhost:3001/api/rank', {
            user_id: userId,
            tmdb_id: movieId,
            ranking: rating
        })
        .then(response => {
            console.log('Ranking submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error submitting ranking:', error);
        });
    }

    async function getMovieDetails(movieId) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQxNTA1N2EyNTY0NWUxYTNhMjgxNDU0ZTk1MTNkMCIsInN1YiI6IjY2NjI0MGFiNTViY2UxZmFlMGNmZTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V12Yum-ICnPQC-_FXWF_ThIu4BVQeIRLd45SmsfpeJM'
            }
        };

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
            const movie = await response.json();
            const movieDetailsContainer = document.getElementById('movie-details');
            movieDetailsContainer.innerHTML = `
                <form id="rank-form">
                    <div class="row round">
                        <div class="col-3 round">
                            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="img round" alt="${movie.title}">
                        </div>
                        <div class="text-left col-9 pt round">
                            <h5 class="card-title">${movie.title}</h5>
                            <p>General grade of the movie</p>
                            <div class="star-rating" data-rating="${Math.round(movie.vote_average / 2)}"></div>
                            <p class="card-text">${movie.overview}</p>
                            <p>Your Grade of the movie</p>
                            <div class="container mt-5">
                                <div class="star-rating2">
                                    <input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="5 stars">★</label>
                                    <input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="4 stars">★</label>
                                    <input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="3 stars">★</label>
                                    <input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="2 stars">★</label>
                                    <input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="1 star">★</label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-outline-info round">Send your grade for this Movie</button>
                        </div>
                    </div>
                </form>
            `;

            // Attach event listener after form is rendered
            document.getElementById('rank-form').addEventListener('submit', function(event) {
                event.preventDefault();
                submitRanking(movieId);
            });

            // Initialize star ratings for movie details
            initializeStarRatings();
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    const stars = document.querySelectorAll('.star-rating2 input[type="radio"]');
    stars.forEach(star => {
        star.addEventListener('change', function() {
            console.log(`Calificación seleccionada: ${this.value} estrellas`);
        });
    });

// Function to decode JWT token (assuming it's a simple base64 encoded token)
function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT token:', error);
            return {};
        }
    }
});