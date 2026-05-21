import svgPaths from "./svg-jqn6i1fsym";
import { imgGroup, imgGroup1 } from "./svg-3xttb";

function TranscriptPanel() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-[3px] rounded-[16777200px] shrink-0 w-[36px]" data-name="TranscriptPanel" />;
}

function Container1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 overflow-clip px-[192px] top-[544px] w-[420px]" data-name="Container">
      <TranscriptPanel />
    </div>
  );
}

function Container4() {
  return <div className="bg-[rgba(255,255,255,0.8)] rounded-[16777200px] shrink-0 size-[3px]" data-name="Container" />;
}

function Container5() {
  return <div className="bg-[rgba(255,255,255,0.8)] flex-[1_0_0] h-[3px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function TranscriptPanel3() {
  return (
    <div className="h-[3px] relative shrink-0 w-[9px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-start relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return <div className="bg-[rgba(255,255,255,0.8)] rounded-[16777200px] shrink-0 size-[3px]" data-name="Container" />;
}

function Container7() {
  return <div className="bg-[rgba(255,255,255,0.8)] flex-[1_0_0] h-[3px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function TranscriptPanel4() {
  return (
    <div className="h-[3px] relative shrink-0 w-[9px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-start relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Container8() {
  return <div className="bg-[rgba(255,255,255,0.8)] rounded-[16777200px] shrink-0 size-[3px]" data-name="Container" />;
}

function Container9() {
  return <div className="bg-[rgba(255,255,255,0.8)] flex-[1_0_0] h-[3px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function TranscriptPanel5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[9px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-start relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3px] h-[15px] items-start left-0 opacity-20 top-[4.5px] w-[9px]" data-name="Container">
      <TranscriptPanel3 />
      <TranscriptPanel4 />
      <TranscriptPanel5 />
    </div>
  );
}

function TranscriptIcon() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="TranscriptIcon">
      <div className="absolute inset-[4.17%_33.33%_37.5%_4.17%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-6.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91667 9.33334">
            <path d={svgPaths.pb4eee80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[4.17%_12.5%_20.83%_4.17%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 11.6666">
            <path d={svgPaths.p3766ae80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[19px] size-[14px] top-[5px]" data-name="Container">
      <TranscriptIcon />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[24px] left-[41px] top-0 w-[74.219px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(255,255,255,0.8)] top-[-1px] tracking-[-0.234px] whitespace-nowrap">Transcript</p>
    </div>
  );
}

function TranscriptPanel2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[115.219px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container3 />
        <Container10 />
        <Text />
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="ChevronDownIcon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[79.32px] px-[7px] rounded-[14px] size-[26px] top-0" data-name="Button">
      <ChevronDownIcon />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.917px_-0.917px] mask-size-[11px_11px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0834 10.0834">
          <g id="Group">
            <path d={svgPaths.p3acf7680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d={svgPaths.p3a9d9f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M0.458333 1.83334H5.95834" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M2.75 0.458333H3.20834" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d={svgPaths.p33c7d800} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M5.95834 7.79167H8.70834" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function LanguageIcon() {
  return (
    <div className="absolute left-[8.5px] overflow-clip size-[11px] top-[3.75px]" data-name="LanguageIcon">
      <ClipPathGroup />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[13.5px] left-[25.5px] top-[2.5px] w-[41.32px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[13.5px] left-[21px] not-italic text-[9px] text-[rgba(255,255,255,0.28)] text-center top-[0.5px] tracking-[0.167px] whitespace-nowrap">Translate</p>
    </div>
  );
}

function Container11() {
  return <div className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid h-[18.5px] left-0 rounded-[16777200px] top-0 w-[75.32px]" data-name="Container" />;
}

function TranslateButton() {
  return (
    <div className="absolute h-[18.5px] left-0 rounded-[16777200px] top-[3.75px] w-[75.32px]" data-name="TranslateButton">
      <LanguageIcon />
      <Text1 />
      <Container11 />
    </div>
  );
}

function TranscriptPanel6() {
  return (
    <div className="h-[26px] relative shrink-0 w-[105.32px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button />
        <TranslateButton />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[50px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <TranscriptPanel2 />
          <TranscriptPanel6 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return <div className="bg-[rgba(255,255,255,0.06)] h-px shrink-0 w-full" data-name="Container" />;
}

function TranscriptPanel1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[51px] items-start left-0 top-0 w-[420px]" data-name="TranscriptPanel">
      <Container2 />
      <Container12 />
    </div>
  );
}

function Container14() {
  return <div className="bg-[rgba(97,95,255,0.15)] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Container" />;
}

function Text2() {
  return (
    <div className="h-[12px] relative shrink-0 w-[23.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[8px] text-[rgba(97,95,255,0.5)] top-0 tracking-[1px] uppercase whitespace-nowrap">Now</p>
      </div>
    </div>
  );
}

function Container15() {
  return <div className="bg-[rgba(97,95,255,0.15)] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Container" />;
}

function NowDivider() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[16px] items-center left-0 px-[24px] top-[325.61px] w-[420px]" data-name="NowDivider">
      <Container14 />
      <Text2 />
      <Container15 />
    </div>
  );
}

function UserIcon() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[18px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[4.5px] relative size-full">
        <UserIcon />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[16.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[27.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-0 not-italic text-[9px] text-[rgba(255,255,255,0.14)] top-[-0.5px] whitespace-nowrap">06:58</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[18px] relative shrink-0 w-[94.664px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <SpeakerAvatar />
        <Text3 />
        <Text4 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[12px] left-[12px] top-0 w-[20.203px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[8px] text-[rgba(255,255,255,0.2)] top-0 tracking-[0.8px] uppercase whitespace-nowrap">Live</p>
    </div>
  );
}

function Text6() {
  return <div className="absolute bg-[#ff8080] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />;
}

function RecordingDot() {
  return (
    <div className="absolute left-0 size-[6px] top-[3px]" data-name="RecordingDot">
      <Text6 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[12px] relative shrink-0 w-[32.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text5 />
        <RecordingDot />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex h-[18px] items-center justify-between left-[14px] top-[10px] w-[360px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[62.391px] left-[14px] top-[34px] w-[360px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[20.8px] left-[26px] text-[13px] text-[rgba(255,255,255,0.55)] top-[0.5px] tracking-[-0.076px] w-[322px]">“Really excited. If AI could handle the repetitive parts — generating tokens, suggesting variants — that would free me up for actual design thinking.”</p>
    </div>
  );
}

function Container19() {
  return <div className="absolute border-[0.5px] border-[rgba(97,95,255,0.12)] border-solid h-[106.391px] left-0 rounded-[16px] top-0 w-[388px]" data-name="Container" />;
}

function LiveSubtitleBar() {
  return (
    <div className="absolute bg-[rgba(97,95,255,0.06)] h-[106.391px] left-[16px] rounded-[16px] top-[351.61px] w-[388px]" data-name="LiveSubtitleBar">
      <Container16 />
      <Paragraph />
      <Container19 />
    </div>
  );
}

function Container21() {
  return <div className="bg-[#6dd4a0] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[13.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[9px] text-[rgba(255,255,255,0.14)] top-[0.5px] tracking-[0.167px] whitespace-nowrap">Positive</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[46.617px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Container21 />
        <Text7 />
      </div>
    </div>
  );
}

function Container23() {
  return <div className="bg-[rgba(255,255,255,0.2)] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[13.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[9px] text-[rgba(255,255,255,0.14)] top-[0.5px] tracking-[0.167px] whitespace-nowrap">Neutral</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[44.086px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Container23 />
        <Text8 />
      </div>
    </div>
  );
}

function Container25() {
  return <div className="bg-[#ff8080] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[13.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] left-0 not-italic text-[9px] text-[rgba(255,255,255,0.14)] top-[0.5px] tracking-[0.167px] whitespace-nowrap">Negative</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[51.195px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Container25 />
        <Text9 />
      </div>
    </div>
  );
}

function LegendRow() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[25px] items-center left-0 pl-[24px] pt-px top-[468px] w-[420px]" data-name="LegendRow">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.04)] border-solid border-t inset-0 pointer-events-none" />
      <Container20 />
      <Container22 />
      <Container24 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">00:00</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SparkleIcon() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup1 />
      </div>
    </div>
  );
}

function SpeakerAvatar1() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text11 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[260px]">Thanks for joining. Could you tell me about your current role?</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container30 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text10 />
        <SpeakerAvatar1 />
        <Container29 />
      </div>
    </div>
  );
}

function HistoryEntry() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-0 w-[384px]" data-name="HistoryEntry">
      <Container28 />
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">00:32</p>
      </div>
    </div>
  );
}

function UserIcon1() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar2() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon1 />
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[33.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function SentimentDot() {
  return <div className="bg-[rgba(255,255,255,0.2)] rounded-[16777200px] shrink-0 size-[6px]" data-name="SentimentDot" />;
}

function Container33() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text13 />
        <SentimentDot />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[272px]">{`Sure. I'm a product designer at a mid-size SaaS company. I lead the design system and handle most handoff workflows.`}</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="flex-[1_0_0] h-[80.891px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container33 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[80.891px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text12 />
        <SpeakerAvatar2 />
        <Container32 />
      </div>
    </div>
  );
}

function HistoryEntry1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[100.891px] items-start left-0 pt-[10px] rounded-[16px] top-[82.09px] w-[384px]" data-name="HistoryEntry">
      <Container31 />
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">01:15</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function SparkleIcon1() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup2 />
      </div>
    </div>
  );
}

function SpeakerAvatar3() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon1 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text15 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[265px]">Can you describe your current workflow for design handoffs?</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container36 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text14 />
        <SpeakerAvatar3 />
        <Container35 />
      </div>
    </div>
  );
}

