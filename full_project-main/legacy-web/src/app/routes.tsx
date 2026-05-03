import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { ArchitectAgent } from "./pages/ArchitectAgent";
import { LiaisonAgent } from "./pages/LiaisonAgent";
import { ArchivistAgent } from "./pages/ArchivistAgent";
import { SentinelAgent } from "./pages/SentinelAgent";
import { Events } from "./pages/Events";
import { Members } from "./pages/Members";
import { Vault } from "./pages/Vault";
import { Root } from "./pages/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "architect", Component: ArchitectAgent },
      { path: "liaison", Component: LiaisonAgent },
      { path: "archivist", Component: ArchivistAgent },
      { path: "sentinel", Component: SentinelAgent },
      { path: "events", Component: Events },
      { path: "members", Component: Members },
      { path: "vault", Component: Vault },
    ],
  },
]);
