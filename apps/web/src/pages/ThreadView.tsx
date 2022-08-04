import { faker } from "@faker-js/faker";
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Group,
  Text,
  Title,
} from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import PageWithTitle from "../components/PageWithTitle";
import { ThreadMessage } from "../components/ThreadMessage";

faker.locale = "fi";

const messageData = {
  title: faker.lorem.words(4),
  quickReply: true,
  messages: Array.from({ length: 5 }, () => ({
    author: faker.name.findName(),
    avatarUrl: faker.image.avatar(),
    date: faker.date.past(),
    content: faker.lorem.paragraph(),
  })).sort((a, b) => a.date.getTime() - b.date.getTime()),
}

const ThreadView = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [replyValue, onChange] = useState("");

  const items = [
    { title: t("home:title"), href: "/" },
    { title: t("messages:title"), href: "/messages" },
    { title: messageData.title },
  ].map((item, index) =>
    item.href ? (
      <Anchor component={Link} to={item.href} key={item.title}>
        {item.title}
      </Anchor>
    ) : (
      <Text color="dimmed" key={item.title}>{item.title}</Text>
    )
  );

  return (
    <PageWithTitle title={`${messageData.title} mockup, url id ${id}`}>
      <Group>
        <Badge variant="filled" color="teal" size="sm">
          <Text color="teal">---</Text>
        </Badge>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <Card shadow="sm" p="lg" mt="16px">
        {messageData.messages.map((msg, index) => (
          <Card.Section p="lg" key={msg.author + "." + msg.content + "." + msg.date.toString()}>
            <ThreadMessage
              author={{ image: msg.avatarUrl, name: msg.author }}
              body={msg.content}
              postedAt={msg.date}
              isFirst={index == 0}
            />
          </Card.Section>
        ))}
      </Card>
      {messageData.quickReply ? (
        <Card shadow="sm" p="lg" mt="16px">
          <Title order={2} mb={20}>
            {t("messages:reply")}
          </Title>
          <RichTextEditor value={replyValue} onChange={onChange} mb={20} />
          <Button color="teal">{t("messages:send_reply")}</Button>
        </Card>
      ) : (
        <></>
      )}
    </PageWithTitle>
  );
};

export default ThreadView;
