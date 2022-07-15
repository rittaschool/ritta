import { Center, Loader, Space, Text } from "@mantine/core";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";

function LogOut() {
  const { t } = useTranslation();
  const { logOut } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logOut();
      navigate("/auth/login");
    })();
  }, []);

  return (
    <>
      <Text size="sm" align="center" mt={5}>
        {t("auth:logging_out")}
      </Text>
      <Space h="md" />
      <Center>
        <Loader color="teal" />
      </Center>
    </>
  );
}

export default LogOut;
