import { useEffect, useState } from 'react';
import { fetchBuildId } from '../data/build-id';
import useInterval from './useInterval';

function useBuildId() {
  let [buildId, setBuildId] = useState('unknown');

  useEffect(() => {
    async function handle() {
      let id = await fetchBuildId(buildId);

      if (!(id == 'development')) {
        id = id.substring(0, 7);
      }

      setBuildId(id);
    }

    handle();
  }, []);

  useInterval(async () => {
    let id = await fetchBuildId(buildId);

    if (!(id == 'development')) {
      id = id.substring(0, 7);
    }

    setBuildId(id);
  }, 30000); // 30 seconds

  return buildId;
}

export default useBuildId;
