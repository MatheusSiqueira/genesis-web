import { api } from "./api";
import type { Paciente } from "@/types/paciente";

export async function getPacientes(): Promise<Paciente[]> {
  const { data } = await api.get("/paciente");
  return data;
}

export async function deletePaciente(id: string): Promise<void> {
  await api.delete(`/paciente/${id}`);
}

export async function createPaciente(payload: Omit<Paciente, "id">): Promise<Paciente> {
  const { data } = await api.post("/paciente", payload);
  return data;
}

export async function updatePaciente(id: string, payload: Omit<Paciente, "id">): Promise<void> {
  await api.put(`/paciente/${id}`, payload);
}

// opcional, caso precise
export async function getPacienteById(id: string): Promise<Paciente> {
  const { data } = await api.get(`/paciente/${id}`);
  return data;
}