function HistoryEntry2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-[184.98px] w-[384px]" data-name="HistoryEntry">
      <Container34 />
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">01:28</p>
      </div>
    </div>
  );
}

function UserIcon2() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar4() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon2 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[33.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function SentimentDot1() {
  return <div className="bg-[#ff8080] rounded-[16777200px] shrink-0 size-[6px]" data-name="SentimentDot" />;
}

function Container39() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16.5px] items-center left-0 top-0 w-[284px]" data-name="Container">
      <Text17 />
      <SentimentDot1 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[83.188px] left-0 top-[18.5px] w-[284px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[263px]">{`Right now it's a mix of Figma specs and Notion. We annotate frames, export assets, and leave comments. It works, but lots of manual steps.`}</p>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[7.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[10.5px] left-0 not-italic text-[#ffd166] text-[7px] top-0 tracking-[0.53px] whitespace-nowrap">⚠</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="flex-[1_0_0] h-[12px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[#ffd166] text-[8px] top-0 tracking-[0.5px] whitespace-nowrap">Filler language</p>
      </div>
    </div>
  );
}

function DetectionBadge() {
  return (
    <div className="absolute bg-[rgba(255,209,102,0.06)] content-stretch flex gap-[3px] h-[15px] items-center left-0 px-[5.5px] py-[0.5px] rounded-[4px] top-[107.69px] w-[84.414px]" data-name="DetectionBadge">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,209,102,0.14)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text18 />
      <Text19 />
    </div>
  );
}

