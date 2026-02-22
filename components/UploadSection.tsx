'use client';

import { useRef } from 'react';

interface UploadSectionProps {
  onPhotoSelect: (file: File) => void;
  onPhotoClear: () => void;
  selectedPhoto: File | null;
  isDetecting: boolean;
  error: string | null;
}

export function UploadSection({
  onPhotoSelect,
  onPhotoClear,
  selectedPhoto,
  isDetecting,
  error,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onPhotoClear();
        return;
      }
      onPhotoSelect(file);
    }
    e.target.value = '';
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-stone-800">1. Upload your pantry</h2>
      <p className="mb-4 text-sm text-stone-500">
        Upload a <strong>photo</strong> of your ingredients (required). Video support is coming soon.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isDetecting}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-emerald-400 hover:bg-emerald-50/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {selectedPhoto ? 'Change photo' : 'Choose photo'}
        </label>
        {selectedPhoto && (
          <>
            <span className="text-sm text-stone-600">{selectedPhoto.name}</span>
            <button
              type="button"
              onClick={onPhotoClear}
              disabled={isDetecting}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {/* Video stub */}
      <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Video upload: coming soon. For now, use a photo.
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {isDetecting && (
        <p className="mt-3 text-sm text-emerald-700">Detecting ingredients…</p>
      )}
    </section>
  );
}
