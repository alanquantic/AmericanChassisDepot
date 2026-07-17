import type { ResourceArticle } from '../types.js';

export const fmcsaDotChassisRequirements: ResourceArticle = {
  slug: 'fmcsa-dot-chassis-requirements',
  category: 'regulations',
  datePublished: '2026-07-16',
  readingMinutes: 8,
  relatedLanding: ['container-chassis/40ft', 'locations/houston', 'fleet-sales'],
  en: {
    metaTitle: 'FMCSA and DOT Requirements for Intermodal Chassis (2026)',
    metaDescription: 'The federal rules that govern intermodal chassis in 2026: the FMCSA roadability rule for IEPs, periodic inspections under 49 CFR 396.17, DVIRs, and who is responsible for what.',
    title: 'FMCSA and DOT Requirements for Intermodal Chassis (2026)',
    lead: 'Intermodal chassis in the U.S. are governed by the FMCSA "roadability" rule (49 CFR Part 390 Subpart C, in force since 2009), which makes Intermodal Equipment Providers legally responsible for the road-worthiness of the chassis they tender — on top of the periodic inspection every commercial trailer must pass under 49 CFR 396.17 and the pre-trip inspection drivers owe under 49 CFR 392.7. Whether you own, lease, or pull pool chassis, knowing which of those duties lands on you is the difference between a clean roadside stop and an out-of-service order.',
    keyTakeaways: [
      'The FMCSA roadability rule made Intermodal Equipment Providers (IEPs) directly regulated: they must register, mark equipment with a USDOT number, and maintain systematic inspection and repair programs.',
      'Every chassis needs a periodic inspection at least once every 12 months under 49 CFR 396.17, documented and traceable.',
      'Drivers must still perform pre-trip inspections (49 CFR 392.7) — lights, brakes, tires, coupling — before every move.',
      'Driver-reported defects flow through Driver Vehicle Inspection Reports (DVIRs); IEPs must have a process to receive and act on them.',
      'When you OWN the chassis, all maintenance and inspection duties are yours — one reason inspection documentation matters when buying used.',
    ],
    sections: [
      {
        heading: 'The roadability rule: who is responsible for pool chassis',
        body: [
          'Before 2009, drivers were routinely cited for defects on chassis they had picked up minutes earlier and did not control. The FMCSA roadability rule fixed the accountability gap: Intermodal Equipment Providers — the companies that tender chassis to motor carriers — became directly regulated entities.',
          'IEPs must register with FMCSA, display a USDOT identification on the equipment, run systematic inspection/repair/maintenance programs, and respond to defects reported by drivers. The rule covers the interchange process itself, so responsibility follows the equipment through the handoff.',
        ],
      },
      {
        heading: 'The three inspection layers every chassis lives under',
        body: [],
        table: {
          headers: ['Layer', 'Regulation', 'Who performs it', 'Frequency'],
          rows: [
            ['Pre-trip inspection', '49 CFR 392.7', 'Driver', 'Before every move'],
            ['Driver Vehicle Inspection Report', '49 CFR 396.11 / roadability', 'Driver reports; owner/IEP corrects', 'When defects found'],
            ['Periodic (annual) inspection', '49 CFR 396.17 + Appendix', 'Qualified inspector', 'At least every 12 months'],
          ],
        },
      },
      {
        heading: 'What the periodic inspection covers',
        body: [
          'The periodic inspection required by 49 CFR 396.17 follows the minimum standards of the regulation’s appendix: brake systems, coupling devices, frame integrity, lighting, suspension, tires, wheels and rims, and securement structures — for a chassis, that includes the twist locks and bolsters that hold the container.',
          'Documentation matters as much as the inspection: the record must identify the inspector, the equipment, the date, and the components passed. When buying a used chassis, that documentation is your proof the unit is legally current — ask for it before money moves.',
        ],
      },
      {
        heading: 'What this means for owners, lessees, and pool users',
        body: [
          'If you own your chassis, every layer is yours: periodic inspections on schedule, repair programs, and DVIR follow-up. If you lease, the agreement should state explicitly who owns inspection and maintenance duties — never assume. If you pull pool chassis from an IEP, the provider owns roadability, but your driver still owes the pre-trip and the DVIR.',
          'The practical takeaway for buyers: a chassis with organized inspection history is worth more than an identical unit without it, because it is proof of compliance you inherit on day one.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the FMCSA roadability rule?', a: 'The 2009 rule (49 CFR Part 390 Subpart C) that made Intermodal Equipment Providers directly responsible for the road-worthiness of chassis they tender — registration, USDOT marking, systematic maintenance, and defect response.' },
      { q: 'How often must a chassis be inspected?', a: 'A documented periodic inspection at least once every 12 months under 49 CFR 396.17, plus the driver pre-trip inspection before every move.' },
      { q: 'Who is responsible for defects on a pool chassis?', a: 'The IEP owns roadability of tendered equipment; the driver still must pre-trip the unit and report defects via DVIR before operating it.' },
      { q: 'What does DOT check on a chassis at roadside?', a: 'Brakes, lights, tires, coupling and securement (twist locks, bolsters), suspension, and frame condition — the same systems the periodic inspection certifies.' },
      { q: 'Do these rules apply to a chassis I own outright?', a: 'Yes. Ownership consolidates every duty — periodic inspections, maintenance program, and DVIR response — onto you as the operator.' },
    ],
  },
  es: {
    metaTitle: 'Requisitos FMCSA y DOT para Chasis Intermodales (2026)',
    metaDescription: 'Las reglas federales que rigen los chasis intermodales en 2026: la regla de roadability de FMCSA para IEPs, inspecciones periódicas bajo 49 CFR 396.17, DVIRs y quién responde por qué.',
    title: 'Requisitos FMCSA y DOT para Chasis Intermodales (2026)',
    lead: 'Los chasis intermodales en EE. UU. se rigen por la regla de "roadability" de FMCSA (49 CFR Parte 390 Subparte C, vigente desde 2009), que hace a los Intermodal Equipment Providers legalmente responsables de la condición de los chasis que entregan — además de la inspección periódica que todo remolque comercial debe pasar bajo 49 CFR 396.17 y la inspección pre-viaje que el conductor debe hacer bajo 49 CFR 392.7. Ya sea que poseas, arriendes o uses chasis de pool, saber cuál de esos deberes te toca es la diferencia entre una revisión limpia en carretera y una orden de fuera de servicio.',
    keyTakeaways: [
      'La regla de roadability reguló directamente a los Intermodal Equipment Providers (IEPs): deben registrarse, marcar el equipo con número USDOT y mantener programas sistemáticos de inspección y reparación.',
      'Todo chasis necesita una inspección periódica al menos cada 12 meses bajo 49 CFR 396.17, documentada y rastreable.',
      'Los conductores deben hacer inspección pre-viaje (49 CFR 392.7) — luces, frenos, llantas, acoplamiento — antes de cada movimiento.',
      'Los defectos reportados fluyen por los Driver Vehicle Inspection Reports (DVIRs); los IEPs deben tener proceso para recibirlos y corregirlos.',
      'Cuando el chasis es TUYO, todos los deberes de mantenimiento e inspección son tuyos — por eso la documentación importa al comprar usado.',
    ],
    sections: [
      {
        heading: 'La regla de roadability: quién responde por el chasis de pool',
        body: [
          'Antes de 2009, los conductores recibían infracciones por defectos de chasis que habían recogido minutos antes y no controlaban. La regla de roadability de FMCSA cerró esa brecha de responsabilidad: los Intermodal Equipment Providers — las empresas que entregan chasis a los transportistas — se volvieron entidades directamente reguladas.',
          'Los IEPs deben registrarse ante FMCSA, mostrar identificación USDOT en el equipo, operar programas sistemáticos de inspección/reparación/mantenimiento y responder a defectos reportados por conductores. La regla cubre el propio proceso de intercambio, de modo que la responsabilidad sigue al equipo a través de la entrega.',
        ],
      },
      {
        heading: 'Las tres capas de inspección de todo chasis',
        body: [],
        table: {
          headers: ['Capa', 'Regulación', 'Quién la ejecuta', 'Frecuencia'],
          rows: [
            ['Inspección pre-viaje', '49 CFR 392.7', 'Conductor', 'Antes de cada movimiento'],
            ['Driver Vehicle Inspection Report', '49 CFR 396.11 / roadability', 'El conductor reporta; dueño/IEP corrige', 'Al detectar defectos'],
            ['Inspección periódica (anual)', '49 CFR 396.17 + apéndice', 'Inspector calificado', 'Al menos cada 12 meses'],
          ],
        },
      },
      {
        heading: 'Qué cubre la inspección periódica',
        body: [
          'La inspección periódica de 49 CFR 396.17 sigue los estándares mínimos del apéndice de la regulación: sistemas de freno, dispositivos de acoplamiento, integridad del marco, iluminación, suspensión, llantas, ruedas y rines, y estructuras de sujeción — en un chasis, eso incluye los twist locks y soportes que sostienen el contenedor.',
          'La documentación importa tanto como la inspección: el registro debe identificar al inspector, el equipo, la fecha y los componentes aprobados. Al comprar un chasis usado, esa documentación es tu prueba de que la unidad está legalmente vigente — pídela antes de que el dinero se mueva.',
        ],
      },
      {
        heading: 'Qué significa para dueños, arrendatarios y usuarios de pool',
        body: [
          'Si el chasis es tuyo, todas las capas son tuyas: inspecciones periódicas a tiempo, programa de reparación y seguimiento de DVIRs. Si arriendas, el contrato debe decir explícitamente quién carga inspección y mantenimiento — nunca lo asumas. Si usas chasis de pool de un IEP, el proveedor responde por la roadability, pero tu conductor sigue debiendo el pre-viaje y el DVIR.',
          'La conclusión práctica para compradores: un chasis con historial de inspección ordenado vale más que una unidad idéntica sin él, porque es prueba de cumplimiento que heredas desde el día uno.',
        ],
      },
    ],
    faqs: [
      { q: '¿Qué es la regla de roadability de FMCSA?', a: 'La regla de 2009 (49 CFR Parte 390 Subparte C) que hizo a los Intermodal Equipment Providers directamente responsables de la condición de los chasis que entregan — registro, marcado USDOT, mantenimiento sistemático y respuesta a defectos.' },
      { q: '¿Cada cuánto debe inspeccionarse un chasis?', a: 'Una inspección periódica documentada al menos cada 12 meses bajo 49 CFR 396.17, más la inspección pre-viaje del conductor antes de cada movimiento.' },
      { q: '¿Quién responde por defectos en un chasis de pool?', a: 'El IEP responde por la roadability del equipo entregado; el conductor igualmente debe hacer pre-viaje y reportar defectos por DVIR antes de operar.' },
      { q: '¿Qué revisa el DOT en carretera?', a: 'Frenos, luces, llantas, acoplamiento y sujeción (twist locks, soportes), suspensión y condición del marco — los mismos sistemas que certifica la inspección periódica.' },
      { q: '¿Estas reglas aplican a un chasis propio?', a: 'Sí. La propiedad consolida todos los deberes — inspecciones periódicas, programa de mantenimiento y respuesta a DVIRs — en ti como operador.' },
    ],
  },
};
