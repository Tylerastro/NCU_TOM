import { NewTag } from "@/models/helpers";
import useAxiosAuth from "@/apis/hooks/useAxiosAuth";

const TagApis = () => {
  const axiosAuth = useAxiosAuth();

  const fetchTags = async () => {
    try {
      const response = await axiosAuth.get("/api/tags/");
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const postNewTag = async (tag: NewTag) => {
    try {
      const response = await axiosAuth.post("/api/tags/", tag);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    fetchTags,
    postNewTag,
  };
};

export default TagApis;
