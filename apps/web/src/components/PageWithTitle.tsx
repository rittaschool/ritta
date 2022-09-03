import { Box, Paper, Title } from "@mantine/core";
import { ReactElement } from "react";

export default function PageWithTitle({
  children,
  title,
}: {
  children: ReactElement | ReactElement[];
  title: string;
}) {
  return (
    <>
      <Paper
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingLeft: "35px",
          paddingRight: "35px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Title sx={{ fontWeight: 700, fontSize: "24px" }}>{title}</Title>
      </Paper>
      <Box sx={{ marginLeft: "16px", marginRight: "16px", marginTop: "32px" }}>
        {children}
      </Box>
    </>
  );
}
