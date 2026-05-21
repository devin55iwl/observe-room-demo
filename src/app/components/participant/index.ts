/**
 * participant/ — Components exclusive to the Participant Interview page (route: /participant)
 *
 * The Participant page is where an interviewee goes through an AI-moderated
 * interview session. It supports Light/Dark dual modes and a 4-step funnel:
 *
 *   Funnel Flow
 *   ├── FunnelShell        — Theme provider, shared primitives (PrimaryBtn, Divider, etc.)
 *   ├── LanguageStep       — Step 1: Language selection
 *   ├── TermsStep          — Step 2: Terms & consent
 *   ├── SetupStep          — Step 3: Camera/mic setup & permissions
 *   └── ScreenerStep       — Step 4: Screening questions
 *
 *   After funnel completion → Ready → Live Interview
 *   (Interview UI is rendered directly in ParticipantPage.tsx)
 *
 * Mobile Adaptations (< 768px):
 *   - Stories-mode vertical swipe cards for Comparison questions
 *   - In-Home Visit with rear camera + viewfinder + AI recognition
 *   - iOS system chrome (StatusBar, HomeIndicator) following Light/Dark mode
 */

export { FunnelShell, ParticipantThemeProvider, useParticipantTheme, useIsMobile, PrimaryBtn, Divider, SF, MONO } from "./FunnelShell";
export { LanguageStep } from "./LanguageStep";
export { TermsStep } from "./TermsStep";
export { SetupStep } from "./SetupStep";
export { ScreenerStep } from "./ScreenerStep";
