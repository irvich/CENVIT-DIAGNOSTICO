import os, re, shutil, time, subprocess
R = "/opt/CENVIT_Plataforma_v1.1"; web = f"{R}/artifacts/campus-virtual/src"
lib = f"{web}/pages/libreria.tsx"; app = f"{web}/App.tsx"
adm = f"{web}/pages/admin/products-admin.tsx"
sch = f"{R}/lib/db/src/schema/products.ts"; rt = f"{R}/artifacts/api-server/src/routes/products.ts"
bk = f"{R}/backups/pre_libro2_{time.strftime('%Y%m%d%H%M%S')}"; os.makedirs(bk)
for f in (lib, app, adm, sch, rt): shutil.copy(f, bk)
shutil.copy("libro-detalle.tsx", f"{web}/pages/libro-detalle.tsx")

# --- esquema
s = open(sch).read()
if "sampleImages" not in s:
    s = s.replace('imageUrl: text("image_url"),', 'imageUrl: text("image_url"),\n  sampleImages: text("sample_images"),', 1)
    assert "sampleImages" in s; open(sch, "w").write(s)

# --- rutas API
s = open(rt).read()
if "sampleImages" not in s:
    s = re.sub(r'(\n(\s*)imageUrl: productsTable\.imageUrl,)', r'\1\n\2sampleImages: productsTable.sampleImages,', s)
    n = s.count("imageUrl, fileUrl, author"); assert n == 2, n
    s = s.replace("imageUrl, fileUrl, author", "imageUrl, sampleImages, fileUrl, author")
    n = s.count("imageUrl: imageUrl || null,"); assert n == 2, n
    s = s.replace("imageUrl: imageUrl || null,", "imageUrl: imageUrl || null,\n        ...(sampleImages !== undefined ? { sampleImages: Array.isArray(sampleImages) ? JSON.stringify(sampleImages.filter(Boolean).slice(0, 3)) : (sampleImages || null) } : {}),")
    open(rt, "w").write(s)

# --- admin
s = open(adm).read()
if "sampleImages" not in s:
    s = s.replace("imageUrl: string | null;", "imageUrl: string | null; sampleImages?: string | null;", 1)
    s = s.replace("const EMPTY_FORM", 'const parseImgs = (v: any): string[] => { let a: string[] = []; try { a = Array.isArray(v) ? v : JSON.parse(v || "[]"); } catch {} return [0, 1, 2].map((i) => (a && a[i]) || ""); };\n\nconst EMPTY_FORM', 1)
    k = s.find("const EMPTY_FORM"); e = s.find("};", k)
    s = s[:e] + ', sampleImages: ["", "", ""] as string[] ' + s[e:]
    n = s.count("active: p.active });"); assert n >= 1, n
    s = s.replace("featured: p.featured, active: p.active });", "featured: p.featured, active: p.active, sampleImages: parseImgs(p.sampleImages) });", 1)
    assert "parseImgs(p.sampleImages)" in s
    a = s.find("setForm((f) => ({ ...f, imageUrl: url }))"); assert a > 0
    d = s.find("</div>", a) + len("</div>")
    blk = '''
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Imágenes de muestra del interior (opcional, hasta 3)</label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <FileUploadField key={i} mode="image" value={(form.sampleImages || [])[i] || ""} onChange={(url) => setForm((f) => { const arr = [...((f as any).sampleImages || ["", "", ""])]; arr[i] = url; return { ...f, sampleImages: arr }; })} placeholder={`Muestra ${i + 1}`} />
                    ))}
                  </div>
                </div>'''
    s = s[:d] + blk + s[d:]
    open(adm, "w").write(s)

# --- tarjeta de la librería
s = open(lib).read()
s = re.sub(r'<Link href=\{`/libro/\$\{product\.id\}`\} className="inline-flex[^>]*>\s*Ver detalles →\s*</Link>\s*', '', s)
s = s.replace('<img onClick={() => (window.location.href = `/libro/${product.id}`)} ', '<img ')
if "/libreria/${product.id}" not in s:
    s = s.replace('<img src={product.imageUrl} alt={product.title} className="', '<img onClick={() => (window.location.href = `/libreria/${product.id}`)} src={product.imageUrl} alt={product.title} className="cursor-pointer ', 1)
    s, n = re.subn(r'(<h3 className="font-bold[^>]*>)\s*\{product\.title\}', r'\1<Link href={`/libreria/${product.id}`}>{product.title}</Link>', s, count=1); assert n == 1
    i = s.find("{owned ? ("); assert i > 0
    s = s[:i] + '<div className="flex items-center gap-2">\n                      <Link href={`/libreria/${product.id}`}><Button size="sm" variant="outline" className="gap-1.5">Ver detalles</Button></Link>\n                      ' + s[i:]
    j = s.find("Obtener", i); k = s.find(")}", j); assert k > 0
    s = s[:k + 2] + "\n                    </div>" + s[k + 2:]
    open(lib, "w").write(s)

# --- rutas del sitio
s = open(app).read()
if '"/libreria/:slug"' not in s:
    s = s.replace('<Route path="/libro/:id" component={LibroDetallePage} />', '<Route path="/libreria/:slug" component={LibroDetallePage} />\n      <Route path="/libro/:slug" component={LibroDetallePage} />')
    assert '"/libreria/:slug"' in s; open(app, "w").write(s)

# --- base de datos
r = subprocess.run(["docker", "compose", "exec", "-T", "db", "sh", "-c", 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "ALTER TABLE products ADD COLUMN IF NOT EXISTS sample_images text;"'], cwd=R, capture_output=True, text=True)
print("DB:", r.stdout.strip(), r.stderr.strip()[:200])
print("OK", bk)
