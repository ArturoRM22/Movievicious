// fetchMovies.js

document.addEventListener('DOMContentLoaded', function() {
    initializeStarRatings(); // Initialize star ratings on page load

    let currentPage = 1;

    function fetchMovies(page) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQxNTA1N2EyNTY0NWUxYTNhMjgxNDU0ZTk1MTNkMCIsInN1YiI6IjY2NjI0MGFiNTViY2UxZmFlMGNmZTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V12Yum-ICnPQC-_FXWF_ThIu4BVQeIRLd45SmsfpeJM'
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options)
            .then(response => response.json())
            .then(data => {
                const movieContainer = document.getElementById('movie-cards');
                movieContainer.innerHTML = ''; // Clear existing movies
                data.results.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('col-md-4', 'mb-4', 'd-flex', 'align-items-stretch');
                    movieCard.innerHTML = `
                        <div class="card h-100" data-bs-theme="dark">
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
                setupPagination(data.page, data.total_pages); // Setup pagination
            })
            .catch(err => console.error(err));
    }

    function setupPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        const maxVisibleButtons = 5;
        let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
        let endPage = startPage + maxVisibleButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
        }

        // Create previous button
        const prevButton = document.createElement('li');
        prevButton.classList.add('page-item');
        prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
        if (currentPage === 1) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                fetchMovies(currentPage - 1);
            });
        }
        paginationContainer.appendChild(prevButton);

        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('li');
            pageButton.classList.add('page-item');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                fetchMovies(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Create next button
        const nextButton = document.createElement('li');
        nextButton.classList.add('page-item');
        nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
        if (currentPage === totalPages) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                fetchMovies(currentPage + 1);
            });
        }
        paginationContainer.appendChild(nextButton);
    }

    // Initial fetch of movies
    fetchMovies(currentPage);
});
