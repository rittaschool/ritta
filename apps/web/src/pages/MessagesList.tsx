import { Card, Space, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MessageTableSort, RowData } from "../components/MessageTableSort";
import PageWithTitle from "../components/PageWithTitle";
import { faker } from '@faker-js/faker';

faker.locale = "fi"
faker.seed(12345)

const data: RowData[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i),
  name: faker.lorem.sentence(),
  author: faker.name.findName(),
  newMessages: Number(faker.random.numeric()) < 4 ? (Number(faker.random.numeric()) < 5 ? 1 : 2) : 0,
  createdAt: faker.date.past(),
}));

export enum MailBox {
  INBOX = "inbox",
  SENT = "sent",
  DRAFTS = "drafts",
  ARCHIVE = "archive",
}

const MessagesList = ({ box }: { box: MailBox }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
