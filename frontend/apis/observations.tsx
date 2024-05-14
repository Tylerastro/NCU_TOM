import {
  LulinObservations,
  LulinObservationsUpdate,
  NewObservation,
  Observation,
  ObservationUpdate,
} from "@/models/observations";
import useAxiosAuth from "@/apis/hooks/useAxiosAuth";

const ObservationApis = () => {
  const axiosAuth = useAxiosAuth();

  const createObservation = async (newObservation: NewObservation) => {
    try {
      const response = await axiosAuth.post(
        "/api/observations/",
        newObservation
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const putObservation = async (id: number, observation: ObservationUpdate) => {
    try {
      const response = await axiosAuth.put(
        `/api/observations/${id}/edit/`,
        observation
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteObservation = async (id: number) => {
    try {
      const response = await axiosAuth.post(
        "/api/observations/" + id + "/delete/"
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getObservations = async (
    observationId?: number
  ): Promise<Observation[]> => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/observations/`;
      if (observationId) {
        url += `?observation_id=${observationId}`;
      }
      const response = await axiosAuth.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getLulin = async (id: number): Promise<LulinObservations[]> => {
    try {
      const response = await axiosAuth.get(`/api/observations/${id}/lulin/`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const putLulin = async (pk: number, updateData: LulinObservationsUpdate) => {
    try {
      const response = await axiosAuth.put(
        `/api/observations/${pk}/lulin/`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getLulinCode = async (id: number, refresh: boolean = false) => {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/observations/lulin/${id}/code/`
      );
      url.searchParams.append("refresh", refresh ? "true" : "false");
      const response = await axiosAuth.get(url.toString());
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getObservationAltAz = async (
    id: number,
    start_time: string,
    end_time: string
  ) => {
    try {
      const response = await axiosAuth.post(
        "/api/observations/" + id + "/altaz/",
        {
          start_time: start_time,
          end_time: end_time,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const postObservationMessages = async (id: number, message: string) => {
    try {
      const response = await axiosAuth.post(
        "/api/observations/" + id + "/messages/",
        message
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    createObservation,
    putObservation,
    deleteObservation,
    getObservations,
    getLulin,
    putLulin,
    getLulinCode,
    getObservationAltAz,
    postObservationMessages,
  };
};

export default ObservationApis;
