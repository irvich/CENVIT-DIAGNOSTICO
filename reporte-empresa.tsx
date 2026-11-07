import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Printer, Users, Award, TrendingUp, Building2 } from "lucide-react";

type Participant = {
  name: string; email: string; registeredAt: string; done: number;
  bestScore: number | null; passed: boolean; certCode: string | null; certDate: string | null;
};
type Report = {
  companyName: string; courseTitle: string; totalSeats: number; usedSeats: number;
  totalLessons: number; generatedAt: string; participants: Participant[];
};

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString("es-EC") : "—");

function estado(p: Participant, total: number) {
  if (p.certCode) return { t: "Certificado", c: "bg-green-100 text-green-800" };
  if (p.passed) return { t: "Aprobado", c: "bg-emerald-100 text-emerald-800" };
  if (p.done > 0 || p.bestScore != null) return { t: "En curso", c: "bg-amber-100 text-amber-800" };
  return { t: "Sin iniciar", c: "bg-slate-100 text-slate-700" };
}

export default function ReporteEmpresaPage() {
  const [, params] = useRoute("/reporte-empresa/:id/:sig");
  const [data, setData] = useState<Report | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params) return;
    api.get<Report>(`/reporte-empresa/${params.id}/${params.sig}`)
      .then(setData)
      .catch(() => setError("El reporte no está disponible o el enlace no es válido."));
  }, [params?.id, params?.sig]);

  if (error) return <div className="min-h-screen flex items-center justify-center p-6 text-slate-700">{error}</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando reporte…</div>;

  const total = data.totalLessons || 1;
  const ps = data.participants;
  const pct = (p: Participant) => Math.min(100, Math.round((p.done / total) * 100));
  const certificados = ps.filter((p) => p.certCode).length;
  const iniciados = ps.filter((p) => p.done > 0 || p.bestScore != null).length;
  const promedio = ps.length ? Math.round(ps.reduce((a, p) => a + pct(p), 0) / ps.length) : 0;

  function descargarCSV() {
    const head = ["Participante", "Correo", "Fecha de registro", "Avance %", "Mejor nota evaluación", "Estado", "Código certificado", "Fecha certificado"];
    const lines = ps.map((p) => [p.name, p.email, fmt(p.registeredAt), pct(p), p.bestScore ?? "", estado(p, total).t, p.certCode ?? "", fmt(p.certDate)]);
    const csv = [head, ...lines].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Reporte_CENVIT_${data!.companyName.replace(/[^\w]+/g, "_")}.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <header className="bg-[#0b2a5b] text-white print:bg-white print:text-black print:border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-[#d4af37] font-semibold">CENVIT · REPORTE DE CAPACITACIÓN EMPRESARIAL</p>
            <h1 className="text-2xl font-bold mt-1 flex items-center gap-2"><Building2 className="w-6 h-6" />{data.companyName}</h1>
            <p className="text-sm opacity-90 mt-1">{data.courseTitle}</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button onClick={descargarCSV} className="bg-[#d4af37] hover:bg-[#c29d2a] text-[#0b2a5b] gap-2"><Download className="w-4 h-4" />Descargar Excel (CSV)</Button>
            <Button onClick={() => window.print()} variant="outline" className="gap-2 text-[#0b2a5b]"><Printer className="w-4 h-4" />Imprimir / PDF</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { i: Users, l: "Cupos utilizados", v: `${data.usedSeats} / ${data.totalSeats}` },
            { i: TrendingUp, l: "Participantes que iniciaron", v: `${iniciados}` },
            { i: TrendingUp, l: "Avance promedio", v: `${promedio}%` },
            { i: Award, l: "Certificados emitidos", v: `${certificados}` },
          ].map((k) => (
            <div key={k.l} className="bg-white rounded-xl border p-4">
              <k.i className="w-5 h-5 text-[#1e88e5]" />
              <p className="text-2xl font-bold text-[#0b2a5b] mt-2">{k.v}</p>
              <p className="text-xs text-slate-500">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left p-3">Participante</th>
                <th className="text-left p-3">Registro</th>
                <th className="text-left p-3 w-48">Avance</th>
                <th className="text-left p-3">Evaluación</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Certificado</th>
              </tr>
            </thead>
            <tbody>
              {ps.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">Aún no se han registrado participantes.</td></tr>
              )}
              {ps.map((p) => {
                const e = estado(p, total);
                return (
                  <tr key={p.email} className="border-t">
                    <td className="p-3"><p className="font-medium text-slate-800">{p.name}</p><p className="text-xs text-slate-500">{p.email}</p></td>
                    <td className="p-3 text-slate-600">{fmt(p.registeredAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded bg-slate-200"><div className="h-2 rounded bg-[#1e88e5]" style={{ width: `${pct(p)}%` }} /></div>
                        <span className="text-xs w-9 text-right">{pct(p)}%</span>
                      </div>
                    </td>
                    <td className="p-3">{p.bestScore != null ? `${Math.round(p.bestScore)} / 100` : "—"}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${e.c}`}>{e.t}</span></td>
                    <td className="p-3 text-xs">{p.certCode ? <><p className="font-mono">{p.certCode}</p><p className="text-slate-500">{fmt(p.certDate)}</p></> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Reporte generado el {new Date(data.generatedAt).toLocaleString("es-EC")}. La información se actualiza en tiempo real cada vez que se abre este enlace.
          Los certificados pueden validarse en cenvit.net con su código. Este reporte sirve como respaldo documental de la capacitación ante el Ministerio del Trabajo.
        </p>
      </main>
    </div>
  );
}
