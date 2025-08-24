// src/features/paciente/pages/PacientesPage.tsx
import { useEffect, useState } from "react";
import { getPacientes, deletePaciente, type PageResult } from "@/services/pacientes";
import type { Paciente } from "@/types/paciente";
import PatientsList from "@/features/paciente/PatientsList";

export default function PacientesPage() {
    const [data, setData] = useState<PageResult<Paciente>>({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
    });

    async function load(page = data.page, pageSize = data.pageSize) {
        const res = await getPacientes({ page, pageSize });
        setData(res);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <PatientsList
                pageResult={data}
                onEdit={(p) => console.log("Editar", p)}
                onDelete={async (id) => {
                    if (!confirm("Excluir paciente?")) return;
                    await deletePaciente(String(id));
                    load();
                }}
                onPageChange={(n) => load(n, data.pageSize)}
                onPageSizeChange={(n) => load(1, n)}
            />

        </div>
    );
}
