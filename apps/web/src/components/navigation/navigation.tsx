import { useLocation } from "react-router-dom";
import {
  Adjustments,
  CalendarStats,
  FileAnalytics,
  Gauge,
  Notes,
  PresentationAnalytics,
  Lock,
  Home,
  Message,
  Plus,
  Pencil,
} from "tabler-icons-react";
import { LinksGroupProps } from "./NavbarLinksGroup";

export function getNavigation(): LinksGroupProps[] {
  const location = useLocation();

  return [
    { label: "Etusivu", icon: Home, link: "/" },
    location.pathname.startsWith("/messages")
      ? {
          label: "Viestit",
          icon: Message,
          forceOpen: true,
          links: [
            { label: "Saapuneet", link: "/messages" },
            { label: "Lähetetyt", link: "/messages/sent" },
            { label: "Luonnokset", link: "/messages/drafts" },
            { label: "Arkisto", link: "/messages/archive" },
          ],
        }
      : {
          label: "Viestit",
          icon: Message,
          link: "/messages",
          forceChevron: true,
        },
    {
      label: "Työjärjestys",
      icon: CalendarStats,
      link: "/schedule",
    },
    { label: "Analytics", icon: PresentationAnalytics },
    { label: "Contracts", icon: FileAnalytics },
    { label: "Settings", icon: Adjustments },
    {
      label: "Security",
      icon: Lock,
      links: [
        { label: "Enable 2FA", link: "/" },
        { label: "Change password", link: "/" },
        { label: "Recovery codes", link: "/" },
      ],
    },
  ];
}

export default getNavigation;
