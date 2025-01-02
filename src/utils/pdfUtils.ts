import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function convertToPdf(content: string, title?: string): Promise<Blob> {
  // Create temporary container
  const container = document.createElement('div');
  container.innerHTML = content;
  container.className = 'legal-document';
  container.style.padding = '40px';
  container.style.width = '8.5in';
  container.style.margin = '0 auto';
  document.body.appendChild(container);

  try {
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight
    });

    // Convert to PDF
    const pdf = new jsPDF({
      unit: 'pt',
      format: 'letter',
      orientation: 'portrait',
      compress: true
    });

    // Add title if provided
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, 40, 40);
      pdf.setFontSize(12);
    }

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const margin = 40;
    
    pdf.addImage(
      imgData, 'PNG',
      margin, title ? 60 : margin,
      imgWidth * ratio - (margin * 2),
      imgHeight * ratio - (margin * 2)
    );

    // Add page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 80, pdfHeight - 20);
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}