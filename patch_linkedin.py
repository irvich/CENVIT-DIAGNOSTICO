# Agrega botón "Agregar a LinkedIn" a cada certificado del panel del alumno
import sys, re, pathlib, shutil, time
f = pathlib.Path("pages/dashboard.tsx")
s = f.read_text()
if "linkedin.com/profile/add" in s:
    print("YA_EXISTE"); sys.exit(0)
i = s.find("Ver y verificar")
j = s.find("</a>", i)
assert i > 0 and j > 0, "no encontrado"
j += len("</a>")
btn = '''
                    <a href={linkedinCertUrl(cert)} target="_blank" rel="noopener noreferrer" className="block mt-2">
                      <Button size="sm" className="w-full rounded-full gap-1 text-xs bg-[#0A66C2] hover:bg-[#004182] text-white">
                        <Linkedin className="w-3 h-3" /> Agregar a LinkedIn
                      </Button>
                    </a>'''
s = s[:j] + btn + s[j:]
helper = '''
const LINKEDIN_ORG_ID = ""; // ID numérico de la página de empresa CENVIT en LinkedIn (vacío = usa el nombre)
function linkedinCertUrl(cert: { course_title: string; issued_at: string; validation_code: string }) {
  const d = new Date(cert.issued_at);
  const p = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.course_title,
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: `https://cenvit.net/certificado/${cert.validation_code}`,
    certId: cert.validation_code,
  });
  if (LINKEDIN_ORG_ID) p.set("organizationId", LINKEDIN_ORG_ID); else p.set("organizationName", "CENVIT");
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
}
'''
k = s.find("interface Certificate")
s = s[:k] + helper.lstrip("\n") + "\n" + s[k:]
# icono Linkedin desde lucide-react
m = re.search(r'import \{([^}]*)\} from "lucide-react";', s)
assert m, "sin import lucide"
if "Linkedin" not in m.group(1).split(","):
    s = s[:m.start(1)] + m.group(1).rstrip() + ", Linkedin " + s[m.end(1):]
shutil.copy(f, f"/opt/CENVIT_Plataforma_v1.1/backups/dashboard_{int(time.time())}.tsx")
f.write_text(s)
print("OK", s.count("linkedinCertUrl"))
