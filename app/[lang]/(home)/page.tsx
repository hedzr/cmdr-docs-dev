import Link from "next/link";

export default function HomePage() {
  return (
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
          cmdr.v2 (Golang): <Link href="/docs/cmdr.v2" />
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
