/* eslint-disable no-bitwise */
// noinspection JSCheckFunctionSignatures

export const RGBAToHexA = ({ r, g, b, a }) => {
  let localR = r.toString(16);
  let localG = g.toString(16);
  let localB = b.toString(16);
  let localA = Math.round(a * 255).toString(16);

  if (localR.length === 1) localR = `0${localR}`;
  if (localG.length === 1) localG = `0${localG}`;
  if (localB.length === 1) localB = `0${localB}`;
  if (localA.length === 1) localA = `0${localA}`;

  return `#${localR}${localG}${localB}${localA}`;
};

/**
 * @param str
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to convert string to color
 */
export const StringToColor = (str) => {
  let hash = 0;
  let i;

  for (i = 0; i < (str || '').length; i += 1)
    hash = (str || '').charCodeAt(i) + ((hash << 5) - hash);
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
};
