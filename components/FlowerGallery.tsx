import Image from "next/image";

type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

/** Full-bleed mosaic: one column on small screens, 2-up and 3-up splits on larger breakpoints. */
const ITEMS: GalleryItem[] = [
  {
    src: "/references/flowers/IMG_3334.jpg",
    width: 5712,
    height: 4284,
    alt: "Bukiet w ciepłym świetle, Lulué",
  },
  {
    src: "/references/flowers/IMG_3308.jpg",
    width: 4032,
    height: 3024,
    alt: "Kompozycja kwiatów w stonowanych tonach",
  },
  {
    src: "/references/flowers/IMG_1665.jpg",
    width: 2268,
    height: 4032,
    alt: "Wysoki bukiet, kompozycja pionowa",
  },
  {
    src: "/references/flowers/seasonal-blooms.jpg",
    width: 3024,
    height: 4032,
    alt: "Kwiaty sezonowe",
  },
  {
    src: "/references/flowers/IMG_1758.jpg",
    width: 2268,
    height: 4032,
    alt: "Kwiatowy portret w układzie pionowym",
  },
  {
    src: "/references/flowers/IMG_8998.jpg",
    width: 2268,
    height: 4032,
    alt: "Kwiaty w wąskiej kompozycji kadru",
  },
];

function MosaicCell({ item, sizes, priority }: { item: GalleryItem; sizes: string; priority?: boolean }) {
  const ratio = item.width / item.height;

  return (
    <figure className="relative m-0 min-h-0 w-full overflow-hidden bg-zinc-900/30">
      <div className="relative w-full" style={{ aspectRatio: ratio }}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority === true}
        />
      </div>
    </figure>
  );
}

export function FlowerGallery() {
  const opener = ITEMS[0];
  const rest = ITEMS.slice(1);
  const pairRows: GalleryItem[][] = [];
  for (let i = 0; i < rest.length; i += 2) {
    pairRows.push(rest.slice(i, i + 2));
  }

  return (
    <section
      id="gallery"
      aria-label="Galeria kwiatów"
      className="w-full bg-zinc-200"
    >
      <div className="flex flex-col gap-px">
        <div className="w-full">
          <MosaicCell
            item={opener}
            sizes="100vw"
            priority
          />
        </div>

        {pairRows.map((pair, rowIndex) => (
          <div
            key={rowIndex}
            className={
              pair.length === 2
                ? "grid w-full grid-cols-1 gap-px md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
                : "grid w-full grid-cols-1 gap-px"
            }
          >
            <div className="min-w-0">
              <MosaicCell
                item={pair[0]}
                sizes={
                  pair.length === 2
                    ? "(max-width:768px) 100vw, (max-width:1024px) 70vw, 67vw"
                    : "100vw"
                }
              />
            </div>
            {pair[1] ? (
              <div className="min-w-0">
                <MosaicCell
                  item={pair[1]}
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 30vw, 33vw"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
