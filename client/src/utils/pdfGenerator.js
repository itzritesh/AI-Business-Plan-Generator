import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Captures an HTML container, renders it to canvas, and generates a multi-page PDF document.
 * Includes support for dark-mode toggle overrides so text remains legible on paper exports.
 * 
 * @param {string} elementId - ID of the container element
 * @param {string} filename - Output name for the downloaded PDF file
 * @param {object} options - Custom adjustments (e.g. orientation)
 */
export const exportToPDF = async (elementId, filename = 'document.pdf', options = {}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`PDF Export Error: Element with ID #${elementId} not found.`);
    return;
  }

  try {
    // Add temporary styling wrapper for printing (e.g. white background, dark text for legibility)
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Setup capture options
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution scaling
      useCORS: true,
      logging: false,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', // Match current theme look or default white
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Page dimensions
    const orientation = options.orientation || 'p'; // 'p' (portrait) or 'l' (landscape)
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scaling
    const imgWidth = pdfWidth;
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Page 1
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    // Loop through additional pages if document is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to compile PDF document:', error);
    throw error;
  }
};
