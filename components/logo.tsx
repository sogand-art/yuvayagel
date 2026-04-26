import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  height: number;
  width: number;
  className?: string;
};

export default function Logo({ height, width, className }: LogoProps) {
  return (
    <Link href="/">
      <Image
        src="/logo.png"
        alt="logo"
        height={height}
        width={width}
        className={className}
        priority
      />
    </Link>
  );
}
