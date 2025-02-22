import Link from "next/link";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { buttonVariants } from "@/components/ui/button";

const inter = Inter({
  subsets: ["latin"],
});

export default async function NotFound() {
  const headersList = await headers();
  const domain = headersList.get("host");
  return (
    <div>
      <div className="min-h-[99vh] px-2 py-8 flex flex-col gap-3 items-start h-screen">
        <div className="m-auto">
          <div>
            <h2 className="text-5xl font-bold">404</h2>
            <p className="text-muted-foreground">Page not found</p>
          </div>

          <p>Could not find requested resource</p>
          <pre>DOMAIN: {domain}</pre>

          {/* <Link href="/docs/">Return Docs Home</Link> */}

          <Link href="/" className={buttonVariants({})}>
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
