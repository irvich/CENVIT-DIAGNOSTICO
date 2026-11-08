import os, shutil, time
R = "/opt/CENVIT_Plataforma_v1.1"; web = f"{R}/artifacts/campus-virtual/src"
lib = f"{web}/pages/libreria.tsx"; app = f"{web}/App.tsx"
bk = f"{R}/backups/pre_libro_{time.strftime('%Y%m%d%H%M%S')}"; os.makedirs(bk)
for f in (lib, app): shutil.copy(f, bk)
shutil.copy("libro-detalle.tsx", f"{web}/pages/libro-detalle.tsx")
s = open(lib, encoding="utf-8").read()
if "/libro/${product.id}" not in s:
    a = '<div className="flex items-center justify-between mt-auto">'
    assert s.count(a) == 1, s.count(a)
    btn = ('<Link href={`/libro/${product.id}`} className="inline-flex items-center gap-1 text-sm font-semibold mb-3 hover:underline" style={{ color: NAV }}>\n'
           '                      Ver detalles →\n'
           '                    </Link>\n                    ')
    s = s.replace(a, btn + a)
    # portada y título también llevan a la página del libro
    s = s.replace('<img src={product.imageUrl} alt={product.title}', '<img onClick={() => (window.location.href = `/libro/${product.id}`)} src={product.imageUrl} alt={product.title}', 1)
    open(lib, "w", encoding="utf-8").write(s)
s = open(app, encoding="utf-8").read()
if "LibroDetallePage" not in s:
    s = s.replace('import LibreriaPage from "@/pages/libreria";', 'import LibreriaPage from "@/pages/libreria";\nimport LibroDetallePage from "@/pages/libro-detalle";')
    s = s.replace('<Route path="/libreria" component={LibreriaPage} />', '<Route path="/libreria" component={LibreriaPage} />\n      <Route path="/libro/:id" component={LibroDetallePage} />')
    assert "component={LibroDetallePage}" in s
    open(app, "w", encoding="utf-8").write(s)
print("OK", bk)
