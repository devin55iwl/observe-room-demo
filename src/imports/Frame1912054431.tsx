import svgPaths from "./svg-rxedoyx6i8";
import imgContainer from "figma:asset/4c1a2e03e0e0eb3eda73c77246235488e8badc64.png";
import imgInterviewee from "figma:asset/fdfe4d4ec69588be4e5ebc1e39caabfe5a924d01.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_160_118)" id="Icon">
          <path d={svgPaths.p2d09d900} id="Vector" stroke="var(--stroke-0, #27272A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_160_118">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px opacity-90 relative" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#1d293d] text-[14px] top-[0.5px] tracking-[0.1996px] uppercase">Emotion Analysis</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[94.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon />
        <Heading />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[48px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f5f5f5] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function Interviewee() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-90 relative w-full" data-name="Interviewee">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInterviewee} />
    </div>
  );
}

function Container3() {
  return (
    <div className="aspect-[576/384] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgContainer} />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Interviewee />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container6() {
  return <div className="bg-[#9f9fa9] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[86.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Thoughtful</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container6 />
        <Text />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:02 AM</p>
      </div>
    </div>
  );
}

function Container9() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container8() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[5.766px] relative rounded-[inherit] size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text1 />
        <Container8 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container5 />
        <Container7 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Interviewee1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-90 relative w-full" data-name="Interviewee">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInterviewee} />
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#f4f4f5] h-[120px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Interviewee1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container14() {
  return <div className="bg-[#fe9a00] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[70.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Surprised</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container14 />
        <Text2 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:05 AM</p>
      </div>
    </div>
  );
}

function Container17() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container16() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[3.844px] relative rounded-[inherit] size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text3 />
        <Container16 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container13 />
        <Container15 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container11 />
        <Container12 />
      </div>
    </div>
  );
}

function Interviewee2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-90 relative w-full" data-name="Interviewee">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInterviewee} />
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#f4f4f5] h-[120px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Interviewee2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container22() {
  return <div className="bg-[#00bc7d] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[42.258px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Happy</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container22 />
        <Text4 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:12 AM</p>
      </div>
    </div>
  );
}

function Container25() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container24() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[2.406px] relative rounded-[inherit] size-full">
        <Container25 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text5 />
        <Container24 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container21 />
        <Container23 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function Interviewee3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-90 relative w-full" data-name="Interviewee">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInterviewee} />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-[#f4f4f5] h-[120px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Interviewee3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container30() {
  return <div className="bg-[#d4d4d8] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[60.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Engaged</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container30 />
        <Text6 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:15 AM</p>
      </div>
    </div>
  );
}

function Container33() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container32() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[10.563px] relative rounded-[inherit] size-full">
        <Container33 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text7 />
        <Container32 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container29 />
        <Container31 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function ImageConfused() {
  return <div className="h-[118px] shrink-0 w-full" data-name="Image (Confused)" />;
}

function Container35() {
  return (
    <div className="bg-[#f4f4f5] h-[120px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <ImageConfused />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container38() {
  return <div className="bg-[#ff2056] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[69.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Confused</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container38 />
        <Text8 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:18 AM</p>
      </div>
    </div>
  );
}

function Container41() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container40() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[16.805px] relative rounded-[inherit] size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text9 />
        <Container40 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container37 />
        <Container39 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function ImageNeutral() {
  return <div className="h-[118px] shrink-0 w-full" data-name="Image (Neutral)" />;
}

function Container43() {
  return (
    <div className="bg-[#f4f4f5] h-[120px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <ImageNeutral />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container46() {
  return <div className="bg-[#d4d4d8] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[58.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#37352f] text-[12px] top-px tracking-[0.3px] uppercase">Neutral</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container46 />
        <Text10 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[15px] relative shrink-0 w-[48.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#9f9fa9] text-[10px] top-[0.5px]">10:22 AM</p>
      </div>
    </div>
  );
}

function Container49() {
  return <div className="bg-[#d4d4d8] h-[2px] shrink-0 w-full" data-name="Container" />;
}

function Container48() {
  return (
    <div className="bg-[#f4f4f5] h-[2px] relative rounded-[16777200px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[4.805px] relative rounded-[inherit] size-full">
        <Container49 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[15px] relative shrink-0 w-[172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text11 />
        <Container48 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[37px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[6px] items-start pl-[4px] relative size-full">
        <Container45 />
        <Container47 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[169px] relative shrink-0 w-[180px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container43 />
        <Container44 />
      </div>
    </div>
  );
}

function MainPanel1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="MainPanel">
      <Container2 />
      <Container10 />
      <Container18 />
      <Container26 />
      <Container34 />
      <Container42 />
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col h-[155px] items-start overflow-clip relative shrink-0 w-full" data-name="Primitive.div">
      <MainPanel1 />
    </div>
  );
}

function MainPanel() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[169px] items-center overflow-clip relative shrink-0 w-full" data-name="MainPanel">
      <PrimitiveDiv />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center px-[24px] relative size-full">
      <Container />
      <MainPanel />
    </div>
  );
}