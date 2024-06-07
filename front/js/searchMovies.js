// searchMovies.js

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) { // Asegurarse de que el elemento existe
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío del formulario
            const query = searchInput.value.trim();
            if (query) {
                searchMovies(query);
            }
        });
    }

    async function searchMovies(query) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQxNTA1N2EyNTY0NWUxYTNhMjgxNDU0ZTk1MTNkMCIsInN1YiI6IjY2NjI0MGFiNTViY2UxZmFlMGNmZTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V12Yum-ICnPQC-_FXWF_ThIu4BVQeIRLd45SmsfpeJM'
            }
        };

        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=1`, options);
            const data = await response.json();

            const movieContainer = document.getElementById('movie-cards');
            movieContainer.innerHTML = ''; // Clear existing movies

            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('col-md-4', 'mb-4', 'd-flex', 'align-items-stretch');
                movieCard.innerHTML = `
                    <div class="card h-100">
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <h5 class="card-title">${movie.title}</h5>
                            <p>Grade of the movie</p>
                            <div class="star-rating" data-rating="${Math.round(movie.vote_average / 2)}"></div>
                            <p class="card-text">${movie.overview}</p>
                            <a href="rankeds.html?id=${movie.id}" class="btn btn-outline-info round mt-auto">Rank this Movie</a>
                        </div>
                    </div>
                `;
                movieContainer.appendChild(movieCard);
            });

            initializeStarRatings(); // Reinitialize star ratings for new movie cards
        } catch (err) {
            console.error(err);
        }
    }
});
