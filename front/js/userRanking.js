document.addEventListener('DOMContentLoaded', async function() {
    // Replace with dynamically retrieved user ID or other logic
    const user_id = 2;

    try {
        // Fetch user rankings from API
        const response = await axios.get(`http://localhost:3001/api/user-ranks/${user_id}`);
        const movies = response.data.data;

        const movieContainer = document.getElementById('movie-container');

        // Clear previous content (cards)
        movieContainer.innerHTML = '';

        // Iterate over each movie and create Bootstrap card elements
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4', 'custom-card'); // Adjust column width for responsiveness

            const cardContent = document.createElement('div');
            cardContent.classList.add('card', 'h-100');

            // Movie Poster
            const posterPath = `https://image.tmdb.org/t/p/w500${movie.movieDetails.poster_path}`;
            const posterImg = document.createElement('img');
            posterImg.classList.add('card-img-top', 'round');
            posterImg.src = posterPath;
            posterImg.alt = `${movie.movieDetails.title} Poster`;
            cardContent.appendChild(posterImg);

            // Card Body
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            // Movie Title
            const title = document.createElement('h5');
            title.classList.add('card-title', 'text-center');
            title.textContent = movie.movieDetails.title;
            cardBody.appendChild(title);

            // Movie Overview
            const overview = document.createElement('p');
            overview.classList.add('card-text', 'pl');
            overview.textContent = movie.movieDetails.overview;
            cardBody.appendChild(overview);

            // User Ranking - Fixed Star Ratings
            const userRankingFixed = document.createElement('div');
            userRankingFixed.classList.add('card-text', 'pl');

            const starsFixed = document.createElement('div');
            starsFixed.classList.add('star-rating');

            const fixedRatingValue = Math.round(movie.ranking); // Adjust as per your data

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

            // Button to Change Grade
            const changeGradeBtn = document.createElement('button');
            changeGradeBtn.textContent = 'Change your grade';
            changeGradeBtn.classList.add('btn', 'btn-outline-info', 'round', 'mt-3');
            changeGradeBtn.addEventListener('click', function() {
                userRankingFixed.classList.add('hidden');
                userRankingMovable.classList.remove('hidden');
            });
            cardBody.appendChild(changeGradeBtn);

            // User Ranking - Movable Star Ratings (Initially Hidden)
            const userRankingMovable = document.createElement('div');
            userRankingMovable.classList.add('card-text', 'pl', 'hidden');

            const starsMovable = document.createElement('div');
            starsMovable.classList.add('star-rating2');

            const ratingValues = [1, 2, 3, 4, 5]; // Assuming ratings from 1 to 5

            ratingValues.forEach(value => {
                const starInput = document.createElement('input');
                starInput.type = 'radio';
                starInput.id = `star${value}-movable`;
                starInput.name = 'rating';
                starInput.value = value;
                starsMovable.appendChild(starInput);

                const starLabel = document.createElement('label');
                starLabel.htmlFor = `star${value}-movable`;
                starLabel.title = `${value} stars`;
                starLabel.innerHTML = '★';
                starsMovable.appendChild(starLabel);
            });

            userRankingMovable.appendChild(starsMovable);
            cardBody.appendChild(userRankingMovable);

            cardContent.appendChild(cardBody);
            card.appendChild(cardContent);
            movieContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
});
