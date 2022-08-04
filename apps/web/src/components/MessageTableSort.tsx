import React, { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Badge,
  Anchor,
} from "@mantine/core";
import { Selector, ChevronDown, ChevronUp, Search } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const isDate = (value: unknown): value is Date => value instanceof Date;

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

export interface RowData {
  id: string;
  newMessages: number;
  name: string;
  createdAt: Date;
  author: string;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  return data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())));
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const sortBy = payload.sortBy;
  const filtered = filterData(data, payload.search);
  if (!sortBy) {
    return filtered;
  }

  const sorted = [...filtered].sort((a, b) => {
    const aSort = a[sortBy];
    const bSort = b[sortBy];
    if (isDate(aSort) && isDate(bSort)) {
      return aSort.getTime() - bSort.getTime();
    }
    return aSort.toString().localeCompare(bSort.toString());
  });

  if (payload.reversed) sorted.reverse();

  return sorted;
}

export function MessageTableSort({ data }: TableSortProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortedData = sortData(data, { sortBy, reversed: reverseSortDirection, search });

  const { t, i18n } = useTranslation();

  const rows = sortedData.map((row) => (
    <tr key={row.name}>
      <td>
        <Anchor component={Link} to={`/messages/${row.id}`}>
          {0 < row.newMessages ? (
            <b>
              {row.name}{" "}
              <Badge
                variant="filled"
                color="teal"
                title={t("messages:new_messages", { count: row.newMessages })}
                sx={{ padding: "0px 7px" }}
              >
                <b>{row.newMessages}</b>
              </Badge>
            </b>
          ) : (
            <>{row.name}</>
          )}
        </Anchor>
      </td>
      <td>{row.author}</td>
      <td>{row.createdAt.toLocaleDateString(i18n.language, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      })}</td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder={t("messages:search_message")}
        mb="md"
        icon={<Search size={14} />}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        striped
        sx={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              {t("messages:message_subject")}
            </Th>
            <Th
              sorted={sortBy === "author"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("author")}
            >
              {t("messages:message_author")}
            </Th>
            <Th
              sorted={sortBy === "createdAt"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("createdAt")}
            >
              {t("messages:message_time")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  {t("messages:no_results")}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
