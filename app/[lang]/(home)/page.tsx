import Link from "next/link";

export default function HomePage() {
  return (
    // <div className="flex flex-col justify-center text-center flex-1">
    //   <h1 className="text-2xl font-bold mb-4">Hello World</h1>
    //   <p>
    //     You can open{" "}
    //     <Link href="/docs" className="font-medium underline">
    //       /docs
    //     </Link>{" "}
    //     and see the documentation.
    //   </p>
    // </div>

    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{" "}
        and see the documentation.
      </p>
      Golang:
      <ul>
        <li>
          cmdr.v2 (Golang): <Link href="/docs/cmdr/v2" />
        </li>
        <li>
          store: <Link href="/docs/store" />
        </li>
        <li>
          evendeep (deepcopy): <Link href="/docs/evendeep" />
        </li>
        <li>
          logg/slog: <Link href="/docs/logg" />
        </li>
        <li>
          is: <Link href="/docs/store" />
        </li>
        <li>...</li>
      </ul>
      C++:
      <ul>
        <li>
          cmdr-cxx: <Link href="/docs/cmdr-cxx" />
        </li>
        <li>
          trie-cxx: <Link href="/docs/trie-cxx" />
        </li>
        <li>...</li>
      </ul>
    </main>
  );
}

// // "use client";

// // import Link from 'next/link';
// // import { Link, useParams } from 'react-router';

// // import Link from "next/link";
// // import { useParams } from "next/navigation";

// import { DynamicLink } from 'fumadocs-core/dynamic-link';

// export default function HomePage() {
//   // const { lang } = useParams();
//   return (
//     <div className="flex flex-col justify-center text-center flex-1">
//       <h1 className="text-2xl font-bold mb-4">Hello World</h1>
//       <p>
//         You can open{" "}
//         <DynamicLink href="/[lang]/docs" className="font-medium underline">
//           /docs
//         </DynamicLink>{" "}
//         and see the documentation.
//       </p>
//     </div>
//   );
// }
