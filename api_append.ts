
// ── Reporte de avance para empresas (enlace firmado, sin login) ──
function reportSig(token: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET || "cenvit")
    .update("report:" + token).digest("hex").slice(0, 32);
}

router.get("/admin/capacitaciones/:id/reporte-link", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [lic] = await db.select().from(corporateLicensesTable).where(eq(corporateLicensesTable.id, id));
  if (!lic) { res.status(404).json({ error: "Capacitación no encontrada" }); return; }
  res.json({ path: `/reporte-empresa/${id}/${reportSig(lic.token)}` });
});

router.get("/reporte-empresa/:id/:sig", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(404).json({ error: "Reporte no disponible" }); return; }
  const [lic] = await db.select().from(corporateLicensesTable).where(eq(corporateLicensesTable.id, id));
  if (!lic || reportSig(lic.token) !== String(req.params.sig)) {
    res.status(404).json({ error: "Reporte no disponible" }); return;
  }
  const cid = lic.courseId;
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, cid));
  const { rows: [tl] } = await db.execute(sql`SELECT COUNT(*)::int AS n FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ${cid}`) as any;
  const { rows } = await db.execute(sql`
    SELECT u.name, u.email, lr.registered_at AS "registeredAt",
      (SELECT COUNT(*)::int FROM lesson_completions lc JOIN lessons l ON l.id = lc.lesson_id
         JOIN modules m ON m.id = l.module_id WHERE lc.user_id = u.id AND m.course_id = ${cid}) AS done,
      (SELECT MAX(qa.score)::float FROM quiz_attempts qa JOIN quizzes q ON q.id = qa.quiz_id
         WHERE qa.user_id = u.id AND q.course_id = ${cid}) AS "bestScore",
      (SELECT COALESCE(bool_or(qa.passed), false) FROM quiz_attempts qa JOIN quizzes q ON q.id = qa.quiz_id
         WHERE qa.user_id = u.id AND q.course_id = ${cid}) AS passed,
      (SELECT c.validation_code FROM certificates c WHERE c.user_id = u.id AND c.course_id = ${cid} LIMIT 1) AS "certCode",
      (SELECT c.issued_at FROM certificates c WHERE c.user_id = u.id AND c.course_id = ${cid} LIMIT 1) AS "certDate"
    FROM ${licenseRegistrationsTable} lr JOIN users u ON u.id = lr.user_id
    WHERE lr.license_id = ${id}
    ORDER BY u.name`) as any;
  res.json({
    companyName: lic.companyName,
    courseTitle: course?.title ?? "",
    totalSeats: lic.totalSeats,
    usedSeats: lic.usedSeats,
    totalLessons: Number(tl?.n ?? 0),
    generatedAt: new Date().toISOString(),
    participants: rows,
  });
});

