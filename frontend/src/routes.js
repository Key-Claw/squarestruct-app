export const MAIN_ROUTES = {
  root: '/',
  home: '/home',
  gallery: '/gallery',
  catalog: '/catalog',
  design: '/design',
  aboutus: '/about-us',
  settings: '/setings',
  settingsAlias: '/settings',
}

export const SETTINGS_TAB_TO_SECTION = {
  perfil: 'profile',
  facturas: 'invoices',
  facturacion: 'billing',
  usuarios: 'users',
  planos: 'plans',
}

export const SETTINGS_SECTION_TO_TAB = {
  profile: 'perfil',
  invoices: 'facturas',
  billing: 'facturacion',
  users: 'usuarios',
  plans: 'planos',
}

export const getSettingsRoute = (tab = 'perfil') => (
  `${MAIN_ROUTES.settings}/${SETTINGS_TAB_TO_SECTION[tab] || SETTINGS_TAB_TO_SECTION.perfil}`
)

export const NAV_LINKS = [
  { id: 'gallery', label: 'Galería', icon: 'image', path: MAIN_ROUTES.gallery },
  { id: 'catalog', label: 'Catálogo', icon: 'cube', path: MAIN_ROUTES.catalog },
  { id: 'design', label: 'Diseñador', icon: 'penTool', path: MAIN_ROUTES.design },
]

export const PAGE_BY_PATH = {
  [MAIN_ROUTES.root]: 'home',
  [MAIN_ROUTES.home]: 'home',
  [MAIN_ROUTES.gallery]: 'gallery',
  [MAIN_ROUTES.catalog]: 'catalog',
  [MAIN_ROUTES.design]: 'design',
  [MAIN_ROUTES.aboutus]: 'aboutus',
  [MAIN_ROUTES.settings]: 'settings',
  [MAIN_ROUTES.settingsAlias]: 'settings',
}
