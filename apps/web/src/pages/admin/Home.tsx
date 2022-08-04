import { useTranslation } from "react-i18next";

const AdminHome = () => {
  const { t } = useTranslation();
  return <h1>{t("admin:home_page_title")}</h1>;
};

export default AdminHome;
