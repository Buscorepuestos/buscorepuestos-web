import api from '../../api/api';

export const getGoogleReviews = async () => {
    try {
        const response = await api.get('/reviews');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching reviews", error);
        return [];
    }
};