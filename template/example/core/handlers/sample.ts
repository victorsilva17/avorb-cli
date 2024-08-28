import { API } from "@/config/api";
import { sampleSchema, sampleType } from "@/core/models/sample";
import { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

// GET
export async function getAllSample() {
  const response: AxiosResponse<sampleType[]> = await API.get("/samples"); // change this line to the correct endpoint
  return response.data;
}

// POST
export async function createSample(data: sampleType) {
  const payload = { ...data, id: uuidv4() }; // Remove this line because the FrontEnd must not create the IDs.

  sampleSchema.parse(payload);

  const response: AxiosResponse<sampleType> = await API.post(
    "/samples", // change this line to the correct endpoint
    payload,
  );

  return response.data;
}

// PUT
export async function updateSample(data: sampleType) {
  sampleSchema.parse(data);

  console.table(data);

  const response: AxiosResponse<sampleType> = await API.put(
    `/samples/${data.id}`, // change this line to the correct endpoint
    data,
  );

  return response.data;
}

// DELETE
export async function deleteSample(id: string) {
  const response: AxiosResponse<string> = await API.delete(
    `/samples/${id}`, // change this line to the correct endpoint
  );
  return id;
}

// DELETE ALL
export async function deleteAllSample(ids: string[]) {
  if (ids.length == 0) return [];
  ids.forEach(async (id) => await API.delete(`/samples/${id}`));
  return ids;
}
