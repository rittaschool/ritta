export async function fetchBuildId(oldId: string) {
  let response = await fetch('/api/build-id');

  if (!response.ok) return oldId;

  let data = await response.json();

  if (!data) return 'offline?';

  if (!data.buildId) return oldId;

  return data.buildId;
}
