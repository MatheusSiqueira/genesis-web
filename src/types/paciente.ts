export interface Paciente {
  id: string;       // ajuste se seu backend usa "guid" como "id"
  nome: string;
  cpf: string;
  email?: string;
  dataNascimento?: string; // ISO
}
