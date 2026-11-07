import re, sys, shutil, time, os
R="/opt/CENVIT_Plataforma_v1.1"
ts=time.strftime("%Y%m%d%H%M%S"); bk=f"{R}/backups/pre_reporte_{ts}"; os.makedirs(bk)
api=f"{R}/artifacts/api-server/src/routes/corporate.ts"
web=f"{R}/artifacts/campus-virtual/src"
adm=f"{web}/pages/admin/corporate.tsx"; app=f"{web}/App.tsx"
for f in (api,adm,app): shutil.copy(f, bk)
# backend
s=open(api).read()
if "reportSig" not in s:
    s='import { createHmac } from "crypto";\n'+s
    add=open("api_append.ts").read()
    s=s.replace("export default router;", add+"export default router;")
    open(api,"w").write(s)
# page
shutil.copy("reporte-empresa.tsx", f"{web}/pages/reporte-empresa.tsx")
# App route
s=open(app).read()
if "ReporteEmpresaPage" not in s:
    s=s.replace('import RegistroEmpresaPage from "@/pages/registro-empresa";','import RegistroEmpresaPage from "@/pages/registro-empresa";\nimport ReporteEmpresaPage from "@/pages/reporte-empresa";')
    s=s.replace('<Route path="/registro-empresa/:token" component={RegistroEmpresaPage} />','<Route path="/registro-empresa/:token" component={RegistroEmpresaPage} />\n      <Route path="/reporte-empresa/:id/:sig" component={ReporteEmpresaPage} />')
    assert "ReporteEmpresaPage }" in s or "component={ReporteEmpresaPage}" in s
    open(app,"w").write(s)
# admin button
s=open(adm).read()
if "reporte-link" not in s:
    i=s.find("import"); s=s[:i]+'import { BarChart3 } from "lucide-react";\n'+s[i:]
    fn='''const [reportCopiedId, setReportCopiedId] = useState<number | null>(null);
  async function handleReport(l: License) {
    try {
      const d = await api.get<{ path: string }>(`/admin/capacitaciones/${l.id}/reporte-link`);
      copyToClipboard(window.location.origin + d.path);
      setReportCopiedId(l.id);
      setTimeout(() => setReportCopiedId(null), 2500);
    } catch { alert("No se pudo generar el enlace del reporte"); }
  }
  '''
    k=s.find("async function toggleExpand(l: License)"); assert k>0
    s=s[:k]+fn+s[k:]
    j=s.find("onClick={() => handleCopy(l)}"); b=s.rfind("<Button",0,j)
    ls=s.rfind("\n",0,b)+1; ind=s[ls:b]
    btn=f'''<Button
{ind}  size="sm"
{ind}  variant="outline"
{ind}  onClick={{() => handleReport(l)}}
{ind}  className="rounded-full gap-1.5 text-xs"
{ind}  title="Copiar enlace del reporte para la empresa"
{ind}>
{ind}  {{reportCopiedId === l.id ? (
{ind}    <><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Reporte copiado</>
{ind}  ) : (
{ind}    <><BarChart3 className="w-3.5 h-3.5" /> Reporte empresa</>
{ind}  )}}
{ind}</Button>
{ind}'''
    s=s[:b]+btn+s[b:]
    open(adm,"w").write(s)
print("OK", bk)
