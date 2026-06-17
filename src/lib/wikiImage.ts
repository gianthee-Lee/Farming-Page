export async function fetchWikipediaImage(query: string): Promise<string | null> {
  try {
    // 1. Try exact title match
    let url = `https://ko.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(query)}&format=json&pithumbsize=500`;
    let res = await fetch(url);
    let data = await res.json();
    let pages = data.query?.pages;
    
    let pageId = pages ? Object.keys(pages)[0] : '-1';
    if (pageId !== '-1' && pages[pageId]?.thumbnail?.source) {
      return pages[pageId].thumbnail.source;
    }

    // 2. Fallback to search if exact match has no image
    url = `https://ko.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&pithumbsize=500&format=json`;
    res = await fetch(url);
    data = await res.json();
    pages = data.query?.pages;

    if (!pages) return null;

    // Find the first page that has a thumbnail
    for (const key of Object.keys(pages)) {
      if (pages[key]?.thumbnail?.source) {
        return pages[key].thumbnail.source;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch Wikipedia image:', error);
    return null;
  }
}
