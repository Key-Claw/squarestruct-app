const DEFAULT_LOCALE = 'es';

const ORDER_STATUS_LABELS = {
  es: {
    pendiente: 'Pendiente',
    aceptado: 'Aceptado',
    denegado: 'Denegado',
    cancelado: 'Cancelado',
    pagado: 'Pagado',
    enviado: 'Enviado',
    entregado: 'Entregado'
  },
  en: {
    pendiente: 'Pending',
    aceptado: 'Accepted',
    denegado: 'Rejected',
    cancelado: 'Canceled',
    pagado: 'Paid',
    enviado: 'Shipped',
    entregado: 'Delivered'
  }
};

const PAYMENT_LABELS = {
  es: {
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    paypal: 'PayPal',
    efectivo: 'Efectivo'
  },
  en: {
    tarjeta: 'Card',
    transferencia: 'Bank transfer',
    paypal: 'PayPal',
    efectivo: 'Cash'
  }
};

const MATERIAL_LABELS = {
  es: {
    'Plastico reciclable': 'Plastico reciclable',
    Hormigon: 'Hormigon'
  },
  en: {
    'Plastico reciclable': 'Recyclable plastic',
    Hormigon: 'Concrete'
  }
};

const CATEGORY_LABELS = {
  es: {
    'Plasticos renovables': 'Plasticos renovables',
    Hormigon: 'Hormigon'
  },
  en: {
    'Plasticos renovables': 'Renewable plastics',
    Hormigon: 'Concrete'
  }
};

const PRODUCT_NAME_REPLACEMENTS = [
  [/\bBloque Eco\b/gi, 'Eco Block'],
  [/\bPilar Eco\b/gi, 'Eco Pillar'],
  [/\bBloque\b/gi, 'Block'],
  [/\bPilar\b/gi, 'Pillar'],
  [/\bLigero\b/gi, 'Lightweight'],
  [/\bCerramiento\b/gi, 'Enclosure'],
  [/\bRefuerzo\b/gi, 'Reinforcement'],
  [/\bEsquina\b/gi, 'Corner'],
  [/\bTerminal\b/gi, 'Terminal'],
  [/\bAjuste\b/gi, 'Adjustment'],
  [/\bMedio\b/gi, 'Medium'],
  [/\bLargo\b/gi, 'Long'],
  [/\bCubo\b/gi, 'Cube'],
  [/\bMax\b/gi, 'Max'],
  [/\bModular\b/gi, 'Modular']
];

