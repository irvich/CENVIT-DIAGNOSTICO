import { useEffect } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/site-nav";

const WA = "593964004110";
const wa = (m: string) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const CURSO_40H = "/curso/5765";

const OBLIGATORIAS = [
  {
    tag: "Disponible", norma: "Acuerdo Ministerial MDT-2025-006", t: "Igualdad, derechos laborales y no discriminación",
    h: "40 horas · virtual (36 h en plataforma + 4 h en vivo)", p: "25", v: "20",
    it: ["Los 4 temas obligatorios: derechos laborales, igualdad de género, no violencia y no discriminación, trabajo de igual valor", "Sesión en vivo con la máxima autoridad o su delegado", "Acción de sensibilización incluida, con evidencia aparte", "Certificado individual con código de verificación"],
    cta: "curso",
  },
  {
    tag: "Por cohorte", norma: "Acuerdos MDT-2025-102 y MDT-2025-186", t: "Prevención del acoso laboral y de los riesgos psicosociales",
    h: "20 horas · virtual, para todo el personal", p: "15", v: "12",
    it: ["Qué es y qué no es acoso laboral; rutas de denuncia y atención", "Factores de riesgo psicosocial y autocuidado", "Socialización del protocolo interno de la empresa", "Certificado individual con código de verificación"],
  },
  {
    tag: "Por cohorte", norma: "Acuerdo Interministerial MDT-MSP-2019-038", t: "Prevención del consumo de alcohol, tabaco y otras drogas",
    h: "4 horas · virtual o en vivo", p: "8", v: "",
    it: ["Taller de sensibilización para todo el personal", "Material de apoyo para el programa de prevención de la empresa", "Registro de asistencia como evidencia", "Certificado de participación"],
  },
];

const SERVICIOS = [
  ["Protocolo contra el acoso laboral", "Elaboración del Protocolo Interno de Prevención y Erradicación de la Discriminación, Violencia y Acoso Laboral, listo para registrar. Obligatorio para empresas con 10 o más trabajadores."],
  ["Programa de prevención de riesgos psicosociales", "Aplicación del cuestionario del Ministerio del Trabajo, análisis de resultados por dimensión y programa de prevención con indicadores."],
  ["Plan de Igualdad", "Diagnóstico y plan para empresas con 50 o más trabajadores (Ley Orgánica para Impulsar la Economía Violeta). Plazo de registro vigente: 31 de diciembre de 2026."],
  ["Diagnóstico de clima laboral", "Encuesta confidencial, informe ejecutivo por áreas y plan de mejora, con la plataforma CENVIT Clima."],
];

const EVIDENCIAS = [
  ["Certificado individual", "Cada trabajador recibe su certificado con código de verificación en línea y opción de agregarlo a LinkedIn."],
  ["Reportes de la plataforma", "Matrícula, avance, tiempos y calificaciones por participante, descargables."],
  ["Respaldo de las sesiones en vivo", "Asistencia, grabación y acta con la participación de la máxima autoridad o su delegado."],
  ["Expediente para el reporte", "Evidencias ordenadas para registrar la capacitación en el Sistema Único de Trabajo (SUT)."],
];

const PASOS = [
  ["Diagnóstico", "Nos cuenta cuántas personas tiene y qué obligaciones necesita cubrir."],
  ["Propuesta", "Le enviamos la propuesta con cronograma y valor por persona. Factura electrónica."],
  ["Matrícula", "Cargamos a su personal en la plataforma y les enviamos sus accesos."],
  ["Ejecución y cierre", "Seguimos el avance, realizamos las sesiones en vivo y le entregamos el expediente."],
];

const FAQ = [
  ["¿La capacitación de 40 horas puede ser virtual?", "Sí. El Acuerdo MDT-2025-006 permite la modalidad virtual, presencial o mixta. Nuestro programa combina 36 horas en plataforma con 4 horas en vivo, en las que participa la máxima autoridad o su delegado."],
  ["¿Hasta cuándo se puede reportar?", "El Acuerdo MDT-2025-185 amplió hasta el 30 de noviembre de 2026 el plazo para reportar en el SUT las acciones de capacitación y sensibilización correspondientes a 2025. La obligación de 2026 se mantiene y se reporta en enero de 2027."],
  ["¿Cuánto cuesta para mi empresa?", "USD 25 por persona en el curso de 40 horas, y USD 20 por persona desde 20 participantes. Para empresas grandes o paquetes combinados le enviamos una propuesta a medida."],
  ["¿Incluyen capacitación técnica en seguridad y salud?", "Nuestra especialidad es el componente psicosocial, el acoso laboral, la igualdad y el clima laboral. La capacitación técnica (equipos de protección, extintores, evacuación) corresponde al técnico de seguridad de su empresa o al Cuerpo de Bomberos."],
  ["¿Cómo se paga?", "Por transferencia bancaria o con tarjeta mediante PayPhone. Todos los pagos tienen factura electrónica."],
];

