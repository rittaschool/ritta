import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import RichTextEditor from "@mantine/rte";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import PageWithTitle from "../components/PageWithTitle";
import { ThreadMessage } from "../components/ThreadMessage";

const messageData =
  Math.random() < 0.5
    ? {
      title: "Thread viesti title",
      quickReply: false,
      messages: [
        {
          author: "Luukas Lähettäjä",
          avatarUrl:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
          date: "16.8.2022 klo. 69:69",
          content:
            "<h2>Hei, sinä threadin lukija!</h2><p>Mursu <b>kävi</b> haminassa <i>eilen</i>. Refreshaappa sivua niin saatat saada toisenlaisen testiviestin!",
        },
      ],
    }
    : {
      title: "Thread viesti title",
      quickReply: true,
      messages: [
        {
          author: "Luukas Lähettäjä",
          avatarUrl:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
          date: "16.8.2022 klo. 69:69",
          content:
            "<h2>Hei, sinä threadin lukija!</h2><p>Mursu <b>kävi</b> haminassa <i>eilen</i>",
        },
        {
          author: "Arto Agree",
          avatarUrl:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
          date: "17.8.2022 klo. 42:42",
          content:
            "Juuri niin! Todella hyvä viesti. Tämä viesti on vastaus. Refreshaappa sivu niin saatat nähdä toisenlaisen testiviestin!",
        },
      ],
    };

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
