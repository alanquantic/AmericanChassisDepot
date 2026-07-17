import type { ResourceArticle } from '../types.js';

export const triaxleVsTandemWeightLimits: ResourceArticle = {
  slug: 'triaxle-vs-tandem-weight-limits',
  category: 'regulations',
  datePublished: '2026-07-16',
  readingMinutes: 8,
  relatedLanding: ['container-chassis/triaxle', 'container-chassis/40ft', 'locations/texas'],
  en: {
    metaTitle: 'Tri-Axle vs Tandem Chassis: Weight Limits Explained by State',
    metaDescription: 'Federal Bridge Formula, the 80,000 lb interstate cap, tandem vs tri-axle capacity, and how state overweight permits (Texas port corridors included) change the math.',
    title: 'Tri-Axle vs Tandem Chassis: Weight Limits by State',
    lead: 'On the federal Interstate system, gross vehicle weight is capped at 80,000 lb, with 34,000 lb allowed on a tandem axle group — and a tri-axle chassis matters because it spreads container weight across a third axle, unlocking heavier legal loads under the Federal Bridge Formula and state overweight permit programs. If your lanes regularly see loaded containers pushing past what a tandem can legally scale, the third axle is the difference between hauling the box and turning it down.',
    keyTakeaways: [
      'Federal Interstate limits: 80,000 lb gross, 20,000 lb single axle, 34,000 lb tandem group — set by the Federal Bridge Formula (23 CFR 658).',
      'A loaded ISO container can gross up to 67,200 lb by itself; add tractor and chassis tare and heavy boxes exceed legal tandem loading fast.',
      'A tri-axle chassis spreads weight over three axles, raising the legal axle-group total and satisfying bridge-formula spacing math.',
      'Overweight loads still need state permits — the tri-axle provides the capacity, the permit provides the legality.',
      'Texas is especially relevant: dedicated overweight corridors near the Port of Houston allow permitted loads well above standard limits.',
    ],
    sections: [
      {
        heading: 'The federal baseline every state starts from',
        body: [
          'Federal law (23 CFR 658) sets the Interstate highway envelope: 80,000 lb gross vehicle weight, 20,000 lb on a single axle, and 34,000 lb on a tandem group, all governed by the Federal Bridge Formula, which ties allowable weight to the number of axles and the spacing between them.',
          'The formula rewards more axles and wider spacing. That is the entire engineering argument for the tri-axle chassis: the same container weight divided across three axles instead of two produces lower per-axle loading and a higher legal group total.',
        ],
      },
      {
        heading: 'Tandem vs. tri-axle in practice',
        body: [],
        table: {
          headers: ['Attribute', 'Tandem chassis (2 axles)', 'Tri-axle chassis (3 axles)'],
          rows: [
            ['Axle group allowance (federal)', '34,000 lb tandem group', 'Higher group total under Bridge Formula'],
            ['Typical use', 'Standard-weight containers', 'Overweight / dense containers under permit'],
            ['Tare weight', 'Lower', 'Higher (extra axle, tires, frame)'],
            ['Cost', 'Lower', 'Higher — earns it back on heavy lanes'],
            ['Permits needed', 'None at legal weights', 'State overweight permits for heavy loads'],
          ],
        },
      },
      {
        heading: 'Why states differ — and why Texas matters',
        body: [
          'Above the federal Interstate baseline, each state sets its own rules for non-Interstate roads and issues its own overweight permits. Some states are restrictive; others build entire freight strategies around permitted heavy corridors.',
          'Texas is the standout for container freight. The state operates dedicated overweight corridors serving the Port of Houston area, where permitted container moves can gross well above the standard limit on approved routes. For drayage operators running heavy import boxes — resin, steel, liquids — a tri-axle chassis plus the corridor permit converts freight that would otherwise require transloading into a single legal move.',
          'Always verify current permit terms with the state DOT or TxDMV before committing to heavy lanes; permit programs specify routes, weights, and equipment requirements.',
        ],
      },
      {
        heading: 'Choosing between tandem and tri-axle',
        body: [
          'Run tandem if your freight consistently scales legal — most general intermodal does. Buy or lease tri-axle when heavy boxes are a regular part of the book: overweight import lanes, dense commodities, or port corridors where permits make heavy moves routine.',
          'Many fleets keep a small tri-axle pool alongside a tandem majority, dispatching the three-axle units only where the freight demands them. That keeps tare weight low on standard moves and capacity ready for heavy ones.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the federal weight limit for a container chassis?', a: 'The Interstate limits are 80,000 lb gross vehicle weight, 20,000 lb single axle, and 34,000 lb tandem group, governed by the Federal Bridge Formula (23 CFR 658).' },
      { q: 'How much more can a tri-axle chassis legally carry?', a: 'It depends on axle spacing and state rules — the Bridge Formula grants higher group totals for three spread axles, and state overweight permits extend that further on approved routes.' },
      { q: 'Do I still need a permit with a tri-axle chassis?', a: 'Yes, for loads above standard legal weights. The chassis provides capacity; the state permit provides legality for the specific load and route.' },
      { q: 'What are the Texas overweight corridors?', a: 'Designated routes in the Port of Houston area where permitted container loads may gross well above standard limits. Check TxDMV for current routes, weights, and permit terms.' },
      { q: 'Is a tri-axle worth it for general freight?', a: 'Usually not — the extra tare and cost only pay off when heavy containers are a regular part of your freight mix.' },
    ],
  },
  es: {
    metaTitle: 'Chasis Triaxle vs Tándem: Límites de Peso por Estado',
    metaDescription: 'La Bridge Formula federal, el tope de 80,000 lb en Interestatales, capacidad tándem vs triaxle, y cómo los permisos estatales de sobrepeso (incluidos los corredores de Texas) cambian el cálculo.',
    title: 'Chasis Triaxle vs Tándem: Límites de Peso por Estado',
    lead: 'En el sistema Interestatal federal, el peso bruto vehicular está limitado a 80,000 lb, con 34,000 lb permitidas en un grupo tándem — y el chasis triaxle importa porque reparte el peso del contenedor en un tercer eje, desbloqueando cargas legales mayores bajo la Federal Bridge Formula y los programas estatales de permisos de sobrepeso. Si tus rutas ven con regularidad contenedores cargados que superan lo que un tándem puede pesar legalmente, el tercer eje es la diferencia entre mover la carga o rechazarla.',
    keyTakeaways: [
      'Límites federales en Interestatales: 80,000 lb brutas, 20,000 lb por eje sencillo, 34,000 lb por grupo tándem — fijados por la Federal Bridge Formula (23 CFR 658).',
      'Un contenedor ISO cargado puede pesar hasta 67,200 lb por sí solo; suma tractor y chasis y las cajas pesadas exceden rápido la carga tándem legal.',
      'Un triaxle reparte el peso en tres ejes, elevando el total legal del grupo y cumpliendo la matemática de espaciamiento de la Bridge Formula.',
      'Las cargas con sobrepeso siguen requiriendo permisos estatales — el triaxle da la capacidad, el permiso da la legalidad.',
      'Texas es especialmente relevante: corredores de sobrepeso dedicados cerca del Puerto de Houston permiten cargas con permiso muy por encima de los límites estándar.',
    ],
    sections: [
      {
        heading: 'La base federal de la que parte cada estado',
        body: [
          'La ley federal (23 CFR 658) define el marco en autopistas Interestatales: 80,000 lb de peso bruto, 20,000 lb por eje sencillo y 34,000 lb por grupo tándem, todo gobernado por la Federal Bridge Formula, que liga el peso permitido al número de ejes y su espaciamiento.',
          'La fórmula premia más ejes y mayor separación. Ese es todo el argumento de ingeniería del triaxle: el mismo peso de contenedor dividido entre tres ejes en lugar de dos produce menos carga por eje y un total legal de grupo más alto.',
        ],
      },
      {
        heading: 'Tándem vs. triaxle en la práctica',
        body: [],
        table: {
          headers: ['Atributo', 'Chasis tándem (2 ejes)', 'Chasis triaxle (3 ejes)'],
          rows: [
            ['Permiso por grupo de ejes (federal)', 'Grupo tándem de 34,000 lb', 'Total de grupo mayor bajo la Bridge Formula'],
            ['Uso típico', 'Contenedores de peso estándar', 'Contenedores con sobrepeso / densos con permiso'],
            ['Peso vacío', 'Menor', 'Mayor (eje, llantas y marco extra)'],
            ['Costo', 'Menor', 'Mayor — se recupera en rutas pesadas'],
            ['Permisos', 'Ninguno a pesos legales', 'Permisos estatales de sobrepeso para cargas pesadas'],
          ],
        },
      },
      {
        heading: 'Por qué los estados difieren — y por qué Texas importa',
        body: [
          'Por encima de la base federal, cada estado fija sus reglas en carreteras no Interestatales y emite sus propios permisos de sobrepeso. Algunos son restrictivos; otros construyen estrategias completas de carga alrededor de corredores pesados con permiso.',
          'Texas es el caso sobresaliente para carga de contenedores. El estado opera corredores de sobrepeso dedicados que sirven el área del Puerto de Houston, donde movimientos con permiso pueden pesar muy por encima del límite estándar en rutas aprobadas. Para operadores de drayage con cajas de importación pesadas — resina, acero, líquidos — un triaxle más el permiso del corredor convierte carga que exigiría trasvase en un solo movimiento legal.',
          'Verifica siempre los términos vigentes con el DOT estatal o TxDMV antes de comprometerte a rutas pesadas; los programas de permiso especifican rutas, pesos y requisitos de equipo.',
        ],
      },
      {
        heading: 'Cómo elegir entre tándem y triaxle',
        body: [
          'Opera tándem si tu carga pesa legal de forma consistente — la mayoría del intermodal general lo hace. Compra o arrienda triaxle cuando las cajas pesadas son parte regular del negocio: rutas de importación con sobrepeso, materias densas o corredores portuarios donde los permisos vuelven rutinarios los movimientos pesados.',
          'Muchas flotas mantienen un grupo pequeño de triaxles junto a una mayoría tándem, despachando las unidades de tres ejes solo donde la carga lo exige. Así el peso vacío se mantiene bajo en movimientos estándar y la capacidad queda lista para los pesados.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cuál es el límite federal de peso para un chasis?', a: 'En Interestatales: 80,000 lb brutas, 20,000 lb por eje sencillo y 34,000 lb por grupo tándem, gobernados por la Federal Bridge Formula (23 CFR 658).' },
      { q: '¿Cuánto más puede cargar legalmente un triaxle?', a: 'Depende del espaciamiento de ejes y las reglas estatales — la Bridge Formula otorga totales mayores a tres ejes espaciados, y los permisos estatales lo extienden más en rutas aprobadas.' },
      { q: '¿Sigo necesitando permiso con un triaxle?', a: 'Sí, para cargas por encima de los pesos legales estándar. El chasis da la capacidad; el permiso estatal da la legalidad para la carga y ruta específicas.' },
      { q: '¿Qué son los corredores de sobrepeso de Texas?', a: 'Rutas designadas en el área del Puerto de Houston donde cargas de contenedor con permiso pueden pesar muy por encima de los límites estándar. Consulta TxDMV para rutas, pesos y términos vigentes.' },
      { q: '¿Vale la pena un triaxle para carga general?', a: 'Normalmente no — el peso vacío y costo extra solo se pagan cuando los contenedores pesados son parte regular de tu mezcla.' },
    ],
  },
};
