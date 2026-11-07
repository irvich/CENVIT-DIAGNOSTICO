import re
R="/opt/CENVIT_Plataforma_v1.1/artifacts/campus-virtual/src/pages"
f=R+"/admin/corporate.tsx"; s=open(f).read()
if "snakeKeys" not in s:
    helper='''
function snakeKeys(o: any): any {
  if (Array.isArray(o)) return o.map(snakeKeys);
  if (o && typeof o === "object") {
    const r: any = {};
    for (const k in o) { const v = snakeKeys(o[k]); r[k] = v; r[k.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())] = v; }
    return r;
  }
  return o;
}
'''
    i=s.find("\ninterface "); s=s[:i]+helper+s[i:]
    s,n1=re.subn(r'await api\.get<License\[\]>\("/admin/capacitaciones"\)', 'snakeKeys(await api.get<any>("/admin/capacitaciones")) as License[]', s)
    s,n2=re.subn(r'await api\.get<LicenseDetail>\((`/admin/capacitaciones/\$\{l\.id\}`)\)', r'snakeKeys(await api.get<any>(\1)) as LicenseDetail', s)
    assert n1==1 and n2==1, (n1,n2)
    open(f,"w").write(s)
g=R+"/reporte-empresa.tsx"; t=open(g).read()
t=t.replace('variant="outline" className="gap-2 text-[#0b2a5b]"','variant="outline" className="gap-2 bg-white text-[#0b2a5b] hover:bg-slate-100"')
open(g,"w").write(t); print("OK2")
