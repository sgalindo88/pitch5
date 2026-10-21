// Formation content (EN base + ES translations), ghost attackers. Positions are [x,y] percent; y 0 = opponent goal, 100 = ours.

export const ES_FORMATIONS = {
  diamond: {
    name: '1-2-1 Rombo (Futsal Clásico)',
    roles: ['Portero', 'Fixo (Ancla)', 'Ala Izquierdo', 'Ala Derecho', 'Pívot'],
    tags: ['POR', 'FIX', 'ALA', 'ALA', 'PIV'],
    overview: 'El clásico rombo del futsal que estira la cancha y crea triángulos de pase.',
    pros: ['Amplitud y profundidad', 'Triángulos de pase naturales', 'Situaciones de 1 contra 1 frecuentes'],
    cons: ['Hueco central si los alas se adelantan demasiado', 'El Fixo queda solo y expuesto en pérdidas rápidas'],
    responsibilities: ['El Fixo marca el ritmo y cubre la espalda', 'Los Alas dan amplitud y se incorporan por fuera', 'El Pívot fija al último defensor'],
    texts: ['El Fixo se abre junto al portero, los Alas bajan y el Pívot se queda arriba para fijar al defensor.',
      'Un ala se incorpora por dentro; el Pívot recibe de espaldas y descarga para la carrera del tercer hombre.',
      'Rombo compacto que obliga al rival a jugar por fuera.']
  },
  box: {
    name: '2-2 Caja / Cuadrado',
    roles: ['Portero', 'Defensa Izquierdo', 'Defensa Derecho', 'Delantero Izquierdo', 'Delantero Derecho'],
    tags: ['POR', 'DI', 'DD', 'DEI', 'DED'],
    overview: 'Dos parejas que forman un cuadrado; gran equilibrio y rotaciones sencillas.',
    pros: ['Estabilidad defensiva', 'Roles claros por cuadrante', 'Salidas fáciles para el portero', 'Carreras en profundidad peligrosas'],
    cons: ['Hueco en el centro', 'Se vuelve estático si las parejas no rotan'],
    responsibilities: ['Los defensas se abren para recibir del portero y temporizan las incorporaciones', 'Los delanteros dan amplitud y se cruzan'],
    texts: ['Los defensas abren el ancho del área, los delanteros se estiran arriba.',
      'Un defensa se incorpora por la espalda mientras los delanteros se cruzan.',
      'Doble línea plana que cierra los pasillos centrales.']
  },
  pyramid: {
    name: '3-1 Pirámide / Muro',
    roles: ['Portero', 'Defensa Izquierdo', 'Defensa Central', 'Defensa Derecho', 'Pívot'],
    tags: ['POR', 'DI', 'DC', 'DD', 'PIV'],
    overview: 'Tres jugadores atrasados detrás de un único delantero referencia.',
    pros: ['Máxima solidez', 'Ideal para proteger una ventaja o descansar', 'Invita al contraataque'],
    cons: ['Cede territorio', 'El delantero queda aislado', 'Poco apoyo arriba'],
    responsibilities: ['La línea de tres circula con seguridad y temporiza las llegadas', 'El Pívot sostiene el balón'],
    texts: ['Pases cortos y seguros en horizontal entre los tres de atrás.',
      'Pase vertical rápido al Pívot y llegadas tardías desde atrás.',
      'Muro en bloque bajo que fuerza tiros lejanos de poca probabilidad.']
  },
  aggressive: {
    name: '1-1-2 Pie Adelantado',
    roles: ['Portero', 'Defensa', 'Mediocampista', 'Delantero Izquierdo', 'Delantero Derecho'],
    tags: ['POR', 'DEF', 'MED', 'DEI', 'DED'],
    overview: 'Mucho peso ofensivo con presión alta.',
    pros: ['Superioridad ofensiva', 'Presión constante', 'Encierra al rival en su propia área'],
    cons: ['Muy expuesto atrás', 'El defensa queda aislado en transición', 'Difícil salir jugando bajo presión'],
    responsibilities: ['El mediocampista baja para formar una salida de dos', 'Los delanteros presionan y hacen carreras divergentes', 'El defensa mantiene la disciplina'],
    texts: ['El mediocampista baja junto al defensa para formar una línea de salida de dos.',
      'Presión alta y carreras divergentes de los dos delanteros.',
      'Contrapresión inmediata al perder el balón.']
  },
  compact: {
    name: '2-1-1 Línea Compacta',
    roles: ['Portero', 'Defensa Izquierdo', 'Defensa Derecho', 'Mediocampista Central', 'Delantero'],
    tags: ['POR', 'DI', 'DD', 'MED', 'DEL'],
    overview: 'Dos defensas atrasados, un mediocampista tipo pívot y un delantero.',
    pros: ['Seguridad defensiva', 'Se forma un rombo al progresar', 'Protección central'],
    cons: ['Poca amplitud natural', 'Depende de que los defensas sepan cuándo sumarse al ataque'],
    responsibilities: ['El mediocampista recibe entre líneas y rota hacia afuera', 'Un defensa sube a rematar', 'El delantero fija a la defensa'],
    texts: ['El mediocampista recibe entre las líneas de presión rivales.',
      'El mediocampista rota hacia afuera mientras un defensa sube para el remate central.',
      'Triángulo cerrado frente al portero.']
  },
  roaming: {
    name: '1-3 Móvil / Fluidez Total',
    roles: ['Portero', 'Ancla', 'Móvil 1', 'Móvil 2', 'Móvil 3'],
    tags: ['POR', 'ANC', 'M1', 'M2', 'M3'],
    overview: 'Un ancla y tres atacantes que intercambian posiciones constantemente.',
    pros: ['Impredecible', 'Desajustes constantes', 'Forma jugadores adaptables'],
    cons: ['Riesgo de desorganización', 'Requiere comunicación y repliegue estricto para evitar contraataques'],
    responsibilities: ['El ancla es la válvula de seguridad', 'Los móviles rotan carriles y recuperan tras la pérdida'],
    texts: ['Los atacantes intercambian posiciones para romper la marca.',
      'Sobrecarga de un lado, dejando libre el segundo palo.',
      'Marcaje hombre a hombre y repliegue rápido.']
  }
};

