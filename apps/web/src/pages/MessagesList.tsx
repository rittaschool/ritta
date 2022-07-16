import { Card, Space, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MessageTableSort, RowData } from "../components/MessageTableSort";
import PageWithTitle from "../components/PageWithTitle";

export enum MailBox {
  INBOX = "inbox",
  SENT = "sent",
  DRAFTS = "drafts",
  ARCHIVE = "archive",
}

const MessagesList = ({ box }: { box: MailBox }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const data: RowData[] = [
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 2,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 1,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "liikunta-huomenna",
      name: "Liikunta huomenna",
      author: "Liisa Liikunta",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: 0,
      createdAt: new Date().toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      }),
    },
  ];

  return (
    <PageWithTitle title={t("messages:title")}>
      <Card shadow="sm" p="lg">
        <Tabs
          value={box}
          onTabChange={(tab: string) =>
            navigate(`/messages/${tab === "inbox" ? "" : tab}`)
          }
        >
          <Tabs.List>
            <Tabs.Tab value="inbox">{t(`messages:inbox`)}</Tabs.Tab>
            <Tabs.Tab value="sent">{t(`messages:sent`)}</Tabs.Tab>
            <Tabs.Tab value="drafts">{t(`messages:drafts`)}</Tabs.Tab>
            <Tabs.Tab value="archive">{t(`messages:archive`)}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space h="md" />
        <MessageTableSort data={data} />
      </Card>
    </PageWithTitle>
  );
};

export default MessagesList;
