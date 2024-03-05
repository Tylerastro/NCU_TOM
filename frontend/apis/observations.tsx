import {
  LulinObservations,
  LulinObservationsUpdate,
  ObservationUpdate,
  NewObservation,
  Observation,
} from "@/models/observations";

export async function createObservation(newObservation: NewObservation) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newObservation),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const createdObservation = await response.json();
    return createdObservation;
  } catch (error) {
    throw error;
  }
}

export async function putObservation(
  id: number,
  observation: ObservationUpdate
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/edit/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(observation),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const updatedObservation = await response.json();
    return updatedObservation;
  } catch (error) {
    throw error;
  }
}

export async function deleteObservation(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/delete/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const deletedObservation = await response.json();
    return deletedObservation;
  } catch (error) {
    throw error;
  }
}

export async function getObservations(observationId?: number) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/observations/`;
    if (observationId) {
      url += `?observation_id=${observationId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLulin(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/lulin/`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: LulinObservations[] = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function putLulin(
  pk: number,
  updateData: LulinObservationsUpdate
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/lulin/${pk}/`, // Include the pk in the URL
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: LulinObservations = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLulinCode(id: number, refresh: boolean = false) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/lulin/code/`
    );
    url.searchParams.append("refresh", refresh ? "true" : "false");
    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: string = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getObservationAltAz(
  id: number,
  start_time: string,
  end_time: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/lulin/altaz/`,
      {
        method: "POST",
        body: JSON.stringify({ start_time: start_time, end_time: end_time }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function postObservationMessages(id: number, message: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/observations/${id}/messages/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
