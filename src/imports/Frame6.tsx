import imgFrame6 from "figma:asset/729153d5bf86f6d16ce58d892b000b6b49d044ce.png";

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[32px] items-start pb-[39px] pr-[75px] pt-[54px] relative size-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame6} />
      <div className="absolute h-[225px] left-[19px] top-[476px] w-[329px]">
        <div aria-hidden="true" className="absolute border-37 border-[red] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="absolute h-[769px] left-[348px] top-[32px] w-[1085px]">
        <div aria-hidden="true" className="absolute border-37 border-[red] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}