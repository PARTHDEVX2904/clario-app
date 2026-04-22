"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
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
  maxSize = 10 * 1024 * 1024,
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

  const rootProps = getRootProps();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(undefined);
            }}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"
          >
            <div className="h-10 w-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(file.size)}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
          <div
            {...rootProps}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-[#2F2FE4] bg-[#2F2FE4]/5 scale-[1.01]"
                : "border-slate-200 bg-slate-50/40 hover:border-[#2F2FE4]/40 hover:bg-[#2F2FE4]/3"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200",
                isDragActive
                  ? "bg-[#2F2FE4]/15 scale-110"
                  : "bg-gradient-to-br from-[#2F2FE4]/10 to-blue-50"
              )}
            >
              <Upload
                className={cn(
                  "h-5 w-5 transition-colors",
                  isDragActive ? "text-[#2F2FE4]" : "text-[#2F2FE4]/60"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isDragActive ? "Drop your file here" : "Upload or drag & drop"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {description || "PDF, JPG, or PNG · Max 10MB"}
              </p>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
