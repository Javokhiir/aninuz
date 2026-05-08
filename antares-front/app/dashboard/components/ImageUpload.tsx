"use client"

import React, { useRef } from "react"

interface ImageUploadProps {
  current?: string
  onChange: (file: File | null) => void
  onDelete?: () => void
  label?: string
}

export function ImageUpload({ current, onChange, onDelete, label = "Image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</label>
      <div className="flex items-start gap-3">
        <div
          className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 hover:border-blue-400 transition-colors flex-shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          {current ? (
            <img src={current} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs text-center px-2">Click to upload</span>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs px-3 py-1.5 border rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
          >
            {current ? "Change" : "Upload"}
          </button>
          {current && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs px-3 py-1.5 border rounded-lg text-red-500 border-red-200 hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          )}
          {current && (
            <button
              type="button"
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = "" }}
              className="text-xs px-3 py-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
