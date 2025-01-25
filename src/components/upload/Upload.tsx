"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type FileWithPreview = File & {
  preview: string;
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function Upload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const newTotalSize = [...newFiles].reduce(
        (acc, file) => acc + file.size,
        0
      );

      if (newTotalSize > MAX_FILE_SIZE) {
        alert("총 파일 크기가 100MB를 초과했습니다.");
        return;
      }

      setFiles([...newFiles]);
      setTotalSize(newTotalSize);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
        formData.append(
          "lastModifiedTimestamps[]",
          file.lastModified.toString()
        );
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/uploads`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("파일 업로드에 실패했습니다");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("업로드 성공:", data);
      setFiles([]);
    },
    onError: (error) => {
      console.error("업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    },
  });

  const handleUpload = () => {
    if (files.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }
    uploadMutation.mutate(files);
  };

  const thumbs = files.map((file) => (
    <div
      className="flex justify-center rounded border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border"
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
          width={96}
          height={96}
        />
      </div>
    </div>
  ));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const megabytes = bytes / (1024 * 1024);
    return `${megabytes.toFixed(1)} MB`;
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Card className={"border-zinc-200 p-6 dark:border-zinc-800 w-full"}>
      <div className="flex items-center">
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
      <div className="flex justify-end items-center space-x-2">
        <span className="text-sm text-gray-600">
          {formatFileSize(totalSize)} / {formatFileSize(MAX_FILE_SIZE)}
        </span>
        <Button
          onClick={handleUpload}
          disabled={
            uploadMutation.isPending ||
            files.length === 0 ||
            totalSize > MAX_FILE_SIZE
          }
          className="w-32"
        >
          {uploadMutation.isPending ? "업로드 중..." : "업로드"}
        </Button>
      </div>
    </Card>
  );
}
