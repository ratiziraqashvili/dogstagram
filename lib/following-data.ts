import axios from "axios";

export async function fetchFollowingData(userId: string) {
    try {
        const response = await axios.get(`/api/users/${userId}/following`)
        const following = response.data;
        return following
    } catch (error) {
        console.error("Error fetching following data:", error);
        throw error;
    }
}