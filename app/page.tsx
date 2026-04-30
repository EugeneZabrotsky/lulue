import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <Image
        src="/LULUE.png"
        alt="Lulué Flower Boutique"
        width={3277}
        height={2185}
        className="h-auto w-full max-w-3xl"
        priority
      />
    </div>
  );
}
