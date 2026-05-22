const LANGUAGE_PREFIX_EN = 'en'

const translateText = (value, replacements) => replacements.reduce(
  (currentValue, [pattern, replacement]) => currentValue.replace(pattern, replacement),
  value
)

const SPANISH_TO_ENGLISH = [
  [/^Bloque Eco\b/i, 'Eco Block'],
  [/^Pilar Eco\b/i, 'Eco Pillar'],
  [/^Bloque\b/i, 'Block'],
  [/^Pilar\b/i, 'Pillar'],
  [/\bRefuerzo\b/gi, 'Reinforcement'],
  [/\bEsquina\b/gi, 'Corner'],
  [/\bCerramiento\b/gi, 'Enclosure'],
  [/\bLigero\b/gi, 'Lightweight'],
  [/\bAjuste\b/gi, 'Adjustment'],
  [/\bEstructural\b/gi, 'Structural'],
  [/\bEnlace\b/gi, 'Link'],
  [/\bPlano\b/gi, 'Flat'],
  [/\bBase\b/gi, 'Base'],
  [/\bLargo\b/gi, 'Long'],
  [/\bMedio\b/gi, 'Medium'],
  [/\bCubo\b/gi, 'Cube']
]

const ENGLISH_TO_SPANISH = [
  [/^EcoBase Block\b/i, 'Bloque Eco Base'],
  [/^EcoFlat Block\b/i, 'Bloque Eco Plano'],
  [/^EcoLink Block\b/i, 'Bloque Eco Enlace'],
  [/^EcoStruct Column 120\b/i, 'Pilar Eco Estructural 120'],
  [/^EcoStruct Column 180\b/i, 'Pilar Eco Estructural 180'],
  [/^EcoCorner Column\b/i, 'Pilar Eco Esquina'],
  [/^H80 Max Block\b/i, 'Bloque H80 Max'],
  [/^H80 Reinforcement Pillar\b/i, 'Pilar H80 Refuerzo'],
  [/^H60 Max Block\b/i, 'Bloque H60 Max'],
  [/^H60 Modular Pillar\b/i, 'Pilar H60 Modular'],
  [/^H40 Enclosure Block\b/i, 'Bloque H40 Cerramiento'],
  [/^H40 Enclosure Pillar\b/i, 'Pilar H40 Cerramiento'],
  [/^Eco Block\b/i, 'Bloque Eco'],
  [/^Eco Pillar\b/i, 'Pilar Eco'],
  [/\bReinforcement\b/gi, 'Refuerzo'],
  [/\bCorner\b/gi, 'Esquina'],
  [/\bEnclosure\b/gi, 'Cerramiento'],
  [/\bLightweight\b/gi, 'Ligero'],
  [/\bAdjustment\b/gi, 'Ajuste'],
  [/\bStructural\b/gi, 'Estructural'],
  [/\bLink\b/gi, 'Enlace'],
  [/\bFlat\b/gi, 'Plano'],
  [/\bBase\b/gi, 'Base'],
  [/\bLong\b/gi, 'Largo'],
  [/\bMedium\b/gi, 'Medio'],
  [/\bCube\b/gi, 'Cubo'],
  [/\bColumn\b/gi, 'Pilar'],
  [/\bBlock\b/gi, 'Bloque'],
  [/\bPillar\b/gi, 'Pilar']
]

const normalizeLanguage = (language) => String(language || '').toLowerCase()

export const getCatalogDisplayName = (name, language) => {
  if (typeof name !== 'string' || !name.trim()) {
    return ''
  }

  const normalizedLanguage = normalizeLanguage(language)
  const replacements = normalizedLanguage.startsWith(LANGUAGE_PREFIX_EN)
    ? SPANISH_TO_ENGLISH
    : ENGLISH_TO_SPANISH

  return translateText(name, replacements)
}
