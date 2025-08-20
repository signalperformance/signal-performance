/**
 * Maps uppercase class names to their translation keys
 */
export const getTranslatedClassName = (className: string, t: (key: string) => string): string => {
  const classNameMap: Record<string, string> = {
    'MOBILITY': 'schedule.classes.mobility',
    'STRENGTH': 'schedule.classes.strength', 
    'CARDIO': 'schedule.classes.cardio',
    'POWER': 'schedule.classes.power',
    // Handle lowercase versions as well
    'mobility': 'schedule.classes.mobility',
    'strength': 'schedule.classes.strength',
    'cardio': 'schedule.classes.cardio', 
    'power': 'schedule.classes.power',
  };

  const translationKey = classNameMap[className];
  if (translationKey) {
    return t(translationKey);
  }

  // Fallback to original name if no translation found
  return className;
};