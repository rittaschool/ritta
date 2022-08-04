import useInterval from "./useInterval";
import { useState } from "react"

export default (frequency: number) => {
  const [rerenderCount, setRerenderCount] = useState(0);

  useInterval(() => {
    setRerenderCount(rerenderCount + 1);
  }, frequency);

  return rerenderCount;
};
