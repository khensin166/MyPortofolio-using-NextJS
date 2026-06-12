export const getPostHogData = async () => {
  const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
  const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!PROJECT_ID || !API_KEY) {
    throw new Error("PostHog credentials not configured");
  }

  const url = `https://us.i.posthog.com/api/projects/${PROJECT_ID}/query/`;
  const query = {
    query: {
      kind: "TrendsQuery",
      series: [
        { kind: "EventsNode", event: "$pageview", math: "total" }, // Total views
        { kind: "EventsNode", event: "$pageview", math: "dau" }    // Unique visitors
      ],
      dateRange: { date_from: "-6m" }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(query),
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PostHog API Error: ${errorText}`);
  }

  const data = await response.json();
  
  // Parsing into a format compatible with our charts
  const pageviewsSeries = data.results[0]; // total
  const visitorsSeries = data.results[1]; // dau (daily active users)

  let totalPageviews = 0;
  let totalVisitors = 0;

  const pageviews: any[] = [];
  const sessions: any[] = []; // Reusing this name for visitors to minimize UI refactor

  if (pageviewsSeries && pageviewsSeries.data) {
    pageviewsSeries.data.forEach((val: number, i: number) => {
      totalPageviews += val;
      pageviews.push({
        x: pageviewsSeries.labels[i],
        y: val
      });
    });
  }

  if (visitorsSeries && visitorsSeries.data) {
    visitorsSeries.data.forEach((val: number, i: number) => {
      totalVisitors += val;
      sessions.push({
        x: visitorsSeries.labels[i],
        y: val
      });
    });
  }

  return {
    pageviews,
    sessions,
    websiteStats: {
      pageviews: { value: totalPageviews },
      visitors: { value: totalVisitors },
      visits: { value: totalVisitors }, 
      countries: { value: 0 }, 
      events: { value: 0 } 
    }
  };
};
