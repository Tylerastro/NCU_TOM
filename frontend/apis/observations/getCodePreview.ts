import api from "@/apis/axios";

import { format, toZonedTime } from "date-fns-tz";
import { addDays } from "date-fns";

export const getCodePreview = async (date: Date) => {
  const start_date = toZonedTime(
    new Date(format(date, "yyyy-MM-dd" + " 18:00:00")),
    "Asia/Taipei"
  );
  const end_date = toZonedTime(
    new Date(format(addDays(date, 1), "yyyy-MM-dd" + " 08:00:00")),
    "Asia/Taipei"
  );
  try {
    const response = await api.get("/api/observations/lulin/code/", {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
