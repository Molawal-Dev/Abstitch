"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface ImageUploaderProps {
  onAdd: (url: string) => void;
  compact?: boolean;
  multiple?: boolean;
}

export default function ImageUploader({ onAdd, compact = false, multiple = true }: ImageUploaderProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const invalid = files.find((f) => !f.type.startsWith("image/"));
      if (invalid) { setError("Please select image files only."); return; }
      const tooBig = files.find((f) => f.size > 5 * 1024 * 1024);
      if (tooBig) { setError(`"${tooBig.name}" exceeds the 5MB limit.`); return; }

      setUploading(true);
      setError(null);

      try {
        await Promise.all(
          files.map(async (file) => {
            const ext = file.name.split(".").pop();
            const filename = `products/${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(filename, file, { upsert: false });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from("product-images")
              .getPublicUrl(filename);

            onAdd(data.publicUrl);
          })
        );
      } catch (err) {
        setError("Upload failed. Make sure the 'product-images' storage bucket exists in Supabase.");
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [onAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) uploadFiles(files);
    },
    [uploadFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) uploadFiles(files);
    e.target.value = "";
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onAdd(url);
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-0 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors
            ${tab === "upload" ? "bg-white shadow text-burgundy-800" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Upload size={12} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors
            ${tab === "url" ? "bg-white shadow text-burgundy-800" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Link size={12} />
          URL
        </button>
      </div>

      {tab === "upload" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${compact ? "p-4" : "p-6"}
            ${dragging
              ? "border-burgundy-800 bg-burgundy-50"
              : "border-gray-300 hover:border-burgundy-400 hover:bg-gray-50"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-burgundy-800 border-t-transparent rounded-full animate-spin" />
                <p className="font-sans text-xs text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon size={compact ? 20 : 28} className="text-gray-400" />
                <div>
                  <p className="font-sans text-xs font-medium text-gray-600">
                    {dragging ? "Drop to upload" : "Click or drag & drop"}
                  </p>
                  {!compact && (
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5">
                      PNG, JPG, WebP up to 5MB each · select multiple
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "url" && (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="input-field flex-1 text-sm py-2"
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="btn-primary py-2 px-4 text-sm"
          >
            Add
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <X size={12} />
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}