function Container38() {
  return (
    <div className="flex-[1_0_0] h-[122.688px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container39 />
        <Paragraph4 />
        <DetectionBadge />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[122.688px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text16 />
        <SpeakerAvatar4 />
        <Container38 />
      </div>
    </div>
  );
}

function HistoryEntry3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[142.688px] items-start left-0 pt-[10px] rounded-[16px] top-[267.08px] w-[384px]" data-name="HistoryEntry">
      <Container37 />
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">02:10</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function SparkleIcon2() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup3 />
      </div>
    </div>
  );
}

function SpeakerAvatar5() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon2 />
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text21 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[240px]">What are the biggest pain points during collaboration?</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container42 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text20 />
        <SpeakerAvatar5 />
        <Container41 />
      </div>
    </div>
  );
}

function HistoryEntry4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-[411.77px] w-[384px]" data-name="HistoryEntry">
      <Container40 />
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">02:24</p>
      </div>
    </div>
  );
}

function UserIcon3() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar6() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon3 />
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[33.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function SentimentDot2() {
  return <div className="bg-[#ff8080] rounded-[16777200px] shrink-0 size-[6px]" data-name="SentimentDot" />;
}

function Container45() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16.5px] items-center left-0 top-0 w-[284px]" data-name="Container">
      <Text23 />
      <SentimentDot2 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[62.391px] left-0 top-[18.5px] w-[284px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[261px]">{`The manual part. Exporting, re-uploading, syncing versions — it's tedious. There's no single source of truth.`}</p>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[7.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[10.5px] left-0 not-italic text-[#ffd166] text-[7px] top-0 tracking-[0.53px] whitespace-nowrap">⚠</p>
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="flex-[1_0_0] h-[12px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[#ffd166] text-[8px] top-0 tracking-[0.5px] whitespace-nowrap">Hesitation detected</p>
      </div>
    </div>
  );
}

