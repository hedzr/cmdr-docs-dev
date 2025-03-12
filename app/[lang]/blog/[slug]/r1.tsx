{
  /* <Toc>
            {tocOptions.header}
            <h3 className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Text className="size-4" />
              <I18nLabel label="toc" />
            </h3>
            <TOCScrollArea>
              {tocOptions.style === "clerk" ? (
                <ClerkTOCItems items={toc} />
              ) : (
                <TOCItems items={toc} />
              )}
            </TOCScrollArea>
            {tocOptions.footer}
          </Toc> */
}

{
  /* <div className="mt-32 w-full">
            {prev ? (
              <div className="left prev newer">
                <Link href={bundle(prev.url, prevNumber)}>
                  <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
                  Newer:
                  <p>{prev.data.title || ""}</p>
                </Link>
              </div>
            ) : (
              <></>
            )}
            {next ? (
              <div className="float-right right next older">
                <Link href={bundle(next.url, nextNumber)}>
                  <ChevronRight className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
                  Older:
                  <p>{next.data.title || ""}</p>
                </Link>
              </div>
            ) : (
              <></>
            )}
          </div> */
}

// async function BlogPageOld({
//   params,
//   searchParams,
// }: {
//   params: Promise<{
//     slug: string;
//     lang: string;
//   }>;
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   const { slug, lang } = await params;
//   const sp = await searchParams;
//   const pageNumber = Number(sp?.page || "1") || 1;
//
//   console.log(`blog p${pageNumber} - `, lang, slug, sp);
//
//   // const prms = await params;
//   // const lang = prms.lang;
//   // const sp = await searchParams;
//   // const pageNumber = Number(sp.page || prms.page) || 1;
//   const res = await getBlogForSlug(slug);
//   if (!res) {
//     console.log("not found:", res);
//     notFound();
//   }
//
//   const fm = res.frontmatter;
//
//   let tags: string[] = [];
//   let categories: string[] = [];
//   if (fm.tags) tags = Array.isArray(fm.tags) ? fm.tags : fm.tags.split(/[,; ]/);
//   if (fm.categories)
//     categories = Array.isArray(fm.categories)
//       ? fm.categories
//       : fm.categories.split(/[,; ]/);
//   // console.log(`blog page ${pageNumber} ----`);
//
//   const get = (fm: any, v: string) => {
//     return v in fm ? fm[v] : "";
//   };
//   let lma: string = get(fm, "lastModifiedAt") || get(fm, "last_modified_at");
//
//   return (
//     <article className="lg:w-[93%] md:[99%] mx-auto mb-32">
//       <div className="flex flex-col-1 gap-x-3">
//         <Link
//           className={buttonVariants1({
//             variant: "link",
//             className: "!mx-0 !px-0 mb-7 !-ml-1 ",
//           })}
//           href="/blog"
//         >
//           <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to List
//         </Link>
//         <span className="inline-flex items-center justify-center text-sm font-medium mr-1.5 h-10 px-4 py-2 !mx-0 !px-0 mb-7 !-ml-1">
//           {" | "}
//         </span>
//         <Link
//           className={buttonVariants1({
//             variant: "secondary",
//             className: "!mx-0 !px-0 mb-7 !-ml-1 ",
//           })}
//           href="/"
//         >
//           Home
//         </Link>
//       </div>
//       <div className="flex flex-col gap-3 pb-7 w-full border-b mb-4">
//         <p className="text-muted-foreground text-sm blog-date">
//           {formatDate(fm.date, lang)}
//         </p>
//         <h1
//           className={`sm:text-4xl text-3xl font-extrabold blog-title ${fm.draft ? "line-through" : ""}`}
//         >
//           {fm.title}
//           {fm.draft ? (
//             <span className="align-top capcapitalize italic text-sm font-medium text-zink-600/76">
//               draft
//             </span>
//           ) : (
//             <></>
//           )}
//         </h1>
//         <div className="mt-6 flex flex-col gap-3">
//           <p className="text-sm text-muted-foreground">Posted by</p>
//           <div className="blog-authors">
//             {fm.authors ? (
//               <AuthorCards authors={fm.authors} />
//             ) : fm.author ? (
//               <AuthorCard author={fm.author} />
//             ) : (
//               <AuthorCard
//                 author={{
//                   username: "hedzr",
//                   avatar: "",
//                   handle: "",
//                   handleUrl: "",
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="blog-content !w-full">
//         <Typography>{res.content}</Typography>
//
//         <div className="mt-4">
//           <div id="blog-tail-row">
//             <div id="blog-categories" className="inline mr-4">
//               <div className="inline -m-1">
//                 {categories.map((it) => {
//                   return (
//                     <span
//                       className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-zinc-500"
//                       key={it}
//                     >
//                       {it}
//                     </span>
//                   );
//                 })}
//               </div>
//             </div>
//             <div id="blog-tags" className="inline mr-4">
//               {tags.map((it) => {
//                 return (
//                   <Link
//                     href={`/${lang}/blog/?query=%23${it}&page=${pageNumber}`}
//                     className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
//                     key={it}
//                   >
//                     {it}
//                   </Link>
//                 );
//               })}
//             </div>
//             <div id="last-modified" className="my-4 text-sm text-zinc-400">
//               Last Updated At: {lma}
//             </div>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }
