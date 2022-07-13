import React, { useEffect } from 'react';
import useBuildId from '../hooks/useBuildId';

function NewUpdateAvailible() {
  const buildId = useBuildId();

  useEffect(() => {
    if (buildId && process.env.BUILD_ID && buildId !== process.env.BUILD_ID) {
      // There's a new version deployed that we need to load
      // SHOW MODAL
    }
  }, [buildId]);

  return <div>NewUpdateAvailible</div>;
}

export default NewUpdateAvailible;
