// app/providers.jsx
'use client'

import posthog from 'posthog-js'
import {PostHogProvider as PHProvider} from 'posthog-js/react'
import {useEffect} from 'react'
import {ReactNode} from "react";
import PostHogPageView from "@/components/ui/postdog-pageview";

/**
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 * @see https://us.posthog.com/project/130354/onboarding/web_analytics?step=install
 * @example
 * // app/layout.jsx
 * import './globals.css'
 * import { PostHogProvider } from './providers'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <PostHogProvider>
 *           {children}
 *         </PostHogProvider>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function PostHogProvider({children}: { children: ReactNode }): ReactNode {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY)
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                person_profiles: 'always', // 'identified_only', // or 'always' to create profiles for anonymous users as well
            })
    }, [])

    return (
        <PHProvider client={posthog}><PostHogPageView />
            {children}
        </PHProvider>
    )
}