export const FORMATIONS = [
  {
    id: 'diamond', name: '1-2-1 Diamond (Futsal Classic)',
    roles: ['Goalkeeper', 'Anchor (Fixo)', 'Left Wing', 'Right Wing', 'Pivot'],
    tags: ['GK', 'ANC', 'LW', 'RW', 'PIV'],
    overview: 'Classic futsal rhombus that stretches the pitch and creates passing triangles.',
    pros: ['Width and depth', 'Natural passing triangles', 'Frequent 1v1 situations'],
    cons: ['Central gap if wings overcommit', 'Lone Anchor is exposed on quick turnovers'],
    responsibilities: ['Anchor sets tempo and covers behind', 'Wings provide width and overlap', 'Pivot pins the last defender'],
    phases: [
      { pos: [[50,92],[50,72],[22,55],[78,55],[50,28]], pass: [0,1,2,4], text: 'Anchor splits with the GK, Wings drop deep, Pivot stays high to pin the defender.' },
      { pos: [[50,80],[50,56],[34,32],[76,30],[50,16]], pass: [1,4,3], text: 'Wing overlaps inside; Pivot receives back to goal and lays off for the third-man run.' },
      { pos: [[50,92],[50,78],[30,66],[70,66],[50,52]], pass: [], text: 'Compact diamond funnelling play wide.' }
    ]
  },
  {
    id: 'box', name: '2-2 Box / Square',
    roles: ['Goalkeeper', 'Back Left', 'Back Right', 'Forward Left', 'Forward Right'],
    tags: ['GK', 'BL', 'BR', 'FL', 'FR'],
    overview: 'Two pairs forming a square; strong balance and easy rotation.',
    pros: ['Defensive stability', 'Clear roles per quadrant', 'Easy GK outlets', 'Potent deep runs'],
    cons: ['Gap in the middle', 'Becomes static if pairs do not rotate'],
    responsibilities: ['Backs split to receive from the GK and time overlaps', 'Forwards stretch and cross paths'],
    phases: [
      { pos: [[50,92],[25,74],[75,74],[22,34],[78,34]], pass: [0,1,3], text: 'Backs split the box width, forwards stretch high.' },
      { pos: [[50,80],[20,56],[66,30],[62,20],[38,22]], pass: [1,3,2], text: 'One back makes a blind-side overlap while forwards cross.' },
      { pos: [[50,92],[36,76],[64,76],[36,58],[64,58]], pass: [], text: 'Flat double line closing the central lanes.' }
    ]
  },
  {
    id: 'pyramid', name: '3-1 Pyramid / Wall',
    roles: ['Goalkeeper', 'Defender Left', 'Defender Centre', 'Defender Right', 'Pivot'],
    tags: ['GK', 'DL', 'DC', 'DR', 'PIV'],
    overview: 'Three deep players behind a lone target forward.',
    pros: ['Maximum solidity', 'Good for protecting a lead or resting', 'Invites counter-attacks'],
    cons: ['Gives up territory', 'Lone striker is isolated', 'Little forward support'],
    responsibilities: ['Back three circulate safely and time late runs', 'Pivot holds the ball up'],
    phases: [
      { pos: [[50,92],[20,74],[50,70],[80,74],[50,32]], pass: [0,1,2,3], text: 'Short, safe horizontal passing across the back three.' },
      { pos: [[50,82],[24,52],[50,44],[76,52],[50,16]], pass: [3,4,2], text: 'Quick vertical pass to the Pivot, late surging runs from deep.' },
      { pos: [[50,92],[28,78],[50,74],[72,78],[50,50]], pass: [], text: 'Low-block wall forcing low-percentage long shots.' }
    ]
  },
  {
    id: 'aggressive', name: '1-1-2 Front-Foot',
    roles: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward Left', 'Forward Right'],
    tags: ['GK', 'DEF', 'MID', 'FL', 'FR'],
    overview: 'Heavy attacking weight with a high press.',
    pros: ['Attacking overload', 'Relentless pressing', 'Pins the opponent in their own area'],
    cons: ['Very exposed at the back', 'Defender isolated in transition', 'Hard to build under pressure'],
    responsibilities: ['Midfielder drops to form a two-man exit', 'Forwards press and make split runs', 'Defender stays disciplined'],
    phases: [
      { pos: [[50,92],[36,72],[64,72],[25,34],[75,34]], pass: [0,1,2,4], text: 'Midfielder drops beside the Defender to make a two-man exit line.' },
      { pos: [[50,82],[50,58],[50,40],[32,18],[68,18]], pass: [2,3,4], text: 'High press and split runs from the twin forwards.' },
      { pos: [[50,90],[50,66],[50,50],[36,40],[64,40]], pass: [], text: 'Immediate counter-press on losing the ball.' }
    ]
  },
  {
    id: 'compact', name: '2-1-1 Compact Backline',
    roles: ['Goalkeeper', 'Back Left', 'Back Right', 'Central Midfielder', 'Forward'],
    tags: ['GK', 'BL', 'BR', 'MID', 'FWD'],
    overview: 'Two deep defenders, a pivot-style midfielder and a striker.',
    pros: ['Defensive security', 'A diamond forms during progression', 'Central protection'],
    cons: ['Little natural width', 'Relies on defenders knowing when to join the attack'],
    responsibilities: ['Midfielder receives between lines and rotates wide', 'A Back steps up to shoot', 'Forward fixes the defence'],
    phases: [
      { pos: [[50,92],[28,76],[72,76],[50,56],[50,28]], pass: [0,1,3,4], text: "Midfielder receives between the opponents' pressing lines." },
      { pos: [[50,84],[30,62],[56,36],[80,40],[44,18]], pass: [3,4,2], text: 'Midfielder rotates wide while a back steps up for the central shot.' },
      { pos: [[50,92],[36,78],[64,78],[50,64],[50,46]], pass: [], text: 'Tight triangle in front of the GK.' }
    ]
  },
  {
    id: 'roaming', name: '1-3 Roaming / Total Fluidity',
    roles: ['Goalkeeper', 'Anchor', 'Roamer 1', 'Roamer 2', 'Roamer 3'],
    tags: ['GK', 'ANC', 'R1', 'R2', 'R3'],
    overview: 'One anchor and three attackers who swap positions constantly.',
    pros: ['Unpredictable', 'Constant mismatches', 'Builds adaptable players'],
    cons: ['Disorganisation risk', 'Needs communication and strict recovery to avoid counters'],
    responsibilities: ['Anchor is the safety valve', 'Roamers rotate lanes and recover on loss'],
    phases: [
      { pos: [[50,92],[50,74],[24,48],[50,40],[76,48]], pass: [0,1,2,3], text: 'Attackers swap positions to break man-marking.' },
      { pos: [[50,84],[50,60],[20,28],[36,16],[34,38]], pass: [1,4,3,2], text: 'Overload one side, leaving the far post open.' },
      { pos: [[50,92],[50,76],[30,64],[50,58],[70,64]], pass: [], text: 'Man-to-man tracking and rapid back-checking.' }
    ]
  }
];
// Ghost attackers (shown in the Defensive Shape phase only) and their ball path.
export const GHOSTS = [[50,40],[22,48],[78,48],[50,24]];
export const GHOST_PASS = [3,0,1];

// Short labels for the formation pill grid.
export const SHORT_NAMES = {
  en: { diamond: '1-2-1 Diamond', box: '2-2 Box', pyramid: '3-1 Wall', aggressive: '1-1-2 Attack', compact: '2-1-1 Compact', roaming: '1-3 Roaming' },
  es: { diamond: '1-2-1 Rombo', box: '2-2 Caja', pyramid: '3-1 Muro', aggressive: '1-1-2 Ataque', compact: '2-1-1 Compacta', roaming: '1-3 Móvil' }
};
