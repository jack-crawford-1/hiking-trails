export async function fetchDocTracks() {
  try {
    const response = await fetch("/api/tracks");

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      throw new Error(`Failed to fetch tracks: ${response.status}`);
    }

    const data = await response.json();

    return Array.isArray(data) ? data : data.items || [];
  } catch (error) {
    console.error("fetchDocTracks() error:", error);
    return [];
  }
}
