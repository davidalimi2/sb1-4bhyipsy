import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function convertHtmlToWord(html: string): Promise<Blob> {
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  container.className = 'legal-document';
  document.body.appendChild(container);

  try {
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Convert to PDF first
    const pdf = new jsPDF({
      unit: 'pt',
      format: 'letter'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    pdf.addImage(
      imgData, 'PNG',
      0, 0,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // Return as PDF blob since Word conversion isn't available in browser
    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export async function extractTextContent(file: File): Promise<string | undefined> {
  if (file.type === 'text/plain') {
    return await file.text();
  }
  
  if (file.type === 'application/pdf') {
    // Use PDF.js for PDF text extraction
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text;
  }

  return undefined;
}