import Image from "next/image";

/* eslint-disable @next/next/no-img-element */
export default function RightSideDesign() {
  return (
    <div className="hidden md:block flex-1 relative overflow-hidden bg-[#37357f]">
      <img
        src="/rightImage.png"
        alt="Company"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(55,53,127,0.68),rgba(167,29,24,0.28))]" />
      <div className="absolute bottom-10 left-10 right-10 rounded-[2rem] border-4 border-[#fff4c7]/70 bg-[#171717]/45 p-8 text-white">
        <div className="mb-5 flex items-center -space-x-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#fff4c7] bg-[#fff9df] p-1">
            <Image
              src="/logo.png"
              alt="Z Piekla Do Domu partner logo"
              width={54}
              height={54}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#79c617] bg-white p-1">
            <Image
              src="/logo2.png"
              alt="Leben in Not e.V. partner logo"
              width={54}
              height={54}
              className="h-full w-full object-contain"
            />
          </span>
        </div>
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#79c617]">
          Partner adoption network
        </p>
        <p className="mt-3 text-3xl font-extrabold leading-tight">
          One shared workspace for pets moving from shelter to home.
        </p>
      </div>
    </div>
  );
}
