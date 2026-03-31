/**
 * Textos de interpretación sefirá + planeta natural + signo asignado.
 * Solo párrafos de lectura; sin títulos de glifo/signo ni líneas tipo "Caph + Heh".
 */

/** @typedef {{ paragraphs: string[], evolution: string[] }} SephiraSignInterpretation */

/** @type {Record<string, SephiraSignInterpretation>} Sol en Tipheret por id de signo */
const TIPHERETH_SUN = {
  aries: {
    paragraphs: [
      'Aquí la identidad solar se encuentra con una fuerza que no solo impulsa, sino que constituye, inaugura, abre existencia.',
      'Caph recompensa aquello que el ser encarna de verdad; Heh, como inteligencia constituyente, da forma al acto inicial, a la chispa que pone algo en marcha. La combinación produce una identidad que se descubre a sí misma creando movimiento, abriendo camino, afirmando presencia.',
      'La tensión aparece cuando la persona cree que todo impulso ya es auténtico solo por ser intenso. Pero Caph no responde a la intensidad por sí sola: responde a la verdad del impulso. Aries quiere actuar primero; Caph exige que esa acción revele realmente al ser, y no solo una descarga reactiva.',
      'Esta combinación puede hacer que la vida responda con enorme rapidez. Cuando hay alineación, todo parece abrirse: decisiones, caminos, oportunidades, liderazgo. Cuando no la hay, la respuesta también es inmediata, pero en forma de choque, resistencia o desgaste. No porque "algo esté mal", sino porque el alma está aprendiendo a distinguir entre impulso y dirección.',
    ],
    evolution: [
      'Aprender que iniciar no basta: hay que iniciar desde el centro.',
      'La evolución aquí consiste en convertir la espontaneidad en acto consciente. Cuando la voluntad deja de ser reacción y se vuelve expresión real del ser, la vida deja de sentirse como combate y empieza a sentirse como apertura.',
    ],
  },
  taurus: {
    paragraphs: [
      'En esta combinación, la identidad solar busca arraigo, continuidad y forma estable, pero lo hace atravesada por una inteligencia que une, sostiene y permite la permanencia.',
      'Vav, como inteligencia triunfante, no triunfa por velocidad sino por consolidación. Une lo disperso, conecta lo superior con lo inferior, y permite que algo permanezca el tiempo suficiente para volverse real. Al encontrarse con Caph, la recompensa llega a través de lo que se ha sabido sostener con valor verdadero.',
      'Aquí el ser aprende que su identidad no se revela en la intensidad del momento, sino en lo que puede mantener vivo con el tiempo. Hay una vocación de construir, de encarnar valor, de hacer tangible aquello que el alma considera precioso. Pero el riesgo está en confundir permanencia con posesión, o constancia con inmovilidad.',
      'Caph y Vav juntos muestran que el verdadero triunfo no es retener, sino establecer una forma viva. Si Tauro se aferra a lo que ya no tiene alma, la recompensa se estanca. Si sostiene con presencia lo que sí tiene verdad, la vida responde con abundancia, confianza y profundidad.',
    ],
    evolution: [
      'Aprender a sostener sin petrificar.',
      'La evolución aquí consiste en comprender que la verdadera estabilidad es orgánica. El alma madura cuando deja de aferrarse a la forma y aprende a reconocer qué merece seguir siendo alimentado.',
    ],
  },
  gemini: {
    paragraphs: [
      'Esta combinación vuelve a la identidad solar móvil, curiosa y múltiple.',
      'Zain, la inteligencia disponente, organiza, dispone, distribuye; no fija una sola verdad, sino que acomoda piezas, abre conexiones, genera puentes entre elementos distintos. Al encontrarse con Caph, aparece una identidad que aprende por asociación, por contraste, por lenguaje y por intercambio.',
      'Aquí el ser no se encuentra a sí mismo en una definición rígida, sino en el acto de ir enlazando perspectivas. La vida recompensa la flexibilidad mental, la capacidad de nombrar, de interpretar, de traducir. Pero también expone con claridad cuándo esa multiplicidad se vuelve dispersión o cuándo el lenguaje sustituye la experiencia.',
      'Caph y Zain juntos pueden dar una inteligencia viva y brillante, pero también una identidad demasiado repartida entre muchas versiones de sí misma. La persona puede saber muchas cosas sobre sí sin terminar de habitar ninguna. Entonces la recompensa se vuelve parcial: mucha comprensión, pero poca encarnación.',
    ],
    evolution: [
      'Pasar de conectar ideas a integrar verdad.',
      'La evolución aquí consiste en que el pensamiento deje de ser una colección de posibilidades y se convierta en una vía de coherencia. No basta con comprenderse desde muchos ángulos; hay que permitir que esa comprensión tome cuerpo.',
    ],
  },
  cancer: {
    paragraphs: [
      'Aquí la identidad solar entra en un campo profundamente sensible.',
      'Heth, la inteligencia receptiva, abre el espacio del sentir, de la contención, de la interioridad que recibe e incorpora. Al combinarse con Caph, la recompensa ya no se percibe tanto a través del logro o del movimiento, sino a través de la calidad de apertura emocional con la que el ser vive.',
      'Esta combinación produce una identidad que se reconoce en lo que nutre, en lo que resguarda, en lo que permite entrar a su mundo interno. Pero precisamente por esa sensibilidad, el riesgo es cerrarse demasiado. Cuando el yo teme ser afectado, se protege; y al protegerse en exceso, deja también de recibir aquello que le revelaría su verdad.',
      'Caph y Heth juntos enseñan que la vida responde según la capacidad de recibirla. Si el corazón está blindado, la experiencia se vuelve pobre o repetitiva. Si hay receptividad con centro, la realidad comienza a devolver intimidad, pertenencia, profundidad emocional y una forma de guía interna muy fina.',
    ],
    evolution: [
      'Comprender que recibir también es una forma de fuerza.',
      'La evolución aquí consiste en desarrollar una receptividad con estructura: sensibilidad sin colapso, apertura sin pérdida del centro, cuidado sin encierro.',
    ],
  },
  leo: {
    paragraphs: [
      'Esta es una combinación potentísima, porque el Sol entra en su propio lenguaje de radiación y presencia, pero se encuentra con Teth, la inteligencia oculta.',
      'Eso significa que el brillo leonino no se agota en la expresión visible: debajo de la autoafirmación hay una fuerza profunda, casi secreta, que busca emerger. La recompensa de Caph no llega aquí simplemente por destacar, sino por permitir que lo oculto se vuelva auténticamente luminoso.',
      'Leo tiende a identificarse con su capacidad de crear, atraer, irradiar. Pero Teth recuerda que la verdadera luz no es pose, sino revelación de un tesoro interior. Cuando la expresión está desconectada de ese fondo real, la respuesta externa puede volverse inconsistente: reconocimiento vacío, necesidad creciente de validación, sensación de que el aplauso nunca basta.',
      'Caph y Teth juntos enseñan que la verdadera realeza no consiste en ser visto, sino en dejar salir con nobleza lo que estaba reservado en el centro del ser. Entonces la vida responde con magnetismo real, no forzado.',
    ],
    evolution: [
      'Aprender a expresar la profundidad, no solo la imagen.',
      'La evolución aquí consiste en dejar de actuar la identidad y comenzar a irradiarla desde lo que verdaderamente vive en el corazón.',
    ],
  },
  virgo: {
    paragraphs: [
      'Aquí el Sol se une a una inteligencia de precisión, detalle y operación concreta.',
      'Yod, la inteligencia ejecutora, concentra, aplica, realiza; es la chispa minúscula que contiene potencia de manifestación. Al combinarse con Caph, la identidad aprende que cada pequeño acto tiene peso, que la realidad responde no solo a las grandes intenciones, sino a la exactitud con que se las encarna.',
      'Esta combinación puede producir una conciencia extremadamente fina de ajuste, mejora y discernimiento. El ser se reconoce en lo útil, en lo bien hecho, en lo que aporta orden real. Pero también puede caer en la creencia de que si algo no está suficientemente corregido, todavía no merece existir.',
      'Caph y Yod juntos muestran que el alma se refina en la práctica, pero no se define únicamente por ella. La recompensa llega cuando el detalle está al servicio de la verdad, no cuando reemplaza a la verdad. Si no, aparece una identidad atrapada en la autoevaluación constante.',
    ],
    evolution: [
      'Usar la precisión como vía de presencia, no de autocastigo.',
      'La evolución aquí consiste en reconocer que el perfeccionamiento es sagrado solo cuando ayuda a revelar el ser, no cuando intenta justificarlo.',
    ],
  },
  libra: {
    paragraphs: [
      'Lamed, la inteligencia fiel, introduce un principio de rectitud interior, aprendizaje por equilibrio y orientación hacia una ley más alta. No es "fidelidad" en el sentido social o romántico nada más; es fidelidad a una medida interna, a una armonía verdadera, a una proporción justa entre fuerzas.',
      'Cuando Caph se une con Lamed, la identidad solar aprende que la vida devuelve según el grado de fidelidad con el que el ser se mantiene alineado a su verdad relacional. En Libra, el yo se reconoce a través del otro, del espejo, del vínculo, de la reciprocidad. Pero con Lamed, ese encuentro no puede ser meramente complaciente: debe ser justo, honesto, proporcionado.',
      'Esta combinación hace que la persona aprenda muchísimo a través de relaciones, asociaciones, pactos y reflejos. Pero la recompensa no llega por agradar ni por sostener armonía superficial; llega cuando hay fidelidad a una verdad del corazón. Si se traiciona a sí misma para conservar equilibrio externo, Caph lo muestra rápido: aparece vacío, resentimiento, indecisión, o una belleza sin sustancia.',
      'Caph y Lamed hablan de una identidad que se refina al aprender a ser leal no solo al vínculo, sino al centro que hace posible un vínculo verdadero. La armonía aquí no es cosmética: es moral, energética, espiritual.',
    ],
    evolution: [
      'Volverse fiel a la verdad que sostiene el equilibrio, no solo al equilibrio mismo.',
      'La evolución aquí consiste en entender que la paz real nace cuando el corazón no se traiciona para ser amado, aceptado o validado. La verdadera belleza es la que permanece justa.',
    ],
  },
  scorpio: {
    paragraphs: [
      'En Escorpio, el Sol entra a un territorio de profundidad, intensidad y transformación.',
      'Nun, la inteligencia imaginativa, no debe entenderse aquí como fantasía ligera, sino como poder de gestación interior, visión de lo oculto, capacidad de sentir lo que aún no tiene forma visible. Es una inteligencia que penetra capas invisibles y se relaciona con procesos de muerte, regeneración y potencia latente.',
      'Al combinarse con Caph, esta imaginación se vuelve kármica en el mejor sentido: lo que se gesta por dentro termina convocando respuesta por fuera. La vida parece responder no solo a las acciones visibles, sino a lo que está siendo alimentado en secreto: deseo, temor, obsesión, anhelo, intención profunda.',
      'Esta combinación puede dar una identidad con enorme poder de transformación, porque capta lo que otros no ven y puede atravesar procesos internos radicales. Pero también puede quedar atrapada en ciclos de control, sospecha o intensidad autogenerada. Caph devuelve exactamente el contenido vibrante de lo que se está incubando.',
    ],
    evolution: [
      'Purificar lo que se alimenta en lo profundo.',
      'La evolución aquí consiste en comprender que no solo se manifiesta lo que se hace, sino también lo que se cultiva interiormente. Transformar la imaginación en alquimia consciente.',
    ],
  },
  sagittarius: {
    paragraphs: [
      'Aquí la identidad solar se expande en busca de sentido, horizonte, verdad y visión.',
      'Samekh, la inteligencia probatoria, introduce la idea de prueba, sostén y verificación. La verdad no basta con ser intuida o proclamada: debe atravesar experiencia, tensión, trayecto. Cuando se une con Caph, el alma aprende que la recompensa llega cuando la visión ha sido realmente puesta a prueba.',
      'Esta combinación produce una identidad orientada hacia significado, enseñanza, exploración y confianza. Pero la vida le pide constantemente corroborar que su fe tenga sustancia. Si Sagitario se queda en entusiasmo abstracto o en certeza no encarnada, Caph responde con situaciones que cuestionan, tensan o relativizan esa visión.',
      'Caph y Samekh enseñan que el propósito no es una consigna, sino una columna interna que se fortalece al ser vivida. La expansión verdadera requiere atravesar pruebas de coherencia.',
    ],
    evolution: [
      'Permitir que la experiencia refine la visión.',
      'La evolución aquí consiste en dejar que la verdad se vuelva carne, práctica, ética vivida. La fe madura cuando sobrevive al camino.',
    ],
  },
  capricorn: {
    paragraphs: [
      'Esta combinación es más compleja de lo que parece.',
      'Capricornio suele asociarse con estructura, esfuerzo, forma, logro y consolidación, pero aquí entra Ayin como inteligencia renovadora. Eso significa que la identidad no está llamada simplemente a construir, sino a construir de una manera que permita renovación, revisión y regeneración de la forma.',
      'Con Caph, la vida responde de manera muy clara a lo que se ha edificado. Todo acto tiene consecuencia, toda estructura revela su valor real con el tiempo. Pero Ayin impide que esa estructura se vuelva definitiva. Obliga a ver, reconsiderar, transformar la relación con el poder, la responsabilidad y la materia.',
      'Esta combinación puede dar enorme capacidad de sostener procesos largos, asumir peso y producir resultados sólidos. Pero también puede llevar a una identificación excesiva con la carga, el deber o la imagen de solidez. Entonces la renovación se vive como amenaza, cuando en realidad es parte del propósito.',
    ],
    evolution: [
      'Aprender a renovar la estructura sin sentir que el ser colapsa.',
      'La evolución aquí consiste en entender que madurar no es volverse rígido, sino crear formas capaces de seguir siendo verdaderas con el tiempo.',
    ],
  },
  aquarius: {
    paragraphs: [
      'Aquí el Sol se encuentra con una inteligencia que busca la ley inherente de las cosas, lo natural, lo esencial, aquello que brota sin artificio cuando una forma está alineada con su principio.',
      'Tzaddi, como inteligencia natural, no habla de "lo común", sino de lo que responde a una verdad intrínseca. Al unirse con Caph, la recompensa llega cuando la identidad deja de obedecer moldes ajenos y empieza a expresar su patrón genuino.',
      'En Acuario, esto se vive como necesidad de libertad, singularidad, visión colectiva, innovación o ruptura de estructuras obsoletas. Pero el peligro es convertir la diferencia en identidad defensiva. Entonces lo "auténtico" termina siendo solo oposición.',
      'Caph y Tzaddi enseñan que la verdadera originalidad no es romper por romper, sino alinearse con una ley interna más pura que la convención. Cuando eso ocurre, la vida responde con sincronías, conexiones correctas, descubrimientos, comunidad afín. Cuando no, aparece extrañamiento o desconexión.',
    ],
    evolution: [
      'Volverse natural en la propia singularidad.',
      'La evolución aquí consiste en dejar de fabricar diferencia y comenzar a habitar una autenticidad orgánica, conectada tanto con la propia esencia como con una inteligencia colectiva más amplia.',
    ],
  },
  pisces: {
    paragraphs: [
      'Esta combinación es preciosa porque rompe una idea simplista de Piscis.',
      'Qoph, la inteligencia corpórea, trae al signo de la disolución una dimensión de encarnación, sensibilidad somática, inscripción en el cuerpo y en los umbrales entre lo visible y lo invisible. Al encontrarse con Caph, la identidad aprende que incluso lo más sutil necesita vehículo, forma de percepción, canal sensible.',
      'Piscis tiende a expandirse, fundirse, imaginar, compadecer, soñar. Pero Qoph recuerda que toda experiencia espiritual, psíquica o emocional pasa por el cuerpo, por ritmos, por límites, por estados concretos de percepción. Entonces la recompensa no llega solo por sensibilidad, sino por aprender a encarnarla.',
      'Esta combinación puede dar gran empatía, intuición, arte, resonancia y conexión con dimensiones sutiles. Pero también puede producir confusión, evasión o dificultad para sostener bordes claros. Caph responde creando escenarios en que el alma debe aprender a poner cuerpo a lo que siente, o a discernir qué pertenece realmente a su centro.',
    ],
    evolution: [
      'Dar forma sensible a lo invisible.',
      'La evolución aquí consiste en comprender que la verdadera apertura espiritual no excluye el cuerpo: lo necesita. Integrar sensibilidad con contención, visión con arraigo, compasión con límites.',
    ],
  },
}

/**
 * @param {string | undefined} sephirotId
 * @param {string | null | undefined} planetKey
 * @param {string | undefined} signId
 * @returns {SephiraSignInterpretation | null}
 */
export function getSephirotInterpretation(sephirotId, planetKey, signId) {
  if (!sephirotId || !planetKey || !signId) return null
  if (sephirotId === 'tiphareth' && planetKey === 'sun') {
    return TIPHERETH_SUN[signId] ?? null
  }
  return null
}
