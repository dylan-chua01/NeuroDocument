"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PdfViewer({ url }: { url: string }) {
  return (
    <Document
      file={url}
      loading={
        <div className="flex items-center justify-center h-full">
          Loading PDF...
        </div>
      }
      error={
        <div className="flex items-center justify-center h-full text-rose-600">
          Failed to load PDF
        </div>
      }
    >
      <Page
        pageNumber={1}
        width={500}
        renderTextLayer={false}
        className="border rounded-md shadow-sm"
      />
    </Document>
  );
}