export type Paciente = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  dataNascimento?: string; // <-- alinhar com o DTO do back
};
