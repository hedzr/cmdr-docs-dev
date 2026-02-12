
export const baseUrl =
  (process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') &&
    process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' &&
      (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL)
      ? new URL(`https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL}`)
      : new URL(process.env.LOCAL_SIMULATE_PRODUCT_URL || 'http://localhost:3000');

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "hedzr",
  repo: "cmdr-docs-dev",
  branch: "master",
  site: baseUrl, // "https://docs.hedzr.com",
  feedbackCategory: 'Feedback',
  feedbackSection: 'hzDocs',
};

export const siteConfig = {
  title: 'hzDocs',
  desc: "The Documentations and News of hedzr's Open Source Projects",
  url: baseUrl,
  // blog: {
  //   md: {
  //     width: '86%',
  //   },
  //   lg: {
  //     width: '79%',
  //   },
  //   xl: {
  //     width: '73%',
  //   },
  //   'xl2': {
  //     width: '69%',
  //   }
  // }
  blog: {
    title: 'hzSomthing',
    slogan: 'All the latest blogs and news, straight from the team.',
  }
};
