import svgPaths from "./svg-88hshqtc3y";

function Icon() {
  return (
    <div className="absolute left-0 size-[11px] top-[5.75px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
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

function Icon1() {
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

function Text() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[19px] size-[14px] top-[4.25px]" data-name="Text">
      <Icon1 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[22.5px] left-[41px] top-0 w-[55.547px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[15px] text-[rgba(255,255,255,0.8)] top-[-0.5px] tracking-[-0.2344px]">Persona</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[16.5px] left-[108.55px] top-[3px] w-[60.391px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.14)] top-[0.5px] tracking-[0.0645px]">12 sessions</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[168.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <Text />
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
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
    <div className="relative rounded-[14px] shrink-0 size-[26px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[6px] px-[6px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[50.5px] relative shrink-0 w-[354px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.06)] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.5px] px-[16px] relative size-full">
        <Container2 />
        <Button />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[22.5px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[15px] text-[rgba(255,255,255,0.8)] top-[-0.5px] tracking-[-0.2344px]">User #9527</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[33px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-0 tracking-[0.0645px] w-[290px] whitespace-pre-wrap">25–27 years old with 3+ years of experience in B2B industry</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative w-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-gradient-to-b from-[rgba(97,95,255,0.2)] h-[77px] relative rounded-[16px] shrink-0 to-[rgba(97,95,255,0.08)] w-[322px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(97,95,255,0.15)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(97,95,255,0.08)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[12px] relative size-full">
        <Container4 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.08)]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[rgba(255,255,255,0.12)] h-[25.5px] relative rounded-[9999px] shrink-0 w-[104.063px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[12.5px] not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[5px] tracking-[0.0645px]">Detail-oriented</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[rgba(255,255,255,0.12)] h-[25.5px] relative rounded-[9999px] shrink-0 w-[74.539px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[12.5px] not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[5px] tracking-[0.0645px]">Technical</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[rgba(255,255,255,0.12)] h-[25.5px] relative rounded-[9999px] shrink-0 w-[75.695px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[12.5px] not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[5px] tracking-[0.0645px]">Articulate</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[rgba(255,255,255,0.12)] h-[25.5px] relative rounded-[9999px] shrink-0 w-[88.578px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[12.5px] not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[5px] tracking-[0.0645px]">SaaS Expert</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-[308px]">
      <Text3 />
      <Text4 />
      <Text5 />
      <Text6 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Icon3 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[289px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[286px] whitespace-pre-wrap">5+ years of experience in product design or UX research roles</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[35.75px] relative shrink-0 w-[319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container12 />
        <Text7 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Icon4 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[289px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[254px] whitespace-pre-wrap">{`Daily active user of collaborative design & prototyping tools`}</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[35.75px] relative shrink-0 w-[319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container14 />
        <Text8 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Icon5 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[289px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[270px] whitespace-pre-wrap">Led or participated in user research for SaaS platforms</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[35.75px] relative shrink-0 w-[319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container16 />
        <Text9 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d="M2.5 5L4.167 6.667L7.5 3.333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[1.5px] rounded-[16777200px] size-[18px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.14)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Icon6 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[35.75px] left-[30px] top-0 w-[289px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.875px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-0 tracking-[-0.0762px] w-[278px] whitespace-pre-wrap">Comfortable articulating workflow pain-points in detail</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container18 />
        <Text10 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[226.75px] items-start relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container13 />
      <Container15 />
      <Container17 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col h-[272.25px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[354px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip pl-[16px] pr-[19px] pt-[16px] relative rounded-[inherit] size-full">
        <Frame />
        <Container9 />
      </div>
    </div>
  );
}

function Container20() {
  return <div className="bg-[rgba(255,255,255,0.08)] h-[3px] rounded-[9999px] shrink-0 w-[32px]" data-name="Container" />;
}

function Container19() {
  return (
    <div className="h-[12px] relative shrink-0 w-[354px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container20 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] relative rounded-[24px] size-full" data-name="Container">
      <div className="content-stretch flex flex-col items-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Container1 />
        <Container3 />
        <Container8 />
        <Container19 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.12),inset_0px_0px_0px_0.5px_rgba(255,255,255,0.06)]" />
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.18)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.04),0px_4px_24px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}