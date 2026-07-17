import type { ResourceArticle } from '../types.js';

export const chassisMaintenanceChecklist: ResourceArticle = {
  slug: 'chassis-maintenance-checklist',
  category: 'operations',
  datePublished: '2026-07-16',
  readingMinutes: 7,
  relatedLanding: ['container-chassis/40ft', 'locations/houston', 'chassis-leasing'],
  en: {
    metaTitle: 'Chassis Maintenance Checklist: FMCSA Inspection Requirements',
    metaDescription: 'A working chassis maintenance checklist built around FMCSA rules: daily pre-trip items, monthly PM tasks, the annual 49 CFR 396.17 inspection, and the records that prove it.',
    title: 'Chassis Maintenance Checklist: FMCSA Inspection Requirements',
    lead: 'A compliant chassis maintenance program has three layers — the driver pre-trip before every move (49 CFR 392.7), scheduled preventive maintenance on brakes, tires, lights, and locks, and the documented periodic inspection required at least every 12 months under 49 CFR 396.17. Chassis fail roadside inspections overwhelmingly on the same few systems (lights, tires, brakes), which means a short, disciplined checklist prevents the majority of violations and out-of-service orders.',
    keyTakeaways: [
      'Three layers: daily pre-trip, scheduled PM, and the annual periodic inspection under 49 CFR 396.17.',
      'Lights, tires, and brakes cause most chassis violations — weight your checklist toward them.',
      'Twist locks and bolsters are chassis-specific securement items regulators and terminals both check.',
      'Records are half of compliance: undocumented maintenance legally never happened.',
      'Buying used? The inspection history is as much a part of the purchase as the steel.',
    ],
    sections: [
      {
        heading: 'Layer 1 — The daily pre-trip (49 CFR 392.7)',
        body: [
          'Federal rules prohibit driving unless the driver is satisfied key systems are in good working order. On a chassis, the pre-trip that satisfies both the regulation and reality covers:',
        ],
        list: [
          'Lights and reflectors: all lamps lit, lenses intact, conspicuity tape present.',
          'Tires: tread depth, inflation, no exposed cord or sidewall damage; check inside duals.',
          'Brakes: air lines seated, no audible leaks, slack adjusters within stroke.',
          'Twist locks: all four handles seat, lock, and secure the container corners.',
          'Coupling: kingpin and upper plate condition; landing gear crank and legs functional.',
          'Frame: no visible cracks at the gooseneck, bolsters, or crossmembers.',
        ],
      },
      {
        heading: 'Layer 2 — Scheduled preventive maintenance',
        body: [
          'Between daily checks and the annual inspection, a monthly-to-quarterly PM cycle keeps wear items from becoming violations: lubricate twist locks, landing gear, and (on extendables) slider rails and pins; measure brake lining and push-rod stroke; rotate or replace tires approaching minimums; verify ABS lamp function; and touch up rust before it reaches structural members.',
          'PM intervals should tighten with duty cycle — port drayage in salt air ages a chassis faster than regional dry lanes.',
        ],
      },
      {
        heading: 'Layer 3 — The annual periodic inspection (49 CFR 396.17)',
        body: [
          'Every chassis must pass a documented periodic inspection at least once every 12 months, performed by a qualified inspector against the minimum standards in the regulation’s appendix: brake systems, coupling devices, frame, lighting, suspension, tires, wheels and rims, and securement structures.',
          'The inspection record must identify the equipment, inspector, date, and components inspected, and evidence of the current inspection must be available — this is the document roadside enforcement and terminal gates expect to trace.',
        ],
      },
      {
        heading: 'The records that make it real',
        body: [
          'FMCSA’s maintenance rules (49 CFR 396.3) require systematic inspection, lubrication, and repair records for equipment you control. Practically: keep a file per chassis — periodic inspections, PM work orders, DVIR defect reports and their corrections — retrievable on request.',
          'Those files pay for themselves twice: they keep you clean in an audit, and they raise resale value, because a documented chassis is a provable chassis.',
        ],
      },
    ],
    faqs: [
      { q: 'How often does a chassis legally need inspection?', a: 'A documented periodic inspection at least every 12 months (49 CFR 396.17), plus the driver pre-trip before every move (49 CFR 392.7).' },
      { q: 'What are the most common chassis violations?', a: 'Lighting, tires, and brake defects dominate roadside chassis violations — the exact items a disciplined pre-trip catches first.' },
      { q: 'Who can perform the annual inspection?', a: 'A qualified inspector meeting FMCSA criteria — typically a trained fleet technician or a commercial inspection shop.' },
      { q: 'What records must I keep for my chassis?', a: 'Systematic maintenance and repair records (49 CFR 396.3), the current periodic inspection documentation, and DVIR defect reports with their corrections.' },
      { q: 'Do twist locks get inspected?', a: 'Yes — as securement components they fall under both the pre-trip and the periodic inspection, and terminals check them at the gate.' },
    ],
  },
  es: {
    metaTitle: 'Lista de Mantenimiento de Chasis: Requisitos de Inspección FMCSA',
    metaDescription: 'Una lista de mantenimiento de chasis construida sobre las reglas FMCSA: puntos diarios de pre-viaje, tareas mensuales de PM, la inspección anual de 49 CFR 396.17 y los registros que la prueban.',
    title: 'Lista de Mantenimiento de Chasis: Requisitos de Inspección FMCSA',
    lead: 'Un programa de mantenimiento de chasis en cumplimiento tiene tres capas — el pre-viaje del conductor antes de cada movimiento (49 CFR 392.7), el mantenimiento preventivo programado de frenos, llantas, luces y seguros, y la inspección periódica documentada requerida al menos cada 12 meses bajo 49 CFR 396.17. Los chasis reprueban las inspecciones en carretera abrumadoramente por los mismos sistemas (luces, llantas, frenos), lo que significa que una lista corta y disciplinada previene la mayoría de las infracciones y órdenes de fuera de servicio.',
    keyTakeaways: [
      'Tres capas: pre-viaje diario, PM programado y la inspección periódica anual bajo 49 CFR 396.17.',
      'Luces, llantas y frenos causan la mayoría de las infracciones — carga tu lista hacia ellos.',
      'Twist locks y soportes son puntos de sujeción específicos del chasis que reguladores y terminales revisan.',
      'Los registros son la mitad del cumplimiento: el mantenimiento sin documentar legalmente nunca ocurrió.',
      '¿Compras usado? El historial de inspección es tan parte de la compra como el acero.',
    ],
    sections: [
      {
        heading: 'Capa 1 — El pre-viaje diario (49 CFR 392.7)',
        body: [
          'Las reglas federales prohíben conducir salvo que el conductor esté satisfecho de que los sistemas clave funcionan. En un chasis, el pre-viaje que satisface la regla y la realidad cubre:',
        ],
        list: [
          'Luces y reflectores: todas las lámparas encienden, micas íntegras, cinta reflejante presente.',
          'Llantas: profundidad de dibujo, presión, sin cuerda expuesta ni daño de costado; revisa los duales por dentro.',
          'Frenos: líneas de aire asentadas, sin fugas audibles, matracas dentro de carrera.',
          'Twist locks: las cuatro manijas asientan, bloquean y aseguran las esquinas del contenedor.',
          'Acoplamiento: condición del kingpin y placa superior; manivela y patas del tren de aterrizaje funcionales.',
          'Marco: sin grietas visibles en el gooseneck, soportes o travesaños.',
        ],
      },
      {
        heading: 'Capa 2 — Mantenimiento preventivo programado',
        body: [
          'Entre las revisiones diarias y la inspección anual, un ciclo de PM mensual a trimestral evita que las piezas de desgaste se vuelvan infracciones: lubrica twist locks, tren de aterrizaje y (en extendibles) rieles y pernos del slider; mide forro de freno y carrera de varilla; rota o reemplaza llantas cercanas al mínimo; verifica la lámpara ABS; y ataca el óxido antes de que llegue a miembros estructurales.',
          'Los intervalos deben acortarse con el ciclo de trabajo — el drayage portuario en aire salino envejece un chasis más rápido que las rutas secas regionales.',
        ],
      },
      {
        heading: 'Capa 3 — La inspección periódica anual (49 CFR 396.17)',
        body: [
          'Todo chasis debe pasar una inspección periódica documentada al menos cada 12 meses, realizada por un inspector calificado contra los estándares mínimos del apéndice de la regulación: sistemas de freno, dispositivos de acoplamiento, marco, iluminación, suspensión, llantas, ruedas y rines, y estructuras de sujeción.',
          'El registro debe identificar el equipo, el inspector, la fecha y los componentes inspeccionados, y la evidencia de la inspección vigente debe estar disponible — es el documento que la autoridad en carretera y las puertas de terminal esperan rastrear.',
        ],
      },
      {
        heading: 'Los registros que lo hacen real',
        body: [
          'Las reglas de mantenimiento de FMCSA (49 CFR 396.3) exigen registros sistemáticos de inspección, lubricación y reparación del equipo que controlas. En la práctica: un expediente por chasis — inspecciones periódicas, órdenes de trabajo de PM, reportes DVIR y sus correcciones — recuperable a solicitud.',
          'Esos expedientes se pagan dos veces: te mantienen limpio en una auditoría y elevan el valor de reventa, porque un chasis documentado es un chasis demostrable.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cada cuánto debe inspeccionarse legalmente un chasis?', a: 'Una inspección periódica documentada al menos cada 12 meses (49 CFR 396.17), más el pre-viaje del conductor antes de cada movimiento (49 CFR 392.7).' },
      { q: '¿Cuáles son las infracciones más comunes?', a: 'Defectos de iluminación, llantas y frenos dominan las infracciones de chasis en carretera — exactamente lo que un pre-viaje disciplinado atrapa primero.' },
      { q: '¿Quién puede hacer la inspección anual?', a: 'Un inspector calificado según los criterios de FMCSA — típicamente un técnico de flota entrenado o un taller de inspección comercial.' },
      { q: '¿Qué registros debo conservar?', a: 'Registros sistemáticos de mantenimiento y reparación (49 CFR 396.3), la documentación de la inspección periódica vigente y los reportes DVIR con sus correcciones.' },
      { q: '¿Los twist locks se inspeccionan?', a: 'Sí — como componentes de sujeción entran en el pre-viaje y en la inspección periódica, y las terminales los revisan en la puerta.' },
    ],
  },
};
