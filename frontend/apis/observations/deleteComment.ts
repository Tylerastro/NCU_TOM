import api from "@/apis/axios";

export const deleteComment = async (commentId: number) => {
  console.log(`Attempting to delete comment with ID: ${commentId}`);

  try {
    const response = await api.delete(`/api/comments/${commentId}/`);

    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
