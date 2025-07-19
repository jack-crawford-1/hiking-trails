export async function fetchDocTracks() {
  try {
    const response = await fetch("/api/tracks");

    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
