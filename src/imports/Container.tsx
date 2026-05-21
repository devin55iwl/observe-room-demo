import svgPaths from "./svg-27b57cbka7";

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.15)] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[27px] py-[12px] relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white tracking-[1.2px] uppercase">Questions</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[33px] py-[12px] relative w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)] text-center tracking-[1.2px] uppercase">Insights</p>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] h-[52px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pl-[6px] pr-[5.992px] pt-[6px] relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="h-[85px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[16px] px-[16px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[48px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[41.67%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28.0004">
            <path d={svgPaths.p357ec100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-2px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 4">
            <path d="M2 2H14" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[91.67%_41.67%_8.33%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-2px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 4">
            <path d="M2 2H10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[299.21px] opacity-20 pt-[16px] px-[16px] size-[80px] top-px" data-name="Container">
      <Icon />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[27px] left-[25px] top-[25px] w-[330.211px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[24px] text-white top-[0.5px]">{`Session  03`}</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.5 15L7.5 10L12.5 5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[rgba(255,255,255,0.59)] relative rounded-[14px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12 15L7 10L12 5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[14px] size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container7 />
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-180">
            <Container8 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-[-41px] top-[-6.5px] w-[412px]" data-name="Container">
      <Container6 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[47px] left-[25px] top-[60.5px] w-[330px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[16px] text-[rgba(198,210,255,0.6)] top-[0.5px] w-[325px] whitespace-pre-wrap">Tell me about the last time you used product XXX and what your main goal was.</p>
      <Container5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(97,95,255,0.24)] h-[140px] relative rounded-[32px] shrink-0 w-[380px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(97,95,255,0.48)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <Container4 />
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.667 14.667">
            <path d={svgPaths.p2ae0b200} id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_16.67%_70.83%_83.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 4">
            <path d="M0.666667 0.666667V3.33333" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[79.17%] left-3/4 right-[8.33%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 1.33333">
            <path d="M3.33333 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_83.33%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 2.66667">
            <path d="M0.666667 0.666667V2" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.5%] right-[79.17%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 1.33333">
            <path d="M2 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[14px] shadow-[0px_0px_15px_0px_rgba(99,102,241,0.3)] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[30px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-white top-[-0.5px] tracking-[-0.5px]">AI Follow-up Suggestions</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[32px] relative shrink-0 w-[279.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container11 />
        <Heading />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Button">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Button">
          <path d={svgPaths.pfc1c300} fill="var(--fill-0, white)" fillOpacity="0.55" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[8px] relative size-full">
          <Container10 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[45.5px] left-[44px] top-0 w-[294.211px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.8)] top-[0.5px] w-[291px] whitespace-pre-wrap">Could you elaborate on the specific metrics you used to measure that success?</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.667 14.667">
            <path d={svgPaths.p2ae0b200} id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_16.67%_70.83%_83.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 4">
            <path d="M0.666667 0.666667V3.33333" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[79.17%] left-3/4 right-[8.33%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 1.33333">
            <path d="M3.33333 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_83.33%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 2.66667">
            <path d="M0.666667 0.666667V2" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.5%] right-[79.17%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 1.33333">
            <path d="M2 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#615fff] content-stretch flex flex-col items-start left-0 pt-[6px] px-[6px] rounded-[14px] shadow-[0px_10px_15px_0px_rgba(97,95,255,0.2),0px_4px_6px_0px_rgba(97,95,255,0.2)] size-[28px] top-[3.5px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function AiSuggestion() {
  return (
    <div className="absolute h-[45.5px] left-[21px] top-[21px] w-[338.211px]" data-name="AISuggestion">
      <Paragraph1 />
      <Container13 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(201,201,201,0.3)] h-[87.5px] relative rounded-[24px] shrink-0 w-full" data-name="Button">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <AiSuggestion />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.667 14.667">
            <path d={svgPaths.p2ae0b200} id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_16.67%_70.83%_83.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 4">
            <path d="M0.666667 0.666667V3.33333" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[79.17%] left-3/4 right-[8.33%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 1.33333">
            <path d="M3.33333 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_83.33%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 2.66667">
            <path d="M0.666667 0.666667V2" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.5%] right-[79.17%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 1.33333">
            <path d="M2 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #7C86FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#615fff] content-stretch flex flex-col items-start left-0 pt-[6px] px-[6px] rounded-[14px] shadow-[0px_10px_15px_0px_rgba(97,95,255,0.2),0px_4px_6px_0px_rgba(97,95,255,0.2)] size-[28px] top-[4px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[45.5px] left-[44px] top-0 w-[294.211px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.8)] top-[0.5px] w-[276px] whitespace-pre-wrap">What made you choose that marketplace instead of another one for this purchase?</p>
    </div>
  );
}

function AiSuggestion1() {
  return (
    <div className="absolute h-[45.5px] left-[21px] top-[21px] w-[338.211px]" data-name="AISuggestion">
      <Container14 />
      <Paragraph2 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[87.5px] relative rounded-[24px] shrink-0 w-full" data-name="Button">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <AiSuggestion1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start pt-[16px] relative shrink-0 w-[380.211px]" data-name="Section">
      <Container9 />
      <Container12 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[380.211px]" data-name="Container">
      <Container3 />
      <Section1 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Section">
      <Container2 />
    </div>
  );
}

function App1() {
  return (
    <div className="h-[372px] relative shrink-0 w-full" data-name="App">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] py-[24px] relative size-full">
          <Section />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[#615fff] content-stretch flex items-center justify-center left-0 p-[2px] rounded-[16777200px] size-[32px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[10px] text-white">JD</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container18 />
      </div>
    </div>
  );
}

function Text() {
  return <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px" data-name="Text" />;
}

function Container16() {
  return (
    <div className="h-[32px] relative shrink-0 w-[147.789px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container17 />
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[10px] text-[rgba(255,255,255,0.4)] tracking-[1px] uppercase">{` Observers`}</p>
        <Text />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex h-[38px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container16 />
    </div>
  );
}

function App2() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[87px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-[25px] px-[24px] relative size-full">
        <Container15 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <App />
      <App1 />
      <App2 />
    </div>
  );
}

function GlassPanel() {
  return (
    <div className="content-stretch flex flex-col h-[535px] items-start relative shrink-0 w-[444px]" data-name="GlassPanel">
      <Frame />
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative rounded-[32px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute bg-[rgba(128,128,128,0.3)] inset-0 mix-blend-luminosity pointer-events-none rounded-[32px]" />
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <GlassPanel />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}