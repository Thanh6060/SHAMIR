export function interpolateReal(
  points: { x: number; y: number }[],
  x: number,
): number {
  let total = 0;
  const k = points.length;
  for (let i = 0; i < k; i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    let term = yi;
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        const xj = points[j].x;
        if (xi - xj !== 0) {
          term *= (x - xj) / (xi - xj);
        }
      }
    }
    total += term;
  }
  return total;
}