const PRODUCT_DESCRIPTION_REPLACEMENTS = [
  [/\bBloque eco modular de gran formato\b/gi, 'Large-format eco modular block'],
  [/\bBloque eco de formato base\b/gi, 'Eco block in a base format'],
  [/\bBloque eco corto\b/gi, 'Short eco block'],
  [/\bBloque eco para contencion, cauces y montaje modular rapido\b/gi, 'Eco block for retention, channels, and rapid modular assembly'],
  [/\bBloque eco para contencion\b/gi, 'Eco block for retention'],
  [/\bBloque eco para separadores de aridos\b/gi, 'Eco block for separators of aggregates'],
  [/\bBloque eco para separaciones interiores de gran longitud\b/gi, 'Eco block for long interior separations'],
  [/\bBloque eco para separadores de materiales\b/gi, 'Eco block for material separators'],
  [/\bBloque eco para remates, arranques y cambios de modulacion\b/gi, 'Eco block for finishes, starts, and module changes'],
  [/\bBloque eco para vallas y cerramientos perimetrales sin contencion de tierras\b/gi, 'Eco block for fences and perimeter enclosures without soil retention'],
  [/\bBloque eco para cerramientos perimetrales desmontables y soluciones temporales\b/gi, 'Eco block for removable perimeter enclosures and temporary solutions'],
  [/\bBloque eco para vallas, delimitaciones y remates de cerramiento\b/gi, 'Eco block for fences, boundaries, and enclosure finishes'],
  [/\bBloque eco para ajustes de longitud en cerramientos perimetrales\b/gi, 'Eco block for length adjustments in perimeter enclosures'],
  [/\bBloque de hormigon de gran formato\b/gi, 'Large-format concrete block'],
  [/\bBloque de hormigon para contencion, cauces y montaje mecanico rapido\b/gi, 'Concrete block for retention, channels, and fast mechanical assembly'],
  [/\bBloque de hormigon de formato base\b/gi, 'Concrete block in a base format'],
  [/\bBloque de hormigon corto\b/gi, 'Short concrete block'],
  [/\bBloque de hormigon para separadores de aridos\b/gi, 'Concrete block for separators of aggregates'],
  [/\bBloque de hormigon para separaciones interiores de gran longitud\b/gi, 'Concrete block for long interior separations'],
  [/\bBloque de hormigon para separadores de materiales\b/gi, 'Concrete block for material separators'],
  [/\bBloque de hormigon para remates, arranques y cambios de modulacion\b/gi, 'Concrete block for finishes, starts, and module changes'],
  [/\bBloque de hormigon para vallas y cerramientos perimetrales sin contencion de tierras\b/gi, 'Concrete block for fences and perimeter enclosures without soil retention'],
  [/\bBloque de hormigon para cerramientos perimetrales desmontables y soluciones temporales\b/gi, 'Concrete block for removable perimeter enclosures and temporary solutions'],
  [/\bBloque de hormigon para vallas, delimitaciones y remates de cerramiento\b/gi, 'Concrete block for fences, boundaries, and enclosure finishes'],
  [/\bBloque de hormigon para ajustes de longitud en cerramientos perimetrales\b/gi, 'Concrete block for length adjustments in perimeter enclosures'],
  [/\bPilar eco apilable para refuerzo vertical; dos piezas alcanzan 240 cm\b/gi, 'Stackable eco pillar for vertical reinforcement; two pieces reach 240 cm'],
  [/\bPilar eco apilable para esquinas y encuentros entre tramos modulares\b/gi, 'Stackable eco pillar for corners and joins between modular sections'],
  [/\bPilar eco para apoyo intermedio; tres piezas alcanzan 240 cm\b/gi, 'Eco pillar for intermediate support; three pieces reach 240 cm'],
  [/\bPilar eco para remates terminales; tres piezas alcanzan 240 cm\b/gi, 'Eco pillar for terminal finishes; three pieces reach 240 cm'],
  [/\bPilar eco para cerramientos; cuatro piezas alcanzan 240 cm\b/gi, 'Eco pillar for enclosures; four pieces reach 240 cm'],
  [/\bPilar eco compacto para apoyos bajos y delimitaciones temporales\b/gi, 'Compact eco pillar for low supports and temporary boundaries'],
  [/\bPilar de hormigon para refuerzo vertical; dos piezas alcanzan 240 cm\b/gi, 'Concrete pillar for vertical reinforcement; two pieces reach 240 cm'],
  [/\bPilar de hormigon para esquinas y encuentros entre tramos H80\b/gi, 'Concrete pillar for corners and joins between H80 sections'],
  [/\bPilar de hormigon para apoyo intermedio; tres piezas alcanzan 240 cm\b/gi, 'Concrete pillar for intermediate support; three pieces reach 240 cm'],
  [/\bPilar de hormigon para remates terminales; tres piezas alcanzan 240 cm\b/gi, 'Concrete pillar for terminal finishes; three pieces reach 240 cm'],
  [/\bPilar de hormigon para cerramientos; cuatro piezas alcanzan 240 cm\b/gi, 'Concrete pillar for enclosures; four pieces reach 240 cm'],
  [/\bPilar de hormigon compacto para apoyos bajos y delimitaciones temporales\b/gi, 'Compact concrete pillar for low supports and temporary boundaries'],
  [/\bpara muros de contencion de tierras y cargas exigentes\b/gi, 'for retaining walls and demanding loads'],
  [/\bpara contencion, cauces y montaje modular rapido\b/gi, 'for retention, channels, and rapid modular assembly'],
  [/\bpara contencion, cauces y montaje mecanico rapido\b/gi, 'for retention, channels, and fast mechanical assembly'],
  [/\bpara muros robustos y soluciones temporales o permanentes\b/gi, 'for robust walls and temporary or permanent solutions'],
  [/\bpara ajustes de longitud en muros modulares\b/gi, 'for length adjustments in modular walls'],
  [/\bpara refuerzo vertical; dos piezas alcanzan 240 cm\b/gi, 'for vertical reinforcement; two pieces reach 240 cm'],
  [/\bpara esquinas y encuentros entre tramos modulares\b/gi, 'for corners and joins between modular sections'],
  [/\bpara separadores de aridos, desechos y materiales a granel\b/gi, 'for separators of aggregates, waste, and bulk materials'],
  [/\bpara separaciones interiores de gran longitud en naves y patios industriales\b/gi, 'for long interior separations in warehouses and industrial yards'],
  [/\bpara separadores de materiales y cerramientos industriales ligeros\b/gi, 'for material separators and light industrial enclosures'],
  [/\bpara remates, arranques y cambios de modulacion\b/gi, 'for finishes, starts, and module changes'],
  [/\bpara apoyo intermedio; tres piezas alcanzan 240 cm\b/gi, 'for intermediate support; three pieces reach 240 cm'],
  [/\bpara remates terminales; tres piezas alcanzan 240 cm\b/gi, 'for terminal finishes; three pieces reach 240 cm'],
  [/\bpara vallas y cerramientos perimetrales sin contencion de tierras\b/gi, 'for fences and perimeter enclosures without soil retention'],
  [/\bpara cerramientos perimetrales desmontables y soluciones temporales\b/gi, 'for removable perimeter enclosures and temporary solutions'],
  [/\bpara vallas, delimitaciones y remates de cerramiento\b/gi, 'for fences, boundaries, and enclosure finishes'],
  [/\bpara ajustes de longitud en cerramientos perimetrales\b/gi, 'for length adjustments in perimeter enclosures'],
  [/\bpara cerramientos; cuatro piezas alcanzan 240 cm\b/gi, 'for enclosures; four pieces reach 240 cm'],
  [/\bcompacto para apoyos bajos y delimitaciones temporales\b/gi, 'compact for low supports and temporary boundaries']
];