function DetectionBadge1() {
  return (
    <div className="absolute bg-[rgba(255,209,102,0.06)] content-stretch flex gap-[3px] h-[15px] items-center left-0 px-[5.5px] py-[0.5px] rounded-[4px] top-[86.89px] w-[104.781px]" data-name="DetectionBadge">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,209,102,0.14)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text24 />
      <Text25 />
    </div>
  );
}

function Container44() {
  return (
    <div className="flex-[1_0_0] h-[101.891px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container45 />
        <Paragraph6 />
        <DetectionBadge1 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[101.891px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text22 />
        <SpeakerAvatar6 />
        <Container44 />
      </div>
    </div>
  );
}

function HistoryEntry5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[121.891px] items-start left-0 pt-[10px] rounded-[16px] top-[493.86px] w-[384px]" data-name="HistoryEntry">
      <Container43 />
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">03:05</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group4 />
    </div>
  );
}

function SparkleIcon3() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup4 />
      </div>
    </div>
  );
}

function SpeakerAvatar7() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon3 />
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text27 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[220px]">How do you currently handle design versioning?</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container48 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text26 />
        <SpeakerAvatar7 />
        <Container47 />
      </div>
    </div>
  );
}

function HistoryEntry6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-[617.75px] w-[384px]" data-name="HistoryEntry">
      <Container46 />
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">03:18</p>
      </div>
    </div>
  );
}

function UserIcon4() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar8() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon4 />
      </div>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[33.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function SentimentDot3() {
  return <div className="bg-[#ff8080] rounded-[16777200px] shrink-0 size-[6px]" data-name="SentimentDot" />;
}

function Container51() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16.5px] items-center left-0 top-0 w-[284px]" data-name="Container">
      <Text29 />
      <SentimentDot3 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[62.391px] left-0 top-[18.5px] w-[284px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[254px]">{`We use Figma branches, but it's not ideal. We've lost work before because of merge conflicts.`}</p>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[7.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[10.5px] left-0 not-italic text-[#ffd166] text-[7px] top-0 tracking-[0.53px] whitespace-nowrap">⚠</p>
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="flex-[1_0_0] h-[12px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[#ffd166] text-[8px] top-0 tracking-[0.5px] whitespace-nowrap">Pitch shift ↑</p>
      </div>
    </div>
  );
}

function DetectionBadge2() {
  return (
    <div className="absolute bg-[rgba(255,209,102,0.06)] content-stretch flex gap-[3px] h-[15px] items-center left-0 px-[5.5px] py-[0.5px] rounded-[4px] top-[86.89px] w-[74.352px]" data-name="DetectionBadge">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,209,102,0.14)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text30 />
      <Text31 />
    </div>
  );
}

