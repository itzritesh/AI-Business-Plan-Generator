import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { exportToPDF } from '../utils/pdfGenerator.js';

const PDFButton = ({ elementId, filename = 'document.pdf', label = 'Export to PDF', orientation = 'p' }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF(elementId, filename, { orientation });
    } catch (err) {
      alert('An error occurred during compilation. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      type="button"
      className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-sm"
    >
      {exporting ? (
        <>
          <div className="w-3.5 h-3.5 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          Compiling PDF...
        </>
      ) : (
        <>
          <FiDownload className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </button>
  );
};

export default PDFButton;
