// src/services/pacientes.ts
import { api } from "./api";
import type { Paciente } from "@/types/paciente";

export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export async function getPacientes(params: {
  page: number;
  pageSize: number;
  q?: string;
}): Promise<PageResult<Paciente>> {
  const { data } = await api.get<PageResult<Paciente>>("/paciente", { params });
  return data;
}

/* ---------- CRUD ---------- */
export async function deletePaciente(id: string): Promise<void> {
  await api.delete(`/paciente/${id}`);
}

export async function createPaciente(
  payload: Omit<Paciente, "id">
): Promise<Paciente> {
  const { data } = await api.post("/paciente", payload);
  return data;
}

export async function updatePaciente(
  id: string,
  payload: Omit<Paciente, "id">
): Promise<void> {
  await api.put(`/paciente/${id}`, payload);
}

export async function getPacienteById(id: string): Promise<Paciente> {
  const { data } = await api.get(`/paciente/${id}`);
  return data;
}