function Container50() {
  return (
    <div className="flex-[1_0_0] h-[101.891px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container51 />
        <Paragraph8 />
        <DetectionBadge2 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[101.891px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text28 />
        <SpeakerAvatar8 />
        <Container50 />
      </div>
    </div>
  );
}

function HistoryEntry7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[121.891px] items-start left-0 pt-[10px] rounded-[16px] top-[699.84px] w-[384px]" data-name="HistoryEntry">
      <Container49 />
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">04:02</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup5() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function SparkleIcon4() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup5 />
      </div>
    </div>
  );
}

function SpeakerAvatar9() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon4 />
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text33 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[250px]">If you could change one thing about your tooling, what would it be?</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container54 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text32 />
        <SpeakerAvatar9 />
        <Container53 />
      </div>
    </div>
  );
}

function HistoryEntry8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-[823.73px] w-[384px]" data-name="HistoryEntry">
      <Container52 />
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">04:15</p>
      </div>
    </div>
  );
}

function UserIcon5() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar10() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon5 />
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[33.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">#9527</p>
      </div>
    </div>
  );
}

function SentimentDot4() {
  return <div className="bg-[#6dd4a0] rounded-[16777200px] shrink-0 size-[6px]" data-name="SentimentDot" />;
}

function Container57() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text35 />
        <SentimentDot4 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[271px]">Seamless integration. I want tools that talk to each other without me being the glue in between.</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="flex-[1_0_0] h-[80.891px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container57 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[80.891px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text34 />
        <SpeakerAvatar10 />
        <Container56 />
      </div>
    </div>
  );
}

function HistoryEntry9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[100.891px] items-start left-0 pt-[10px] rounded-[16px] top-[905.83px] w-[384px]" data-name="HistoryEntry">
      <Container55 />
    </div>
  );
}

function Text36() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[40px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Menlo:Regular',sans-serif] leading-[13.5px] left-[40.91px] not-italic text-[9px] text-[rgba(255,255,255,0.14)] text-right top-[3.5px] whitespace-nowrap">05:50</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.751px_-0.75px] mask-size-[9px_9px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.2502 8.25018">
          <g id="Group">
            <path d={svgPaths.p356f4400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.12443 0.750093V2.25009" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M7.87443 1.50009H6.37443" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.12443 6.00009V6.75009" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
            <path d="M1.49943 6.37509H0.749428" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup6() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function SparkleIcon5() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SparkleIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup6 />
      </div>
    </div>
  );
}

function SpeakerAvatar11() {
  return (
    <div className="bg-[#615fff] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <SparkleIcon5 />
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[50.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[0.064px] whitespace-nowrap">Cookiy AI</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[284px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text37 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[284px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.8px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.28)] top-[0.5px] tracking-[-0.076px] w-[280px]">How do you feel about AI-powered features in design tools?</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="flex-[1_0_0] h-[60.094px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container60 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[60.094px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-start px-[8px] relative size-full">
        <Text36 />
        <SpeakerAvatar11 />
        <Container59 />
      </div>
    </div>
  );
}

function HistoryEntry10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.094px] items-start left-0 pt-[10px] rounded-[16px] top-[1008.72px] w-[384px]" data-name="HistoryEntry">
      <Container58 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[1088.813px] relative shrink-0 w-full" data-name="Container">
      <HistoryEntry />
      <HistoryEntry1 />
      <HistoryEntry2 />
      <HistoryEntry3 />
      <HistoryEntry4 />
      <HistoryEntry5 />
      <HistoryEntry6 />
      <HistoryEntry7 />
      <HistoryEntry8 />
      <HistoryEntry9 />
      <HistoryEntry10 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[325.609px] items-start left-0 overflow-clip pl-[16px] pr-[20px] pt-[-767.5px] top-0 w-[420px]" data-name="Container">
      <Container27 />
    </div>
  );
}

