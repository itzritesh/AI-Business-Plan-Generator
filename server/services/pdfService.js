/**
 * Server-side PDF export metadata service.
 * Primary high-fidelity layout generation runs on the client-side (using jsPDF + html2canvas)
 * to maintain typography, styles, and SVG charts without backend canvas rendering limitations.
 */

export const getExportMetadata = (planId, type) => {
  return {
    planId,
    type,
    exportTimestamp: new Date(),
    status: 'Ready',
    clientLibrary: 'jsPDF + html2canvas',
    supportPaperSize: 'A4',
    orientation: type === 'pitch' ? 'landscape' : 'portrait',
  };
};
