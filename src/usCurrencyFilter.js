/**
 * this was built to be used as vue filter
 * example use case as filter in a vue template including decimals: {{ 1234546.12 | formatCurrency() }}
 *
 * example use case as filter in a vue template excluding decimlas: {{ 1234546.12 | formatCurrency(/* ignoreDecimal*\/ true)}}
 */
// regex adds commas every 3 digit
export default (num, ignoreDecimal = false, forceFormatting = false) => {
  if (num === null) {
    return null
  }
  let n = String(num)
  if (n === '.') {
    n = '0.'
  }
  let decimalCount = getDecimals(n)
  let numb = Number(n)
  let tmpVal = numb.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  if (!forceFormatting && (ignoreDecimal || decimalCount === -1)) {
    tmpVal = tmpVal.slice(0, -3)
  } else if (!forceFormatting && decimalCount < 3) {
    tmpVal = tmpVal.slice(0, -3 + decimalCount)
  }
  return tmpVal.slice(0, 1) + ' ' + tmpVal.slice(1, tmpVal.length)
}

function getDecimals (strNum) {
  let firstDecimalIndex = strNum.indexOf('.')
  if (firstDecimalIndex === -1) {
    return -1
  }
  return strNum.substring(firstDecimalIndex, strNum.length).length
}
