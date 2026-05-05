export const UMAMI_ACCOUNT = {
  username: "Kenan Tomfie Bukit",
  api_key: process.env.UMAMI_API_KEY,
  base_url: "https://api.umami.is/v1/websites",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/sessions/stats",
  },
  parameters: {
    startAt: new Date().setMonth(new Date().getMonth() - 6), 
    endAt: new Date().getTime(), 
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      domain: "kenantomfie.site",
      website_id: process.env.UMAMI_WEBSITE_ID,
      umami_url:
        "https://cloud.umami.is/share/SJivRMJzILNQyf49/kenantomfie.site",
    },
  ],
};
