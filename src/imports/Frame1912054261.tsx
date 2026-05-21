import svgPaths from "./svg-ghoawyufda";
import imgReflectionComponent from "figma:asset/23ba928371385f05d2596d28574ae1b0ff2726c3.png";
import imgReflectionComponent1 from "figma:asset/74d0697514bad9978e8c7782df5125fed444578b.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #8B7355)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2fe1fe40} id="Vector_2" stroke="var(--stroke-0, #8B7355)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p25c2200} id="Vector_3" stroke="var(--stroke-0, #8B7355)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#8b7355] text-[14px] tracking-[-0.1504px] whitespace-nowrap">Research Question Name</p>
    </div>
  );
}

function ReflectionComponent() {
  return (
    <div className="flex-[1_0_0] h-[618px] min-h-px min-w-px opacity-75 relative rounded-[10px]" data-name="ReflectionComponent">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgReflectionComponent} />
    </div>
  );
}

function ReflectionComponent1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px opacity-75 relative rounded-[10px]" data-name="ReflectionComponent">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgReflectionComponent1} />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[2px] h-[618px] items-center justify-center relative shrink-0 w-full">
      <ReflectionComponent />
      <ReflectionComponent1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#faf8f3] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[712px]">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[12px] px-[24px] relative size-full">
        <Frame2 />
        <Frame3 />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col items-end relative size-full">
      <Frame1 />
    </div>
  );
}