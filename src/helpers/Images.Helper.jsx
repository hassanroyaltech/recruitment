export const ConvertSVGToBase64 = (svg) => {
  const serializing = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${window.btoa(serializing)}`;
};
