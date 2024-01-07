import axios from "axios";

export async function fetchFollowingData(userId: string) {
    try {
        const response = await axios.get(`/api/users/${userId}/following`)
        const following = response.data;

        const followingIds = following.followingIds;
        const followerCount = following.followerCount;
        const followingCount = following.followingCount;

        return { followingIds, followerCount, followingCount };
    } catch (error) {
        console.error("Error fetching following data:", error);
        return { followingIds: [], followerCount: 0, followingCount: 0 };
    }
}