function Container61() {
  return <div className="absolute bg-gradient-to-b from-[rgba(42,42,52,0.85)] h-[24px] left-0 rounded-tl-[4px] rounded-tr-[4px] to-[rgba(0,0,0,0)] top-0 w-[420px]" data-name="Container" />;
}

function TranscriptPanel8() {
  return (
    <div className="absolute h-[325.609px] left-0 overflow-clip top-0 w-[420px]" data-name="TranscriptPanel">
      <Container26 />
      <Container61 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[493px] left-0 overflow-clip top-0 w-[420px]" data-name="Container">
      <NowDivider />
      <LiveSubtitleBar />
      <LegendRow />
      <TranscriptPanel8 />
    </div>
  );
}

function TranscriptPanel7() {
  return (
    <div className="absolute h-[493px] left-0 overflow-clip top-[51px] w-[420px]" data-name="TranscriptPanel">
      <Container13 />
    </div>
  );
}

function TranscriptPanel9() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[560px] left-0 rounded-[24px] top-0 w-[420px]" data-name="TranscriptPanel">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_1px_2px_0px_rgba(255,255,255,0.09),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.18),inset_0px_0px_0px_0px_rgba(255,255,255,0.05)]" />
    </div>
  );
}

function Container62() {
  return <div className="absolute bg-[rgba(255,255,255,0)] border border-[rgba(255,255,255,0.12)] border-solid h-[560px] left-0 rounded-[24px] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.28),0px_2px_6px_0px_rgba(0,0,0,0.12)] top-0 w-[420px]" data-name="Container" />;
}

function Container() {
  return (
    <div className="bg-[rgba(160,161,163,0.13)] h-[560px] overflow-clip relative rounded-[24px] shrink-0 w-[420px]" data-name="Container">
      <Container1 />
      <TranscriptPanel1 />
      <TranscriptPanel7 />
      <TranscriptPanel9 />
      <Container62 />
    </div>
  );
}

function Text38() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(255,255,255,0.28)] top-[-1px] tracking-[0.064px] whitespace-nowrap">Transcript</p>
      </div>
    </div>
  );
}

function TranscriptPanel12() {
  return (
    <div className="absolute h-[12px] left-[10px] top-0 w-[19px]" data-name="TranscriptPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[8px] text-[rgba(255,255,255,0.14)] top-0 tracking-[0.5px] uppercase whitespace-nowrap">Live</p>
    </div>
  );
}

function Text39() {
  return <div className="absolute bg-[#ff8080] left-[-2.82px] opacity-2 rounded-[16777200px] size-[11.646px] top-[-2.82px]" data-name="Text" />;
}

function Text40() {
  return <div className="absolute bg-[#ff8080] left-0 rounded-[16777200px] size-[6px] top-0" data-name="Text" />;
}

