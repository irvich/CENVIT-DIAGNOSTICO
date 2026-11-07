import re, pathlib, shutil, time
B="/opt/CENVIT_Plataforma_v1.1/"; S=B+"artifacts/campus-virtual/"
bk=B+f"backups/pre_empresas_{int(time.time())}/"; pathlib.Path(bk).mkdir(parents=True, exist_ok=True)
app=pathlib.Path(S+"src/App.tsx"); nav=pathlib.Path(S+"src/components/site-nav.tsx"); sm=pathlib.Path(S+"public/sitemap.xml")
for f in (app,nav,sm): shutil.copy(f, bk+f.name)
a=app.read_text()
if "EmpresasPage" not in a:
    a=a.replace('import DigitalPage from "@/pages/digital";','import DigitalPage from "@/pages/digital";\nimport EmpresasPage from "@/pages/empresas";',1)
    a=a.replace('<Route path="/digital" component={DigitalPage} />','<Route path="/digital" component={DigitalPage} />\n      <Route path="/empresas" component={EmpresasPage} />',1)
    app.write_text(a)
n=nav.read_text()
if '"/empresas"' not in n:
    m=re.search(r'\{[^{}]*"/digital"[^{}]*\}', n)
    item=m.group(0)
    new=item.replace('"/digital"','"/empresas"').replace("CENVIT Digital","Empresas")
    n=n.replace(item, new+", "+item,1)
    n=n.replace('"Programas Académicos"','"Programas"')
    nav.write_text(n)
x=sm.read_text()
if "/empresas<" not in x:
    x=x.replace('</url>','</url><url><loc>https://cenvit.net/empresas</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>',1); sm.write_text(x)
print("EmpresasPage" in app.read_text(), app.read_text().count('/empresas'), nav.read_text().count('/empresas'), sm.read_text().count('/empresas'))
print(re.findall(r'(?:label|name|title)\s*:\s*"[^"]+"', nav.read_text())[:10])
