import { Target } from "../models/targets";
import useAxiosAuth from "@/apis/hooks/useAxiosAuth";

const TargetApis = () => {
  const axiosAuth = useAxiosAuth();

  const fetchTargets = async (targetId?: number): Promise<Target[]> => {
    try {
      let url = "/api/targets/";
      if (targetId) {
        url += `?target_id=${encodeURIComponent(targetId)}`;
      }
      const response = await axiosAuth.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createTarget = async (newTarget: Target) => {
    try {
      const response = await axiosAuth.post("/api/targets/", newTarget);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const bulkCreate = async (file: FormData) => {
    try {
      const response = await axiosAuth.post("/api/targets/bulk/", file);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteTarget = async (id: number) => {
    try {
      const response = await axiosAuth.post(`/api/targets/${id}/delete/`, {});
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteBulkTarget = async (target_ids: number[]) => {
    try {
      const response = await axiosAuth.post("/api/targets/bulk/delete/", {
        target_ids: target_ids,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getMoonAltAz = async (start_time: string, end_time: string) => {
    try {
      const response = await axiosAuth.post("/api/targets/moon/altaz/", {
        start_time: start_time,
        end_time: end_time,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getTargetSimbad = async (target_id: number) => {
    try {
      const response = await axiosAuth.get(
        "/api/targets/" + target_id + "/simbad"
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getTargetSED = async (target_id: number) => {
    try {
      const response = await axiosAuth.get(
        "/api/targets/" + target_id + "/sed/"
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    fetchTargets,
    createTarget,
    bulkCreate,
    deleteTarget,
    deleteBulkTarget,
    getMoonAltAz,
    getTargetSimbad,
    getTargetSED,
  };
};

export default TargetApis;
