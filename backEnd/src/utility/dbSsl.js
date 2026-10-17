import fs from "node:fs";

// DB_SSL_CA can be the certificate text itself, or a path like ca.pem
export function readCertificate(value) {
  const text = String(value ?? "").trim();
  if (!text) return undefined;
  if (text.includes("BEGIN CERTIFICATE")) return text.replace(/\\n/g, "\n");
  return fs.readFileSync(text, "utf8");
}

// Cloud databases (Aiven) need SSL. A local database doesn't.
export function buildDbSslOptions(env) {
  const ca = readCertificate(env.DB_SSL_CA);
  return ca ? { rejectUnauthorized: true, ca } : undefined;
}
