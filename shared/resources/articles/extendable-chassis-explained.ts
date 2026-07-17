import type { ResourceArticle } from '../types.js';

export const extendableChassisExplained: ResourceArticle = {
  slug: 'extendable-chassis-explained',
  category: 'buying-guide',
  datePublished: '2026-07-16',
  readingMinutes: 6,
  relatedLanding: ['container-chassis/20-40-extendable', 'container-chassis/40ft', 'container-chassis/45ft'],
  en: {
    metaTitle: 'Extendable Container Chassis Explained: 20/40 and 40/45',
    metaDescription: 'How extendable (telescoping) container chassis work: 20/40 and 40/45 configurations, locking positions, tare trade-offs, and when the flexibility pays for itself.',
    title: 'Extendable Container Chassis Explained: 20/40 and 40/45',
    lead: 'An extendable container chassis is a telescoping frame that locks at multiple lengths so one unit can carry different container sizes — the two common families being the 20/40 (which handles 20-foot and 40-foot boxes, often 45s as well) and the 40/45 (which stretches between 40-foot and 45-foot positions). The pay-off is utilization: one chassis that says yes to whatever box comes off the vessel, in exchange for more tare weight, more moving parts, and a higher purchase price than a fixed frame.',
    keyTakeaways: [
      'The frame telescopes on rails and locks with pins at fixed positions matched to ISO container lengths.',
      '20/40 extendables cover the two dominant international sizes; many also take 45-foot boxes.',
      '40/45 extendables serve fleets that straddle international 40s and domestic/high-capacity 45s.',
      'Expect more tare weight than a fixed chassis — that weight subtracts from maximum legal payload.',
      'The economics work when your container mix is genuinely unpredictable; stable mixes favor dedicated fixed units.',
    ],
    sections: [
      {
        heading: 'How the telescoping mechanism works',
        body: [
          'The rear section of an extendable chassis slides within the main frame on rails, and heavy locking pins secure it at engineered positions. Each position aligns the twist locks to a standard ISO footprint — 20, 40, or 45 feet — so the container corners land exactly on the locks.',
          'Repositioning is a yard task measured in minutes: unlock, slide (by tractor creep or yard equipment, per manufacturer procedure), and re-pin. The critical discipline is verification — a chassis pinned between positions or with a worn lock is a securement failure waiting for an inspection.',
        ],
      },
      {
        heading: '20/40 vs. 40/45: which family fits',
        body: [],
        table: {
          headers: ['Attribute', '20/40 extendable', '40/45 extendable'],
          rows: [
            ['Container sizes', '20 ft + 40 ft (often 45 ft)', '40 ft + 45 ft'],
            ['Core user', 'Port drayage with mixed import boxes', 'Fleets bridging international and domestic'],
            ['Typical tare', '10,500–12,000 lb', 'Slightly above a fixed 40/45'],
            ['Replaces', 'Dedicated 20ft + 40ft units', 'Dedicated 40ft + 45ft units'],
          ],
        },
      },
      {
        heading: 'The honest trade-offs',
        body: [
          'Flexibility costs weight and complexity. The telescoping structure adds tare weight over a fixed frame, and every pound of tare is a pound of payload you cannot legally carry. The rails and pins are also wear items: they need lubrication, inspection, and eventual replacement in a way a welded fixed frame never does.',
          'Price completes the picture — an extendable costs more up front than either fixed unit it replaces, though less than buying both.',
        ],
      },
      {
        heading: 'When the flexibility pays',
        body: [
          'The extendable earns its keep when tomorrow’s box size is unknown: spot-market drayage, agents serving many shippers, or lean fleets where every chassis must stay busy to justify itself. One frame that accepts 20s, 40s, and 45s means never turning down a load for lack of the right equipment.',
          'If your freight profile is stable — the same customers shipping the same boxes — dedicated fixed chassis are lighter, simpler, and cheaper to run. Buy the extendable for uncertainty, not as a default.',
        ],
      },
    ],
    faqs: [
      { q: 'What sizes can a 20/40 extendable chassis carry?', a: '20-foot and 40-foot ISO containers in their locked positions, and many models also include a 45-foot position — confirm per model.' },
      { q: 'How long does it take to change positions?', a: 'Minutes in the yard: unlock the pins, slide the rear section per the manufacturer procedure, and re-pin at the new position.' },
      { q: 'Do extendable chassis weigh more?', a: 'Yes — the telescoping structure adds tare weight (typically 10,500–12,000 lb on a 20/40), which reduces maximum legal payload versus a fixed frame.' },
      { q: 'Are extendables more expensive to maintain?', a: 'Modestly. Rails, pins, and locks are additional wear items requiring lubrication and inspection beyond a fixed frame’s needs.' },
      { q: 'Should I buy an extendable or two fixed chassis?', a: 'Extendable when your box mix is unpredictable or capital/yard space is tight; two fixed units when volumes are stable enough to keep both busy.' },
    ],
  },
  es: {
    metaTitle: 'Chasis Extendible Explicado: 20/40 y 40/45',
    metaDescription: 'Cómo funcionan los chasis extendibles (telescópicos): configuraciones 20/40 y 40/45, posiciones de bloqueo, sacrificios de peso y cuándo la flexibilidad se paga sola.',
    title: 'Chasis de Contenedor Extendible Explicado: 20/40 y 40/45',
    lead: 'Un chasis extendible es un marco telescópico que se bloquea a varias longitudes para que una sola unidad cargue distintos tamaños de contenedor — las dos familias comunes son el 20/40 (que maneja contenedores de 20 y 40 pies, y a menudo 45) y el 40/45 (que se estira entre las posiciones de 40 y 45 pies). La ganancia es utilización: un chasis que dice sí a cualquier contenedor que baje del buque, a cambio de más peso vacío, más partes móviles y un precio mayor que un marco fijo.',
    keyTakeaways: [
      'El marco se telescopia sobre rieles y se asegura con pernos en posiciones fijas alineadas a las longitudes ISO.',
      'Los extendibles 20/40 cubren los dos tamaños internacionales dominantes; muchos aceptan también 45 pies.',
      'Los 40/45 sirven a flotas que puentean los 40 internacionales y los 45 domésticos de alta capacidad.',
      'Espera más peso vacío que un chasis fijo — ese peso se resta de la carga legal máxima.',
      'La economía funciona cuando tu mezcla de contenedores es realmente impredecible; las mezclas estables favorecen unidades fijas dedicadas.',
    ],
    sections: [
      {
        heading: 'Cómo funciona el mecanismo telescópico',
        body: [
          'La sección trasera de un extendible se desliza dentro del marco principal sobre rieles, y pernos de bloqueo pesados la aseguran en posiciones diseñadas. Cada posición alinea los twist locks con una huella ISO estándar — 20, 40 o 45 pies — para que las esquinas del contenedor caigan exactamente sobre los seguros.',
          'El cambio de posición es tarea de patio medida en minutos: destrabar, deslizar (con avance del tractor o equipo de patio, según el procedimiento del fabricante) y volver a asegurar. La disciplina crítica es la verificación — un chasis asegurado entre posiciones o con un seguro desgastado es una falla de sujeción esperando inspección.',
        ],
      },
      {
        heading: '20/40 vs. 40/45: qué familia te toca',
        body: [],
        table: {
          headers: ['Atributo', 'Extendible 20/40', 'Extendible 40/45'],
          rows: [
            ['Tamaños de contenedor', '20 ft + 40 ft (a menudo 45 ft)', '40 ft + 45 ft'],
            ['Usuario principal', 'Drayage portuario con cajas mixtas', 'Flotas que puentean internacional y doméstico'],
            ['Peso vacío típico', '10,500–12,000 lb', 'Un poco arriba de un 40/45 fijo'],
            ['Reemplaza', 'Unidades dedicadas de 20ft + 40ft', 'Unidades dedicadas de 40ft + 45ft'],
          ],
        },
      },
      {
        heading: 'Los sacrificios, con honestidad',
        body: [
          'La flexibilidad cuesta peso y complejidad. La estructura telescópica agrega peso vacío sobre un marco fijo, y cada libra de tara es una libra de carga que no puedes llevar legalmente. Los rieles y pernos además son piezas de desgaste: requieren lubricación, inspección y reemplazo eventual como un marco fijo soldado nunca lo hará.',
          'El precio completa el cuadro — un extendible cuesta más que cualquiera de las unidades fijas que reemplaza, aunque menos que comprar ambas.',
        ],
      },
      {
        heading: 'Cuándo la flexibilidad se paga',
        body: [
          'El extendible se gana su lugar cuando el tamaño del contenedor de mañana es incógnita: drayage de mercado spot, agentes que sirven a muchos embarcadores o flotas esbeltas donde cada chasis debe mantenerse ocupado para justificarse. Un marco que acepta 20, 40 y 45 significa nunca rechazar una carga por falta del equipo correcto.',
          'Si tu perfil de carga es estable — los mismos clientes con los mismos contenedores — los chasis fijos dedicados son más ligeros, simples y baratos de operar. Compra el extendible por la incertidumbre, no como opción por defecto.',
        ],
      },
    ],
    faqs: [
      { q: '¿Qué tamaños carga un extendible 20/40?', a: 'Contenedores ISO de 20 y 40 pies en sus posiciones bloqueadas, y muchos modelos incluyen también posición de 45 pies — confírmalo por modelo.' },
      { q: '¿Cuánto tarda el cambio de posición?', a: 'Minutos en patio: destrabar los pernos, deslizar la sección trasera según el procedimiento del fabricante y volver a asegurar en la nueva posición.' },
      { q: '¿Los extendibles pesan más?', a: 'Sí — la estructura telescópica agrega peso vacío (típicamente 10,500–12,000 lb en un 20/40), lo que reduce la carga legal máxima frente a un marco fijo.' },
      { q: '¿Cuesta más mantener un extendible?', a: 'Moderadamente. Rieles, pernos y seguros son piezas de desgaste adicionales que exigen lubricación e inspección más allá de lo que pide un marco fijo.' },
      { q: '¿Compro un extendible o dos chasis fijos?', a: 'Extendible cuando tu mezcla es impredecible o el capital/espacio escasea; dos unidades fijas cuando el volumen mantiene ambas ocupadas.' },
    ],
  },
};
