import { Image, UploadCloud, X } from 'lucide-react';

export default function StadiumImagePicker({ existingImages, imagePreviews, selectedMainIndex, onImagesChange, onClear, onMainImageChange }) {
  return (
    <div className="md:col-span-3">
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center transition hover:border-primary hover:bg-primary/5">
        <UploadCloud className="mb-2 text-primary" size={28} />
        <span className="text-sm font-black text-slate-900">Upload stadium images</span>
        <span className="mt-1 text-xs font-semibold text-slate-500">JPG, PNG or WEBP. Max 5MB per image.</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onImagesChange}
        />
      </label>

      {existingImages.length > 0 && imagePreviews.length === 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Current gallery</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {existingImages.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img src={item.image_path} alt="" className="h-28 w-full object-cover" />
                <div className="flex items-center justify-between p-3 text-xs font-bold text-slate-600">
                  <span>{item.is_main ? 'Main image' : 'Gallery image'}</span>
                  <Image size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {imagePreviews.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">New gallery</p>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <X size={13} /> Clear
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <button
                key={`${preview.name}-${index}`}
                type="button"
                onClick={() => onMainImageChange(index)}
                className={`overflow-hidden rounded-2xl border bg-white text-left transition ${selectedMainIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
              >
                <img src={preview.url} alt="" className="h-28 w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-xs font-black text-slate-900">{preview.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{selectedMainIndex === index ? 'Main image' : 'Click to make main'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
