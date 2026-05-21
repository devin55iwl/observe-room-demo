import svgPaths from "./svg-xosdrpp9j6";

function GripVertical() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="GripVertical">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="GripVertical">
          <path d={svgPaths.p1dbab00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
          <path d={svgPaths.p27bf1200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
          <path d={svgPaths.p34bc5b00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
          <path d={svgPaths.p2147bc80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
          <path d={svgPaths.p6c1fe00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
          <path d={svgPaths.p22c70600} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_20.83%_12.5%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 4.66667">
            <path d={svgPaths.p33a64600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_33.33%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 5.83333">
            <path d={svgPaths.p24f65af0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Span() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="flex-[1_0_0] h-[22.5px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[15px] text-[rgba(255,255,255,0.8)] top-[-0.5px] tracking-[-0.2344px] whitespace-nowrap">Persona</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[96.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <GripVertical />
        <Span />
        <Span1 />
      </div>
    </div>
  );
}

function X() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="X">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
            <path d={svgPaths.p755a300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.14" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
            <path d={svgPaths.p4618fa0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.14" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="flex-[1_0_0] h-[26px] min-h-px min-w-px relative rounded-[14px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] px-[6px] relative size-full">
        <X />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 size-[26px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex h-[50.5px] items-center justify-between left-0 pb-[0.5px] px-[16px] top-0 w-[353px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.06)] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] not-italic relative shrink-0 text-[15px] text-[rgba(255,255,255,0.8)] tracking-[-0.2344px] w-[262px]">25-27 years old, 3+ years B2B experience, mid-level product / UX role in SaaS</p>
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="h-[13px] overflow-clip relative shrink-0 w-full" data-name="ChevronUp">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.58333 4.33333">
            <path d={svgPaths.p2dc3a700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="1.08333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MotionDiv() {
  return (
    <div className="relative size-[13px]" data-name="motion.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ChevronUp />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[24px]" data-name="button">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <MotionDiv />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Container8 />
      <Button1 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="svg">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-center justify-center p-[1.5px] relative rounded-[16777200px] shrink-0 size-[18px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Svg />
    </div>
  );
}

function Span2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[30px] top-0" data-name="span">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] not-italic relative shrink-0 text-[13px] text-[rgba(255,255,255,0.5)] tracking-[-0.0762px] w-[286px]">5+ years of experience in product design or UX research roles</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[34px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[2px] relative size-full">
        <Container11 />
        <Span2 />
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="svg">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Svg1 />
    </div>
  );
}

function Span3() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[291px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[254px]">{`Daily active user of collaborative design & prototyping tools`}</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[35.75px] relative shrink-0 w-[321px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container13 />
        <Span3 />
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="svg">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Svg2 />
    </div>
  );
}

function Span4() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[291px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[270px]">Led or participated in user research for SaaS platforms</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[35.75px] relative shrink-0 w-[321px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container15 />
        <Span4 />
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="svg">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Svg3 />
    </div>
  );
}

function Span5() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[291px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[278px]">Comfortable articulating workflow pain-points in detail</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[321px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container17 />
        <Span5 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[179px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container12 />
      <Container14 />
      <Container16 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-gradient-to-b from-[rgba(97,95,255,0.2)] h-[281px] relative rounded-[16px] shrink-0 to-[rgba(97,95,255,0.08)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(97,95,255,0.15)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(97,95,255,0.08)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[0.5px] pt-[16.5px] px-[16.5px] relative size-full">
        <Frame />
        <Container9 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.08)]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[281px] relative shrink-0 w-[321px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] relative w-full">
          <ul className="block flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[0] list-disc min-h-px min-w-px not-italic relative text-[12px] text-[rgba(255,255,255,0.5)] tracking-[0.0645px] whitespace-pre-wrap">
            <li className="mb-0 ms-[18px]">
              <span className="leading-[17.05px]">{`The participant described their current design handoff workflow, `}</span>
            </li>
            <li className="mb-0 ms-[18px]">
              <span className="leading-[17.05px]">Key pain points include version control issues and cross-team communication gaps.</span>
            </li>
            <li className="ms-[18px]">
              <span className="leading-[17.05px]">Analysing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-[353px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[16px] relative rounded-[inherit] w-full">
        <Container6 />
        <Frame1 />
      </div>
    </div>
  );
}

function Container19() {
  return <div className="bg-[rgba(255,255,255,0.08)] h-[3px] rounded-[9999px] shrink-0 w-[32px]" data-name="Container" />;
}

function Container18() {
  return (
    <div className="h-[12px] relative shrink-0 w-[353px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container19 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[399px] items-start left-[0.5px] overflow-clip top-[50.5px] w-[353px]" data-name="Container">
      <Container5 />
      <Container18 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(160,161,163,0.13)] border-[1.5px] border-[rgba(255,255,255,0.18)] border-solid overflow-clip relative rounded-[24px] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.03),0px_8px_32px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.15)] size-full" data-name="Container">
      <Container1 />
      <Container4 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_0.5px_rgba(255,255,255,0.05)]" />
    </div>
  );
}