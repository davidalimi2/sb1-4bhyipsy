```typescript
// Legal document styles in CSS
export const legalStyles = `
  .legal-document {
    font-family: 'Times New Roman', Times, serif;
    line-height: 2;
    margin: 1.5in 1in;
  }

  .legal-document h1 {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    margin-bottom: 24pt;
  }

  .legal-document h2 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 12pt;
  }

  .legal-document p {
    text-indent: 0.5in;
    margin: 12pt 0;
  }

  .legal-document .signature-line {
    margin-top: 2in;
    border-top: 1px solid #000;
    width: 4in;
  }

  .legal-document .signature-name {
    margin-top: 0.25in;
    font-weight: bold;
  }

  .legal-document .page-number {
    position: absolute;
    bottom: 0.5in;
    right: 0.5in;
    font-size: 12pt;
  }

  .legal-document table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
  }

  .legal-document th,
  .legal-document td {
    border: 1px solid #000;
    padding: 6pt;
    text-align: left;
  }
`;
```