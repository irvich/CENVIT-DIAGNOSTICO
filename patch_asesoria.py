import os, shutil, time, glob, re
R = "/opt/CENVIT_Plataforma_v1.1"
web = f"{R}/artifacts/campus-virtual/src"
cands = [f for f in glob.glob(f"{web}/pages/**/*.tsx", recursive=True) if "Documentos y programas para su empresa" in open(f, encoding="utf-8").read()]
print("archivos:", cands)
assert len(cands) == 1, "no se encontró una única página de empresas"
f = cands[0]
s = open(f, encoding="utf-8").read()
if 'id="asesoria"' in s:
    print("YA EXISTE"); raise SystemExit
bk = f"{R}/backups/pre_asesoria_{time.strftime('%Y%m%d%H%M%S')}"; os.makedirs(bk); shutil.copy(f, bk)
i = s.find("Documentos y programas para su empresa")
j = s.find("</section>", i)
assert j > 0
j += len("</section>")
sec = open("seccion.tsx", encoding="utf-8").read()
s = s[:j] + "\n" + sec + s[j:]
open(f, "w", encoding="utf-8").write(s)
print("OK", f, bk)
