import React, { useState, useEffect } from 'react';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from '../api/uploadthing/core';
import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';
import { PDFDocument } from "pdf-lib";

const Display = () => {
  const imageEndpoint: keyof OurFileRouter = 'imageUploader';
  const pdfEndPoint: keyof OurFileRouter = 'pdfUploader';

  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [signature, setSignature] = useState('');
  const [uploadResponse, setUploadResponse] = useState<any | null>(null);

  useEffect(() => {
    if (isUploaded && signature && uploadResponse) {
      createPdf(uploadResponse[0].url, signature);
    }
  }, [isUploaded, signature, uploadResponse]);

  const handleClear = () => {
    if (signatureCanvasRef.current != null) {
      signatureCanvasRef.current.clear();
    }
  };

  const saveSignature = () => {
    if(signatureCanvasRef.current){
      const signatureDataUrl = signatureCanvasRef
        .current
        .getTrimmedCanvas()
        .toDataURL('image/png');
      setSignature(signatureDataUrl);
    }
  };


  async function loadPdfFromUrl(pdfUrl: string): Promise<Uint8Array> {
    try {
      const response = await fetch(pdfUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
  
      const pdfBytes = await response.arrayBuffer();
      return new Uint8Array(pdfBytes);
    } catch (error) {
      console.error('Error loading PDF from URL:', error);
      throw error;
    }
  }
  
  const createPdf = async (pdfUrl: string, signature: string) => {
    try {
      if (!signature) {
        console.log('empty signature');
        return;
      }
  
      const pdfBytes = await loadPdfFromUrl(pdfUrl);
      const existingPdfDoc = await PDFDocument.load(pdfBytes);
      
      // Get the existing last page of the PDF
      const existingPages = existingPdfDoc.getPages();
      const lastPage = existingPages[existingPages.length - 1];
  
      // Embed the signature at the bottom of the existing last page
      const signatureImage = await existingPdfDoc.embedPng(signature);
      lastPage.drawImage(signatureImage, {
        height: 100, // Adjust the signature height as needed
        width: 100,  // Adjust the signature width as needed
        x: (lastPage.getWidth() - 100) / 2, // Adjust the x-position as needed
        y: 30, // Adjust the y-position as needed
      });
  
      // Save the modified PDF bytes
      const modifiedPdfBytes = await existingPdfDoc.save();
  
      // Optionally, return the modified PDF bytes or other relevant information
      setPdfBytes(modifiedPdfBytes);
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw error;
    }
  };  
  

  const handleDownloadPdf = async () => {
    try {
      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'modified_pdf.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error handling download:', error);
    }
  };  

  return (
    <div>
      <UploadButton<OurFileRouter, typeof pdfEndPoint>
        endpoint={pdfEndPoint}
        onClientUploadComplete={(res) => {
          if (res) {
            setIsUploaded(true);
            setUploadResponse(res);
            console.log(res[0].url);
          }
        }}
        onUploadError={(error) => console.error(error)}
      />

      {isUploaded && (
        <div
          style={{ border: '2px solid black', backgroundColor: 'white' }}
        >
          <SignatureCanvas
            penColor='black'
            canvasProps={{ width: 800, height: 200, className: 'sigCanvas' }}
            ref={signatureCanvasRef}
          />
        </div>
      )}
      <div>
        {isUploaded && (
          <div
            className='subbtns w-full flex items-center justify-center'
          >
            <button
              id='button-6'
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              id='button-6'
              onClick={saveSignature}
            >
              Save
            </button>
            <button
              id='button-6'
              onClick={handleDownloadPdf} disabled={!pdfBytes}
            >
              Get Signed PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
