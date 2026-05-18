import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GalleryModal({
  stadiumName,
  images,
  activeImageIndex,
  activeImage,
  onPrevious,
  onNext,
  onSelect,
  onClose,
}) {
  return (
    <div className="modal-fade fixed inset-0 z-[80] bg-slate-950/90 px-4 py-5 text-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black">{stadiumName}</p>
            <p className="text-xs font-semibold text-white/60">{activeImageIndex + 1} / {images.length}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Close gallery">
            <X size={20} />
          </button>
        </div>
        <div className="modal-zoom relative mt-5 flex min-h-0 flex-1 items-center justify-center">
          {images.length > 1 && (
            <button type="button" onClick={onPrevious} className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
          )}
          <img className="max-h-full max-w-full rounded-lg object-contain" src={activeImage} alt={stadiumName} />
          {images.length > 1 && (
            <button type="button" onClick={onNext} className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Next image">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button key={img.id || img.image_path} type="button" onClick={() => onSelect(index)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 ${activeImageIndex === index ? 'border-secondary' : 'border-white/20'}`}>
              <img src={img.image_path} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
