'use client'
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "./api/uploadthing/core";
import Nav from "./components/Nav";
import Display from "./components/Display";

export default function Home() {
  // Assuming OurFileRouter has an 'imageUploader' endpoint
  const endpoint: keyof OurFileRouter = 'imageUploader';

  return (
    <>
      <Nav />
      <Display />
    </>
  );
}

