import { PropsWithChildren } from "react";

// used in blog/
// see https://github.com/tailwindlabs/tailwindcss-typography
// and https://play.tailwindcss.com/uj1vGACRJA?layout=preview
export function Typography({ children }: PropsWithChildren) {
  const base = "zinc";
  const ref = "neutral";
  return (
    <article
      className={`prose prose-lg md:prose-xl lg:prose-2xl prose-${base} dark:prose-invert prose-code:font-code dark:prose-code:bg-${ref}-900 dark:prose-pre:bg-${ref}-900 prose-code:bg-${ref}-100 prose-pre:bg-${ref}-100 prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-${base}-300 prose-code:text-${ref}-700 prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none !min-w-full prose-img:rounded-md prose-img:border`}
    >
      {children}
    </article>
  );
}
