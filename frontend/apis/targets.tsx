import { Target } from "../models/targets";

export async function fetchTargets(targetId?: number): Promise<Target[]> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/targets/`;

    // Append query parameter if targetId is provided
    if (targetId) {
      url += `?target_id=${encodeURIComponent(targetId)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTarget(newTarget: Target) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTarget),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function bulkCreate(file: FormData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/bulk/`,
      {
        method: "POST",
        body: file,
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully:", data);
        // Handle success, e.g., show a success message
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle error, e.g., show an error message
      });
  } catch (error) {
    throw error;
  }
}

export async function deleteTarget(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/${id}/delete/`,
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
    const deletedTarget = await response.json();
    return deletedTarget;
  } catch (error) {
    throw error;
  }
}

export async function deleteBulkTarget(target_ids: number[]) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/delete/bulk/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({ target_ids: target_ids }),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const deletedTarget = await response.json();
    return deletedTarget;
  } catch (error) {
    throw error;
  }
}

export async function getMoonAltAz(start_time: string, end_time: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/getMoon/`,
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
    const moonAltAz = await response.json();
    return moonAltAz;
  } catch (error) {
    throw error;
  }
}

export async function getTargetSimbad(target_id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/${target_id}/simbad/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const targetSimbad = await response.json();
    return targetSimbad;
  } catch (error) {
    throw error;
  }
}

export async function getTargetSED(target_id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/targets/${target_id}/sed/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const targetSED = await response.json();
    return targetSED;
  } catch (error) {
    throw error;
  }
}
