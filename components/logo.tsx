import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  height: number;
  width: number;
  className?: string;
};

export default function Logo({ height, width, className }: LogoProps) {
  const logoSize = Math.max(40, Math.round(Math.min(height, width) * 0.7));

  return (
    <Link
      href="/"
      className={`inline-flex items-center justify-center -space-x-4 ${className || ""}`}
      aria-label="Yuvaya Gel partner adoption network"
    >
      <span
        className="flex items-center justify-center rounded-full border-4 border-[#a71d18] bg-[#fff9df] p-2 shadow-md"
        style={{ width, height }}
      >
        <Image
          src="/logo.png"
          alt="Z Piekla Do Domu partner logo"
          height={logoSize}
          width={logoSize}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span
        className="flex items-center justify-center rounded-full border-4 border-[#79c617] bg-white p-2 shadow-md"
        style={{ width, height }}
      >
        <Image
          src="/logo2.png"
          alt="Leben in Not e.V. partner logo"
          height={logoSize}
          width={logoSize}
          className="h-full w-full object-contain"
          priority
        />
      </span>
    </Link>
  );
}
