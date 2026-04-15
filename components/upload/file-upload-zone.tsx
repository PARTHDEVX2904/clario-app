"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/format";

interface FileUploadZoneProps {
  label: string;
  description?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  file: File | undefined;
  onFileSelect: (file: File | undefined) => void;
  required?: boolean;
}

export function FileUploadZone({
  label,
  description,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  file,
  onFileSelect,
  required = false,
}: FileUploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        const msg = rejectedFiles[0]?.errors[0]?.message || "Invalid file";
        setError(msg);
        return;
      }
      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
  });

  // Separate the onClick from motion.div to avoid prop conflicts
  const rootProps = getRootProps();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(undefined);
            }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {file ? (
          <div
            key="file"
            className="flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4"
          >
            <div className="h-10 w-10 rounded-lg bg-white border border-accent-200 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-accent-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-accent-600 shrink-0" />
          </div>
        ) : (
          <div
            key="dropzone"
            {...rootProps}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-150",
              isDragActive
                ? "border-primary-400 bg-primary-50"
                : "border-border bg-background hover:border-primary-300 hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                isDragActive ? "bg-primary-100" : "bg-muted"
              )}
            >
              <Upload
                className={cn(
                  "h-5 w-5 transition-colors",
                  isDragActive ? "text-primary-600" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragActive ? "Drop file here" : "Upload or drag & drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {description || "PDF, JPG, or PNG · Max 10MB"}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
