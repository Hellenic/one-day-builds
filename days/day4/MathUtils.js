export function round(number, decimals) {
  const factor = 10 ** decimals;
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

export function roundToStep(number, precision) {
  const step = `${precision}`;
  const decimals = step.substring(step.indexOf('.') + 1, step.length).length;
  return round(number, decimals);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getPercentBetween(value, min, max) {
  return ((value - min) * 100) / (max - min);
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export default {
  round,
  clamp,
  isNumeric
};
