const INDEXNOW_KEY = "6cf5166ec75f4b33bcf7e22ff834b5e1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolradar.com";

// IndexNow endpoints - submit to one, it shares with others
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export async function submitUrlsToIndexNow(urls: string[]): Promise<{ success: boolean; message: string }> {
  if (!urls.length) {
    return { success: false, message: "No URLs provided" };
  }

  // IndexNow accepts up to 10,000 URLs per request
  const urlList = urls.slice(0, 10000).map(url =>
    url.startsWith("http") ? url : `${SITE_URL}${url}`
  );

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    // Submit to the first endpoint (it will propagate to others)
    const response = await fetch(INDEXNOW_ENDPOINTS[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      return {
        success: true,
        message: `Successfully submitted ${urlList.length} URLs to IndexNow`
      };
    }

    const errorText = await response.text();
    return {
      success: false,
      message: `IndexNow returned ${response.status}: ${errorText}`
    };
  } catch (error) {
    return {
      success: false,
      message: `IndexNow submission failed: ${error}`
    };
  }
}

export async function submitSingleUrl(url: string): Promise<{ success: boolean; message: string }> {
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  const params = new URLSearchParams({
    url: fullUrl,
    key: INDEXNOW_KEY,
  });

  try {
    const response = await fetch(`${INDEXNOW_ENDPOINTS[0]}?${params}`);

    if (response.ok || response.status === 202) {
      return { success: true, message: `Successfully submitted ${fullUrl}` };
    }

    return {
      success: false,
      message: `IndexNow returned ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      message: `IndexNow submission failed: ${error}`
    };
  }
}
