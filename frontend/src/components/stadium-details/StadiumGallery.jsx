import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

export default function StadiumGallery({
  stadiumName,
  images,
  activeImageIndex,
  activeImage,
  onPrevious,
  onNext,
  onOpen,
  onSelect,
}) {
  return (
    <>
      <div className="relative overflow-hidden rounded-lg shadow-soft">
        <button type="button" onClick={onOpen} className="block w-full">
          <img className="h-[330px] w-full object-cover" src={activeImage} alt={stadiumName} />
        </button>
        {images.length > 1 && (
          <>
            <button type="button" onClick={onPrevious} className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-soft" aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={onNext} className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-soft" aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <button type="button" onClick={onOpen} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black text-slate-900 shadow-soft">
          <Images size={15} /> View all photos ({images.length})
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {images.map((img, index) => (
          <button key={img.id || img.image_path} type="button" onClick={() => onSelect(index)} className={`overflow-hidden rounded-md border-2 bg-white shadow-sm transition ${activeImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-white hover:border-primary/50'}`}>
            <img className="h-20 w-full object-cover" src={img.image_path} alt={`${stadiumName} ${index + 1}`} />
          </button>
        ))}
      </div>
    </>
  );
}