function RecordingDot1() {
  return (
    <div className="absolute left-0 size-[6px] top-[3px]" data-name="RecordingDot">
      <Text39 />
      <Text40 />
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[12px] relative shrink-0 w-[29px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <TranscriptPanel12 />
        <RecordingDot1 />
      </div>
    </div>
  );
}

function TranscriptPanel11() {
  return (
    <div className="h-[24px] relative shrink-0 w-[118.195px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Text38 />
        <Container65 />
      </div>
    </div>
  );
}

function ChevronUpIcon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="ChevronUpIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="ChevronUpIcon">
          <path d="M3 7.5L6 4.5L9 7.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[79.32px] px-[7px] rounded-[14px] size-[26px] top-0" data-name="Button">
      <ChevronUpIcon />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.917px_-0.917px] mask-size-[11px_11px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0834 10.0834">
          <g id="Group">
            <path d={svgPaths.p3acf7680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d={svgPaths.p3a9d9f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M0.458333 1.83334H5.95834" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M2.75 0.458333H3.20834" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d={svgPaths.p33c7d800} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
            <path d="M5.95834 7.79167H8.70834" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="0.916667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup7() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group7 />
    </div>
  );
}

function LanguageIcon1() {
  return (
    <div className="absolute left-[8.5px] overflow-clip size-[11px] top-[3.75px]" data-name="LanguageIcon">
      <ClipPathGroup7 />
    </div>
  );
}

function Text41() {
  return (
    <div className="absolute h-[13.5px] left-[25.5px] top-[2.5px] w-[41.32px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[13.5px] left-[21px] not-italic text-[9px] text-[rgba(255,255,255,0.28)] text-center top-[0.5px] tracking-[0.167px] whitespace-nowrap">Translate</p>
    </div>
  );
}

function Container66() {
  return <div className="absolute border-[0.5px] border-[rgba(255,255,255,0.06)] border-solid h-[18.5px] left-0 rounded-[16777200px] top-0 w-[75.32px]" data-name="Container" />;
}

function TranslateButton1() {
  return (
    <div className="absolute h-[18.5px] left-0 rounded-[16777200px] top-[3.75px] w-[75.32px]" data-name="TranslateButton">
      <LanguageIcon1 />
      <Text41 />
      <Container66 />
    </div>
  );
}

function TranscriptPanel13() {
  return (
    <div className="h-[26px] relative shrink-0 w-[105.32px]" data-name="TranscriptPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button1 />
        <TranslateButton1 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[55.5px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[21.5px] relative size-full">
          <TranscriptPanel11 />
          <TranscriptPanel13 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return <div className="bg-[rgba(255,255,255,0)] h-px shrink-0 w-full" data-name="Container" />;
}

function TranscriptPanel10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[56.5px] items-start left-0 top-0 w-[420px]" data-name="TranscriptPanel">
      <Container64 />
      <Container67 />
    </div>
  );
}

function UserIcon6() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="UserIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="UserIcon">
          <path d={svgPaths.p4fa6800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
          <path d={svgPaths.pe8d2500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function SpeakerAvatar12() {
  return (
    <div className="bg-[rgba(97,95,255,0.2)] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="SpeakerAvatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.5px] relative size-full">
        <UserIcon6 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="flex-[1_0_0] h-[62.391px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[20.8px] left-0 text-[13px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.076px] w-[339px]">“Really excited. If AI could handle the repetitive parts — generating tokens, suggesting variants — that would free me up for actual design thinking.”</p>
      </div>
    </div>
  );
}

function SubtitleContent() {
  return (
    <div className="h-[62.391px] relative shrink-0 w-[377px]" data-name="SubtitleContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <SpeakerAvatar12 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function TranscriptPanel14() {
  return (
    <div className="absolute content-stretch flex flex-col h-[78.391px] items-start left-0 overflow-clip pl-[21.5px] top-[56.5px] w-[420px]" data-name="TranscriptPanel">
      <SubtitleContent />
    </div>
  );
}

function TranscriptPanel15() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[134.891px] left-0 rounded-[24px] top-0 w-[420px]" data-name="TranscriptPanel">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_1px_2px_0px_rgba(255,255,255,0.09),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.18),inset_0px_0px_0px_0px_rgba(255,255,255,0.05)]" />
    </div>
  );
}

function Container68() {
  return <div className="absolute bg-[rgba(255,255,255,0)] border-[1.5px] border-[rgba(255,255,255,0.18)] border-solid h-[134.891px] left-0 rounded-[24px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.25),0px_2px_8px_0px_rgba(0,0,0,0.15)] top-0 w-[420px]" data-name="Container" />;
}

function Container63() {
  return (
    <div className="bg-[rgba(160,161,163,0.13)] h-[134.891px] overflow-clip relative rounded-[24px] shrink-0 w-[420px]" data-name="Container">
      <TranscriptPanel10 />
      <TranscriptPanel14 />
      <TranscriptPanel15 />
      <Container68 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative size-full">
      <Container />
      <Container63 />
    </div>
  );
}