const navy = "text-[#162963]";
const H2 = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
  <div className="max-w-3xl mb-9">
    <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-2">{eyebrow}</p>
    <h2 className={`text-2xl md:text-3xl font-semibold ${navy}`}>{title}</h2>
    {text && <p className="text-gray-500 mt-3">{text}</p>}
  </div>
);
const Check = ({ items }: { items: readonly string[] }) => (
  <ul className="space-y-2.5 mb-6 flex-1">
    {items.map((t) => (
      <li key={t} className="flex gap-2.5 text-[15px] text-gray-700"><span className={`${navy} font-bold`}>✓</span>{t}</li>
    ))}
  </ul>
);
const btn = "inline-block text-center font-semibold text-sm px-5 py-3 rounded-lg border border-[#162963] transition";
const solid = `${btn} bg-[#162963] text-white hover:bg-[#0f1e4a]`;
const ghost = `${btn} bg-white text-[#162963] hover:bg-gray-50`;

export default function EmpresasPage() {
  useEffect(() => { document.title = "CENVIT Empresas — Capacitación obligatoria y cumplimiento laboral"; }, []);
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteNav />
      <header className="pt-32 pb-14 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-3">CENVIT · Empresas e instituciones</p>
          <h1 className={`text-3xl md:text-5xl font-semibold leading-tight max-w-4xl ${navy}`}>Capacitación obligatoria y cumplimiento laboral, con evidencias listas para el Ministerio del Trabajo.</h1>
          <p className="text-lg text-gray-600 mt-5 mb-8 max-w-3xl">Programas virtuales para todo su personal, certificados individuales verificables y acompañamiento de un psicólogo laboral en acoso, riesgos psicosociales, igualdad y clima laboral.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#obligatorias" className={solid}>Ver capacitaciones obligatorias</a>
            <a href={wa("Hola CENVIT, quisiera una propuesta de capacitación para mi empresa.")} className={ghost}>Cotizar por WhatsApp</a>
          </div>
        </div>
      </header>

      <section className="bg-[#f5f6f9] border-b border-gray-200"><div className="max-w-6xl mx-auto px-5 py-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white border-l-4 border-[#c9a227] rounded-r-lg p-4">
          <p className="text-sm text-gray-500">Igualdad salarial · Acuerdo MDT-2025-006</p>
          <p className={`font-semibold ${navy}`}>Reporte en el SUT hasta el 30 de noviembre de 2026</p>
        </div>
        <div className="bg-white border-l-4 border-[#c9a227] rounded-r-lg p-4">
          <p className="text-sm text-gray-500">Plan de Igualdad · empresas con 50 o más trabajadores</p>
          <p className={`font-semibold ${navy}`}>Registro hasta el 31 de diciembre de 2026</p>
        </div>
      </div></section>

      <section id="obligatorias" className="py-16 scroll-mt-24"><div className="max-w-6xl mx-auto px-5">
        <H2 eyebrow="Capacitaciones obligatorias" title="Cumpla sus obligaciones de capacitación" text="Precios por participante, en dólares. Desde 20 personas aplica la tarifa por volumen." />
        <div className="grid md:grid-cols-3 gap-5">
          {OBLIGATORIAS.map((c, i) => (
            <div key={c.t} className={`relative bg-white rounded-xl p-7 flex flex-col ${i === 0 ? "border-2 border-[#162963]" : "border border-gray-200"}`}>
              <span className={`absolute -top-3 left-6 text-xs font-semibold px-2.5 py-1 rounded ${i === 0 ? "bg-[#162963] text-white" : "bg-white border border-gray-300 text-gray-600"}`}>{c.tag}</span>
              <p className="text-xs text-gray-500 mt-1">{c.norma}</p>
              <h3 className={`text-lg font-semibold mt-1 ${navy}`}>{c.t}</h3>
              <p className="text-gray-500 text-sm mt-1">{c.h}</p>
              <p className={`text-4xl font-semibold mt-5 ${navy}`}><span className="text-sm text-gray-500 font-medium mr-1">USD</span>{c.p}<span className="text-sm text-gray-500 font-medium ml-1">por persona</span></p>
              <p className="text-sm text-gray-500 mb-5">{c.v ? `USD ${c.v} por persona desde 20 participantes` : "Tarifa por grupo bajo cotización"}</p>
              <Check items={c.it} />
              {c.cta === "curso"
                ? <div className="flex flex-col gap-2"><Link href={CURSO_40H} className={solid}>Ver el curso</Link><a href={wa(`Hola CENVIT, quiero cotizar el curso "${c.t}" para mi empresa.`)} className={ghost}>Cotizar para mi empresa</a></div>
                : <a href={wa(`Hola CENVIT, quiero cotizar "${c.t}" para mi empresa.`)} className={ghost}>Cotizar para mi empresa</a>}
            </div>
          ))}
        </div>
        <div className="mt-6 p-6 rounded-xl bg-[#162963] text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-blue-200">Paquete</p>
            <p className="text-xl font-semibold">Cumplimiento Laboral: los tres programas</p>
            <p className="text-blue-100 text-[15px]">USD 40 por persona · USD 32 por persona desde 20 participantes</p>
          </div>
          <a href={wa("Hola CENVIT, quiero cotizar el paquete Cumplimiento Laboral para mi empresa.")} className={`${btn} bg-white text-[#162963] border-white`}>Solicitar propuesta</a>
        </div>
      </div></section>

      <section className="py-16 bg-[#f5f6f9]"><div className="max-w-6xl mx-auto px-5">
        <H2 eyebrow="Consultoría" title="Documentos y programas para su empresa" text="Elaborados por un psicólogo laboral, con base en la normativa vigente del Ministerio del Trabajo. Se cotizan según el tamaño de la organización." />
        <div className="grid md:grid-cols-2 gap-5">
          {SERVICIOS.map(([t, d]) => (
            <div key={t} className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className={`text-lg font-semibold mb-2 ${navy}`}>{t}</h3>
              <p className="text-gray-500 text-[15px] mb-4">{d}</p>
              <a href={wa(`Hola CENVIT, quiero información sobre: ${t}.`)} className={`text-sm font-semibold ${navy}`}>Solicitar información →</a>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 border border-dashed border-gray-300 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white">
          <div><p className="font-semibold">¿Necesita un programa a la medida de su organización?</p><p className="text-gray-500 text-[15px]">Liderazgo, gestión del talento humano, formación de formadores y más, con diagnóstico previo.</p></div>
          <Link href="/servicios/capacitacion-empresarial" className={ghost}>Capacitación a medida</Link>
        </div>
      </div></section>

      <section className="py-16"><div className="max-w-6xl mx-auto px-5">
        <H2 eyebrow="Evidencias" title="Lo que recibe su empresa" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {EVIDENCIAS.map(([a, b]) => (
            <div key={a} className="pl-4 border-l-2 border-[#162963]"><p className="font-semibold">{a}</p><p className="text-gray-500 text-[15px]">{b}</p></div>
          ))}
        </div>
      </div></section>

      <section className="py-16 bg-[#f5f6f9]"><div className="max-w-6xl mx-auto px-5">
        <H2 eyebrow="Proceso" title="Cómo trabajamos" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PASOS.map(([a, b], i) => (
            <div key={a} className="border-t-2 border-[#162963] pt-4"><p className={`font-semibold mb-1 ${navy}`}>{i + 1}. {a}</p><p className="text-gray-500 text-[15px]">{b}</p></div>
          ))}
        </div>
      </div></section>

      <section className="py-16"><div className="max-w-6xl mx-auto px-5">
        <H2 eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos las empresas" />
        {FAQ.map(([q, a]) => (
          <details key={q} className="border-b border-gray-200 py-4 group">
            <summary className="cursor-pointer font-semibold list-none flex justify-between">{q}<span className={navy}>+</span></summary>
            <p className="text-gray-500 mt-2 max-w-3xl">{a}</p>
          </details>
        ))}
        <p className="text-xs text-gray-400 mt-6 max-w-3xl">La información normativa de esta página es referencial y no constituye asesoría legal. Cada empresa es responsable de la veracidad de lo que reporta ante el Ministerio del Trabajo.</p>
      </div></section>

      <section className="bg-[#162963] text-white text-center py-16"><div className="max-w-2xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-semibold">¿Cuántas personas necesita capacitar?</h2>
        <p className="text-blue-100 mt-3 mb-7">Escríbanos y en el mismo día le enviamos la propuesta con cronograma y valor por persona.</p>
        <a href={wa("Hola CENVIT, necesito capacitar a mi personal. ¿Me envían una propuesta?")} className={`${btn} bg-white text-[#162963] border-white`}>Escribir por WhatsApp</a>
      </div></section>

      <footer className="py-8 border-t border-gray-200 text-center text-sm text-gray-400">
        CENVIT — Centro Educativo y de Negocios con Visión Integral del Talento Humano · Guayaquil, Ecuador
      </footer>
    </div>
  );
}
