      {/* ASESORÍA DOCUMENTAL — añadida nov 2026 */}
      <section id="asesoria" className="py-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-3xl mb-9">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-2">Asesoría documental</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#162963]">Reglamentos, manuales y políticas hechos para su empresa</h2>
            <p className="text-gray-500 mt-3">Documentos a la medida de su organización, no plantillas copiadas: coherentes entre sí, elaborados por un psicólogo laboral con apoyo de inteligencia artificial y revisados por un abogado antes de presentarse al Ministerio del Trabajo.</p>
          </div>
          <div className="bg-[#fff8e6] border border-[#e8c96a] rounded-xl p-5 mb-7 text-[15px] text-[#162963]">
            <strong>¿Su empresa tiene más de 10 trabajadores?</strong> Su Reglamento Interno de Trabajo debe estar aprobado por el Ministerio del Trabajo. Lo elaboramos y le acompañamos en el trámite en la plataforma SUT.
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: "Reglamento Interno de Trabajo", d: "Ingreso, jornada, obligaciones, prohibiciones, permisos y régimen disciplinario, conforme al Código del Trabajo. Incluye el acompañamiento del trámite de aprobación en el SUT." },
              { t: "Manual de Organización y Funciones", d: "Organigrama, descripción de cargos y perfiles por competencias con indicadores observables, listos para seleccionar, inducir y evaluar al personal." },
              { t: "Manual de procesos de Talento Humano", d: "Selección, inducción, evaluación del desempeño, capacitación y desvinculación, con formatos y responsables definidos." },
              { t: "Políticas internas", d: "Código de ética, política de protección de datos personales, uso responsable de la inteligencia artificial y teletrabajo." },
              { t: "Filosofía institucional y estatutos", d: "Misión, visión, valores y estructura de gobierno. La parte jurídica de los estatutos se elabora con nuestro abogado aliado." },
              { t: "Actualización de documentos existentes", d: "Revisamos y actualizamos reglamentos y manuales desactualizados para que reflejen cómo opera hoy su empresa." },
            ].map((x) => (
              <div key={x.t} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-[#162963]">{x.t}</h3>
                <p className="text-gray-500 text-[15px] mb-4 flex-1">{x.d}</p>
                <a href={`https://wa.me/593964004110?text=${encodeURIComponent("Hola CENVIT, quiero información sobre: " + x.t + ".")}`} className="text-sm font-semibold text-[#162963]">Solicitar información →</a>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#162963] mb-5">Paquetes</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: "Cumplimiento esencial", i: ["Reglamento Interno de Trabajo", "Acompañamiento del trámite en el SUT", "Una ronda de ajustes"], p: "Aprox. 10 días hábiles" },
                { n: "Cumplimiento integral", i: ["Todo lo del paquete esencial", "Protocolo contra el acoso laboral", "Charla de socialización al personal"], p: "Aprox. 20 días hábiles", dest: true },
                { n: "Organización integral", i: ["Todo lo del paquete integral", "Manual de Organización y Funciones con perfiles por competencias", "Políticas internas"], p: "Aprox. 30 días hábiles" },
              ].map((k) => (
                <div key={k.n} className={`rounded-xl p-6 border ${k.dest ? "bg-[#162963] text-white border-[#162963]" : "bg-white border-gray-200"}`}>
                  {k.dest && <p className="text-xs font-semibold uppercase tracking-wider text-[#e8c96a] mb-1">Recomendado</p>}
                  <h4 className={`text-lg font-semibold mb-3 ${k.dest ? "text-white" : "text-[#162963]"}`}>{k.n}</h4>
                  <ul className={`space-y-2 text-[15px] mb-4 ${k.dest ? "text-white/90" : "text-gray-600"}`}>
                    {k.i.map((it) => (<li key={it} className="flex gap-2"><span className="text-[#c9a227]">✓</span><span>{it}</span></li>))}
                  </ul>
                  <p className={`text-sm ${k.dest ? "text-white/70" : "text-gray-400"}`}>{k.p} · se cotiza según el tamaño de la empresa</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-5">Los plazos no incluyen el tiempo de revisión del Ministerio del Trabajo. Cada contrato incluye un acuerdo de confidencialidad; los datos personales de sus trabajadores no se cargan en herramientas de inteligencia artificial.</p>
            <a href={`https://wa.me/593964004110?text=${encodeURIComponent("Hola CENVIT, quisiera un diagnóstico gratuito de la documentación de mi empresa (reglamento interno, manuales, políticas).")}`} className="inline-block mt-6 bg-[#c9a227] hover:bg-[#b8921f] text-[#162963] font-semibold rounded-full px-6 py-3">Solicitar diagnóstico gratuito por WhatsApp</a>
          </div>
        </div>
      </section>
