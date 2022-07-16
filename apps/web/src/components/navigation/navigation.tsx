import { useTranslation } from "react-i18next";
import { Location } from "react-router-dom";
import {
  Adjustments,
  CalendarStats,
  FileAnalytics,
  PresentationAnalytics,
  Lock,
  Home,
  Message,
} from "tabler-icons-react";
import { LinksGroupProps } from "./NavbarLinksGroup";

export function getNavigation(location: Location): LinksGroupProps[] {
  const { t } = useTranslation();

  const isMessages = location.pathname.startsWith("/messages");
  return [
    { label: t("navigation:home"), icon: Home, link: "/" },
    {
      label: t("navigation:messages.messages"),
      icon: Message,
      pathOpen: isMessages,
      link: "/messages",
      links: [
        { label: t("navigation:messages.inbox"), link: "/messages" },
        { label: t("navigation:messages.sent"), link: "/messages/sent" },
        { label: t("navigation:messages.drafts"), link: "/messages/drafts" },
        { label: t("navigation:messages.archive"), link: "/messages/archive" },
      ],
    },
    {
      label: t("navigation:schedule"),
      icon: CalendarStats,
      link: "/schedule",
    },
  ];
}

export default getNavigation;
