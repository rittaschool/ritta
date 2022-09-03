import { useTranslation } from "react-i18next";
import PageWithTitle from "../components/PageWithTitle";

export default () => {
  const { t } = useTranslation();
  return <PageWithTitle title={t("navigation:settings")}>
    <h2>Settings placeholder</h2>
  </PageWithTitle>;
}
