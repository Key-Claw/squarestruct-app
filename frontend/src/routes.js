export const MAIN_ROUTES = {
  root: '/',
  home: '/home',
  gallery: '/gallery',
  catalog: '/catalog',
  design: '/design',
  aboutus: '/about-us',
}

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
}
