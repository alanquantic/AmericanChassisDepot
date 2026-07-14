/**
 * Activa el CRM creando la tabla `crm_leads` (idempotente).
 *
 * Uso (en un entorno donde MARKETPLACE_DATABASE_URL esté disponible,
 * ej. Replit shell o local con la variable exportada):
 *
 *   npm run db:crm
 *
 * Ejecuta el SQL de scripts/crm-leads.sql usando la MISMA conexión que la app.
 * Solo crea/ajusta crm_leads; no toca ninguna otra tabla.
 */
import { sql as raw } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getMarketplaceDb } from '../server/marketplace/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlText = readFileSync(join(__dirname, 'crm-leads.sql'), 'utf8');

// Separa por ';' y quita líneas de comentario de cada sentencia
const statements = sqlText
  .split(';')
  .map((s) => s.split('\n').filter((l) => !l.trim().startsWith('--')).join('\n').trim())
  .filter((s) => s.length > 0);

async function main() {
  const db = getMarketplaceDb();
  console.log(`Ejecutando ${statements.length} sentencias contra la BD del marketplace...`);
  for (const stmt of statements) {
    await db.execute(raw.raw(stmt));
    const firstLine = stmt.split('\n').find(Boolean) || stmt;
    console.log('  ✓', firstLine.slice(0, 72));
  }
  console.log('✅ Tabla crm_leads lista. El CRM ya guardará leads.');
}

main().catch((e) => {
  console.error('❌ Error activando el CRM:', e?.message || e);
  process.exit(1);
});
