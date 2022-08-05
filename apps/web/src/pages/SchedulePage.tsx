import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageWithTitle from "../components/PageWithTitle"
import Schedule from "../components/schedule/Schedule";
import { unixSinceMidnight } from "../utils/timeUtils";

export default () => {
  const { t } = useTranslation();
  return <PageWithTitle title={t("navigation:schedule")}>
    <Schedule
      minStartTime={unixSinceMidnight(new Date().setHours(7, 0))}
      minEndTime={unixSinceMidnight(new Date().setHours(16, 0))}
    />
  </PageWithTitle>;
};
