
export type EachRoute = {
    title: string;
    href: string;
    noLink?: true;
    items?: EachRoute[];
};

// export const availableVersions = ["v3.5.9", "v2.3.6", "v1.2.2"] as const;
export const availableVersions = ["latest", "v2.x", "v1.x"] as const;
export type Version = (typeof availableVersions)[number];
