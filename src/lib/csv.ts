/** Las comillas de CSV delimitan campos, pero no desactivan fórmulas en hojas de cálculo. */
export function inventoryCsvCell(value: string): string {
  const text = /^(?:[\t\r\n]|\s*[=+\-@＝＋－＠])/u.test(value) ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}
