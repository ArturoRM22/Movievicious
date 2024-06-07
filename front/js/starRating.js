// starRating.js

function initializeStarRatings() {
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
        const ratingValue = parseInt(rating.getAttribute('data-rating'));
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            if (i <= ratingValue) {
                star.classList.add('filled');
            }
            rating.appendChild(star);
        }
    });
}
