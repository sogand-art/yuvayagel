/* eslint-disable @next/next/no-img-element */
export default function RightSideDesign() {
  return (
    <div className="hidden md:block flex-1 relative overflow-hidden">
      <img
        src="/rightImage.png"
        alt="Company"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
