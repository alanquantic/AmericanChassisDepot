/**
 * Extract structured specs from a listing's title, description and tags.
 *
 * The bulk import populated `manufacturer`, `year`, `description` and `tags[]`
 * fine — but left `specs` jsonb empty. The features users care about for
 * filtering (axle config, suspension, wheels, width, brakes, configuration,
 * tire spec, GVWR, lift/pintle/gooseneck flags) are scattered across the
 * description text and the tags array.
 *
 * This module turns those into a queryable structured object.
 *
 * Pure function. Safe to call on any input. Idempotent.
 */

export interface ExtractedSpecs {
  axleConfig?: string;       // "Single Axle" | "Tandem Axle" | "Tri-Axle" | "Quad Axle" | "Five Axle"
  suspension?: string;       // "Air Ride" | "Spring Ride"
  wheels?: string;           // "Steel" | "Aluminum"
  widthInches?: number;      // 96 | 98 | 100 | 102 | 108
  brakes?: string;           // "ABS" | "Disc" | "Drum"
  configuration?: string;    // "Fixed" | "Sliding" | "Extendable"
  tires?: string;            // "11R22.5" | "Tubeless" | ...
  gvwrLb?: number;           // 118609
  features?: string[];       // ["Lift Axle", "Pintle Hook", "Gooseneck", ...]
}

interface ExtractorInput {
  title?: string | null;
  description?: string | null;
  descriptionEs?: string | null;
  tags?: string[] | null;
  chassisType?: string | null;
}

const norm = (s: string) => s.toLowerCase().replace(/[‐‑–—]/g, '-').replace(/\s+/g, ' ').trim();

export function extractSpecs(input: ExtractorInput): ExtractedSpecs {
  const out: ExtractedSpecs = {};

  const parts = [
    input.title || '',
    input.description || '',
    input.descriptionEs || '',
    ...(input.tags || []),
    input.chassisType || '',
  ];
  const blob = norm(parts.join(' \n '));

  // ----- Axle configuration (priority: more axles first to avoid sub-matches) -----
  if (/\b(five[\s-]*axle|5[\s-]?axle)\b/.test(blob)) out.axleConfig = 'Five Axle';
  else if (/\b(quad[\s-]*axle|4[\s-]?axle)\b/.test(blob)) out.axleConfig = 'Quad Axle';
  else if (/\b(tri[\s-]?axle|triaxle|3[\s-]?axle)\b/.test(blob)) out.axleConfig = 'Tri-Axle';
  else if (/\b(tandem[\s-]*axle|2[\s-]?axle)\b/.test(blob)) out.axleConfig = 'Tandem Axle';
  else if (/\bsingle[\s-]*axle\b/.test(blob)) out.axleConfig = 'Single Axle';

  // ----- Suspension -----
  // "Spring" alone as a tag also counts (the import uses bare "Spring" in tags)
  if (/\b(air[\s-]*ride|air[\s-]*suspension)\b/.test(blob)) out.suspension = 'Air Ride';
  else if (/\b(spring[\s-]*ride|spring[\s-]*suspension|spring)\b/.test(blob)) {
    out.suspension = 'Spring Ride';
  }

  // ----- Wheels -----
  if (/\baluminum\b/.test(blob)) out.wheels = 'Aluminum';
  else if (/\bsteel\b/.test(blob)) out.wheels = 'Steel';

  // ----- Width in inches (96", 98", 100", 102", 108") -----
  const widthMatch = blob.match(/\b(9[68]|10[028])\s*(?:"|''|inch|in\b|wide|width)/);
  if (widthMatch) out.widthInches = parseInt(widthMatch[1], 10);

  // ----- Brakes (ABS most specific, then disc/drum) -----
  if (/\babs\b/.test(blob)) out.brakes = 'ABS';
  else if (/\bdisc\s*brake/.test(blob)) out.brakes = 'Disc';
  else if (/\bdrum\s*brake/.test(blob)) out.brakes = 'Drum';

  // ----- Configuration (fixed/sliding/extendable) -----
  if (/\bextend(?:able|er)\b/.test(blob)) out.configuration = 'Extendable';
  else if (/\b(sliding|slider)\b/.test(blob)) out.configuration = 'Sliding';
  else if (/\bfixed\b/.test(blob)) out.configuration = 'Fixed';

  // ----- Tires -----
  // Common chassis tire sizes
  const tireSizeMatch = blob.match(/\b(11r22\.5|275\/80r22\.5|285\/75r24\.5|385\/65r22\.5)\b/);
  if (tireSizeMatch) {
    out.tires = tireSizeMatch[1].toUpperCase();
  } else if (/\btubeless\b/.test(blob)) {
    out.tires = 'Tubeless';
  }

  // ----- GVWR (gross vehicle weight rating in lb) -----
  const gvwrMatch = blob.match(/gvwr[:\s]+([\d,]+)\s*lb/);
  if (gvwrMatch) {
    const n = parseInt(gvwrMatch[1].replace(/,/g, ''), 10);
    if (n > 1000 && n < 1000000) out.gvwrLb = n;
  }

  // ----- Feature flags -----
  const features = new Set<string>();
  if (/\blift\s*(?:axle|1st|first|5th|fifth)\b/.test(blob)) features.add('Lift Axle');
  if (/\bpintle(?:\s*hook)?\b/.test(blob)) features.add('Pintle Hook');
  if (/\bgooseneck\b/.test(blob)) features.add('Gooseneck');
  if (/\bjawbone|\bjaw\s*bone\b/.test(blob)) features.add('Jaw Bone');
  if (/\bgenset|gen\s*set\b/.test(blob)) features.add('Genset');
  if (/\b(iso|tank)\s*(?:tank|chassis)?\b/.test(blob) && (input.chassisType || '').toLowerCase().includes('tank')) {
    features.add('ISO Tank');
  }
  if (/\bbendix\b/.test(blob)) features.add('Bendix Brakes');
  if (/\bwabco\b/.test(blob)) features.add('Wabco Brakes');
  if (/\bhaldex\b/.test(blob)) features.add('Haldex Brakes');
  if (features.size > 0) out.features = Array.from(features).sort();

  return out;
}

/**
 * Convenience: returns true if extraction produced at least one populated field.
 * Used by the backfill to skip writing empty specs objects.
 */
export function hasAnySpec(s: ExtractedSpecs): boolean {
  return Object.values(s).some(v => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true));
}
