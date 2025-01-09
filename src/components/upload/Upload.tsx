"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function Upload() {
  const [files, setFiles] = useState<Array<{ name: string; preview: string }>>(
    []
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div
      className="inline-flex rounded border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border"
      key={file.name}
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="block w-auto h-full"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt={file.name}
          width={96} // Define width and height to prevent layout shift
          height={96}
        />
      </div>
    </div>
  ));

  // Prevent hydration error: execute on the client side only
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Card className={"border-zinc-200 p-6 dark:border-zinc-800 w-full"}>
      <div className="flex items-center gap-3">
        <section className="container mx-auto p-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
            </p>
          </div>
          <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
        </section>
      </div>
    </Card>
  );
}
