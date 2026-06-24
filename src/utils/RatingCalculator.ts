

interface Review {
    nota: number;
}

export function calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    const validReviews = reviews.filter(review => review.nota >= 1 && review.nota <= 5);

    if (validReviews.length === 0) {
        return 0;
    }

    const totalSum = validReviews.reduce((sum, review) => sum + review.nota, 0);
    
    const average = totalSum / validReviews.length;
    
    return Math.round(average * 10) / 10;
}