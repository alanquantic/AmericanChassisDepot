// Registry of all /resources articles — order here = display order on the index page.
import type { ResourceArticle } from './types.js';
import { containerChassisCost } from './articles/container-chassis-cost.js';
import { twentyVsFortyChassis } from './articles/20ft-vs-40ft-chassis.js';
import { whatIsAGooseneckChassis } from './articles/what-is-a-gooseneck-chassis.js';
import { chassisLeasingVsBuying } from './articles/chassis-leasing-vs-buying.js';
import { triaxleVsTandemWeightLimits } from './articles/triaxle-vs-tandem-weight-limits.js';
import { leaseToOwnChassisFinancing } from './articles/lease-to-own-chassis-financing.js';
import { fmcsaDotChassisRequirements } from './articles/fmcsa-dot-chassis-requirements.js';
import { startDrayageCompanyTexas } from './articles/start-drayage-company-texas.js';
import { extendableChassisExplained } from './articles/extendable-chassis-explained.js';
import { chassisMaintenanceChecklist } from './articles/chassis-maintenance-checklist.js';
import { buyContainerChassisHouston } from './articles/buy-container-chassis-houston.js';
import { chassisPoolVsOwnedFleet } from './articles/chassis-pool-vs-owned-fleet.js';

export * from './types.js';

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  containerChassisCost,
  twentyVsFortyChassis,
  whatIsAGooseneckChassis,
  chassisLeasingVsBuying,
  triaxleVsTandemWeightLimits,
  leaseToOwnChassisFinancing,
  fmcsaDotChassisRequirements,
  startDrayageCompanyTexas,
  extendableChassisExplained,
  chassisMaintenanceChecklist,
  buyContainerChassisHouston,
  chassisPoolVsOwnedFleet,
];

export function getResourceArticle(slug: string): ResourceArticle | undefined {
  const clean = slug.replace(/\/+$/, '');
  return RESOURCE_ARTICLES.find((a) => a.slug === clean);
}
