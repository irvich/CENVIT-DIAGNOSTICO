import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { api, API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { ArrowLeft, BookOpen, Download, FileText, ShoppingCart, CheckCircle2, MessageCircle, User } from "lucide-react";

const NAV = "#162963";
const GOLD = "#c9a227";

type Product = {
  id: number; title: string; description?: string | null; shortDescription?: string | null;
  price: string; type?: string; imageUrl?: string | null; author?: string | null;
  pages?: number | null; format?: string | null; featured?: boolean;
};

function Descripcion({ texto }: { texto: string }) {
  const bloques = texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-gray-700 leading-relaxed text-[16px]">
      {bloques.map((b, i) => {
        const lineas = b.split("\n").map((l) => l.trim()).filter(Boolean);
        const vinetas = lineas.filter((l) => /^[•\-\*]/.test(l));
        if (vinetas.length && vinetas.length >= lineas.length - 1) {
          const intro = lineas.find((l) => !/^[•\-\*]/.test(l));
          return (
            <div key={i}>
              {intro && <p className="font-semibold mb-2" style={{ color: NAV }}>{intro}</p>}
              <ul className="space-y-2">
                {vinetas.map((v, j) => (
                  <li key={j} className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
                    <span>{v.replace(/^[•\-\*]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (i === 0) return <p key={i} className="text-xl font-semibold" style={{ color: NAV }}>{b}</p>;
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}

export default function LibroDetallePage() {
  const [, params] = useRoute("/libro/:id");
  const { isAuthenticated } = useAuth() as any;
  const [p, setP] = useState<Product | null>(null);
  const [owned, setOwned] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    api.get<Product[]>("/products")
      .then((list) => {
        const found = list.find((x) => String(x.id) === String(params.id));
        if (found) setP(found); else setError("No encontramos este libro.");
      })
      .catch(() => setError("No se pudo cargar la información del libro."));
  }, [params?.id]);

  useEffect(() => {
    if (!isAuthenticated || !params?.id) return;
    api.get<any[]>("/product-purchases/my")
      .then((rows) => setOwned((rows || []).some((r: any) => String(r.productId ?? r.product_id ?? r.id) === String(params.id) && (r.status ? /aprob|approved|paid|complet/i.test(r.status) : true))))
      .catch(() => {});
  }, [isAuthenticated, params?.id]);

  const comprar = isAuthenticated ? `/pago-producto/${p?.id}` : "/login";
  const wa = `https://wa.me/593964004110?text=${encodeURIComponent("Hola CENVIT, quiero información sobre el libro: " + (p?.title || ""))}`;

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      {error && <div className="max-w-3xl mx-auto px-5 py-24 text-center text-gray-600">{error} <Link href="/libreria" className="font-semibold" style={{ color: NAV }}>Volver a la librería</Link></div>}
      {!error && !p && <div className="py-32 text-center text-gray-400">Cargando…</div>}
      {p && (
        <>
          <section className="bg-[#f5f6f9] border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-5 py-10 md:py-16">
              <Link href="/libreria" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8">
                <ArrowLeft className="w-4 h-4" /> Volver a la Librería Académica
              </Link>
              <div className="grid md:grid-cols-[minmax(0,380px)_1fr] gap-10 md:gap-14 items-center">
                <div className="flex justify-center">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full max-w-[340px] rounded-lg shadow-2xl ring-1 ring-black/5" />
                  ) : (
                    <div className="w-full max-w-[340px] aspect-[3/4] rounded-lg flex items-center justify-center" style={{ background: NAV }}>
                      <BookOpen className="w-20 h-20 text-white/70" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase mb-3" style={{ color: GOLD }}>
                    {p.type === "ebook" ? "Libro digital" : "Recurso digital"} · Colección Psicología Laboral en Acción
                  </p>
                  <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-3" style={{ color: NAV }}>{p.title}</h1>
                  {p.author && <p className="text-gray-600 mb-5">por <span className="font-semibold">{p.author}</span></p>}
                  {p.shortDescription && <p className="text-gray-600 text-lg leading-relaxed mb-6">{p.shortDescription}</p>}
                  <div className="flex flex-wrap gap-3 mb-7 text-sm">
                    {p.format && <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700"><FileText className="w-4 h-4" /> {p.format}</span>}
                    {p.pages ? <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700"><BookOpen className="w-4 h-4" /> {p.pages} páginas</span> : null}
                    <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700"><Download className="w-4 h-4" /> Descarga inmediata</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-3xl font-bold" style={{ color: NAV }}>${parseFloat(p.price).toFixed(2)}</span>
                    {owned ? (
                      <a href={`${API_BASE_URL}/products/${p.id}/download`} className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3">
                        <Download className="w-5 h-5" /> Descargar mi libro
                      </a>
                    ) : (
                      <Link href={comprar}>
                        <Button size="lg" className="gap-2 rounded-full text-white border-0 px-7" style={{ background: NAV }}>
                          <ShoppingCart className="w-5 h-5" /> Comprar ahora
                        </Button>
                      </Link>
                    )}
                    <a href={wa} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: NAV }}>
                      <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14">
            <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[1fr_340px] gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-2">Sobre el libro</p>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: NAV }}>Presentación</h2>
                <Descripcion texto={p.description || p.shortDescription || ""} />
              </div>
              <aside className="space-y-5">
                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold mb-4" style={{ color: NAV }}>Ficha del libro</h3>
                  <dl className="text-sm space-y-3">
                    {p.author && <div className="flex justify-between gap-4"><dt className="text-gray-500">Autor</dt><dd className="text-right font-medium text-gray-800">{p.author}</dd></div>}
                    {p.format && <div className="flex justify-between gap-4"><dt className="text-gray-500">Formato</dt><dd className="font-medium text-gray-800">{p.format}</dd></div>}
                    {p.pages ? <div className="flex justify-between gap-4"><dt className="text-gray-500">Páginas</dt><dd className="font-medium text-gray-800">{p.pages}</dd></div> : null}
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Entrega</dt><dd className="text-right font-medium text-gray-800">Descarga inmediata tras el pago</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Editorial</dt><dd className="font-medium text-gray-800">CENVIT</dd></div>
                  </dl>
                </div>
                <div className="rounded-xl p-6 text-white" style={{ background: NAV }}>
                  <div className="flex items-center gap-2 mb-3"><User className="w-5 h-5" style={{ color: GOLD }} /><h3 className="font-semibold">Sobre el autor</h3></div>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Iván Viteri Chávez es psicólogo laboral y magíster en Administración de Empresas (MBA). Durante más de 20 años ha liderado áreas de Talento Humano en la Armada del Ecuador y en el sector público. Es Gerente General de CENVIT y docente universitario de grado y posgrado.
                  </p>
                </div>
                {!owned && (
                  <Link href={comprar}>
                    <Button className="w-full gap-2 rounded-full text-[#162963] font-semibold border-0" style={{ background: GOLD }}>
                      <ShoppingCart className="w-4 h-4" /> Obtener el libro · ${parseFloat(p.price).toFixed(2)}
                    </Button>
                  </Link>
                )}
              </aside>
            </div>
          </section>
          <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">© 2026 CENVIT — Librería Académica Digital</footer>
        </>
      )}
    </div>
  );
}
