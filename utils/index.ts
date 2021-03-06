/* eslint-disable import/prefer-default-export */
export const simpleDate = (d: Date) =>
  new Date(d)
    .toDateString()
    .split(' ')
    .filter((_, i) => i % 2)
    .join(' ')