const replaceText = (value, replacements) => {
  if (typeof value !== 'string') {
    return value;
  }

  return replacements.reduce((currentValue, [pattern, replacement]) => currentValue.replace(pattern, replacement), value);
};

export const getLocaleFromRequest = (req) => {
  const queryLocale = req?.query?.lang || req?.query?.locale;

  if (typeof queryLocale === 'string' && queryLocale.toLowerCase().startsWith('en')) {
    return 'en';
  }

  const acceptLanguage = req?.headers?.['accept-language'];
  if (typeof acceptLanguage === 'string' && /^en\b/i.test(acceptLanguage.trim())) {
    return 'en';
  }

  return DEFAULT_LOCALE;
};

const translateByLocale = (locale, dictionary, value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const stringValue = String(value);
  return dictionary[locale]?.[stringValue] || stringValue;
};

const translateProductName = (name, locale) => {
  if (locale !== 'en') {
    return name;
  }

  return replaceText(name, PRODUCT_NAME_REPLACEMENTS);
};

const translateProductDescription = (description, locale) => {
  if (locale !== 'en') {
    return description;
  }

  return replaceText(description, PRODUCT_DESCRIPTION_REPLACEMENTS);
};

export const localizeProduct = (product, locale) => {
  if (!product) {
    return product;
  }

  return {
    ...product,
    nombre: translateProductName(product.nombre, locale),
    descripcion: translateProductDescription(product.descripcion, locale),
    materialLabel: translateByLocale(locale, MATERIAL_LABELS, product.material),
    categoriaProveedorLabel: translateByLocale(locale, CATEGORY_LABELS, product.categoriaProveedor)
  };
};

export const localizePedido = (pedido, locale) => {
  if (!pedido) {
    return pedido;
  }

  return {
    ...pedido,
    estadoLabel: translateByLocale(locale, ORDER_STATUS_LABELS, pedido.estado),
    metodoPagoLabel: translateByLocale(locale, PAYMENT_LABELS, pedido.metodoPago)
  };
};

export const localizePedidos = (pedidos, locale) => pedidos.map((pedido) => localizePedido(pedido, locale));

export const getLocalizedMessage = (locale, messages) => messages[locale] || messages.es;
