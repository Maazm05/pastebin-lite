export function getNow(req: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const t = Number(header);
      if (!Number.isNaN(t)) return t;
    }
  }
  return Date.now();
}
