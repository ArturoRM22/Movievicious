// fetchMovies.js

// Import the function if needed in future ES6 modules setup
// import { initializeStarRatings } from './starRating.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeStarRatings(); // Initialize star ratings on page load

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQxNTA1N2EyNTY0NWUxYTNhMjgxNDU0ZTk1MTNkMCIsInN1YiI6IjY2NjI0MGFiNTViY2UxZmFlMGNmZTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V12Yum-ICnPQC-_FXWF_ThIu4BVQeIRLd45SmsfpeJM'
        }
    };

    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
        .then(response => response.json())
        .then(data => {
            const movieContainer = document.getElementById('movie-cards');
            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('col-md-4', 'mb-4');
                movieCard.innerHTML = `
                    <div class="card height-cards" style="width: 18rem;" data-bs-theme="dark">
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${movie.title}</h5>
                            <p>Grade of the movie</p>
                            <div class="star-rating" data-rating="${Math.round(movie.vote_average / 2)}"></div>
                            <p class="card-text">${movie.overview}</p>
                            <a href="rankeds.html?id=${movie.id}" class="btn btn-outline-info round">Rank this Movie</a>
                        </div>
                    </div>
                `;
                movieContainer.appendChild(movieCard);
            });

            initializeStarRatings(); // Reinitialize star ratings for new movie cards
        })
        .catch(err => console.error(err));
});
