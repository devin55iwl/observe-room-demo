import { createBrowserRouter } from "react-router";
import { ResearcherView } from "./pages/ResearcherView";
import { ParticipantPage } from "./pages/ParticipantPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ResearcherView,
  },
  {
    path: "/participant",
    Component: ParticipantPage,
  },
]);
