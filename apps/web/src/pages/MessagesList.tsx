import { Container, Stack, Table, Tabs, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MessageTableSort, RowData } from "../components/MessageTableSort";

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
      newMessages: true,
      createdAt: new Date().toLocaleString(i18n.language),
    },
    {
      id: "minun-generaatio",
      name: "Minun generaatio",
      author: "Pieni Iso",
      newMessages: false,
      createdAt: new Date().toLocaleString(i18n.language),
    },
    {
      id: "tama-on-testiviesti",
      name: "Tämä on testiviesti",
      author: "Testi",
      newMessages: true,
      createdAt: new Date().toLocaleString(i18n.language),
    },
  ];
  return (
    <Stack>
      <Title>{t(`messages:title`)}</Title>
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
      <MessageTableSort data={data} />
    </Stack>
  );
};

export default MessagesList;
