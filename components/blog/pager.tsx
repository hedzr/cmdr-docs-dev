"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Router, withRouter } from "next/router";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ReactPaginate from "react-paginate";
import { useDebouncedCallback } from "use-debounce";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    //After the component is mounted set router event handlers
    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  //   const createPageURL = (pageNumber: number | string) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set("page", pageNumber.toString());
  //     return `${pathname}?${params.toString()}`;
  //   };
  const { push } = useRouter();
  const paginationHandler = (page: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (page.selected + 1).toString());
    push(`${pathname}?${params.toString()}`);
  };

  return (
    <ReactPaginate
      previousLabel={"<"}
      nextLabel={">"}
      breakLabel={"..."}
      //   breakClassName={"break-me"}
      activeClassName={"active"}
      containerClassName={"pagination"}
      //   subContainerClassName={"pages pagination"}
      initialPage={currentPage - 1}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={paginationHandler}
    />
    // <></>
  );
}

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder || "Search"}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
    </div>
  );
}

export const Pager = (props: {
  router: {
    pathname: any;
    query: any;
    push: (arg0: { pathname: any; query: any }) => void;
  };
  page: number;
  pagemax: number;
}): React.ReactElement => {
  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    //After the component is mounted set router event handlers
    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  const paginationHandler = (page: { selected: number }) => {
    const currentPath = props.router.pathname;
    const currentQuery = props.router.query;
    currentQuery.page = page.selected + 1;

    props.router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  if (isLoading) {
  }

  // let content;
  // if (isLoading) {
  //     content = (
  //         <div className={styles.loadWrapper}>
  //             <Spinner animation="border" role="status">
  //                 <span className="visually-hidden">Loading...</span>
  //             </Spinner>
  //         </div>
  //     )
  // } else {
  //     //Generating posts list
  //     content = (
  //         <>
  //             {props.posts.map(({ id, date, title, image, description }) => (
  //                 <Card className={styles.item}>
  //                     <Card.Img variant="top" src={image} width={360} height={215} />
  //                     <Card.Body>
  //                         <Card.Title>
  //                             <Link href={`/posts/${id}`}>
  //                                 <a>
  //                                     {title}
  //                                 </a>
  //                             </Link>
  //                         </Card.Title>
  //                         <Card.Subtitle className="mb-2 text-muted"><Date dateString={date} /></Card.Subtitle>
  //                         <Card.Text>
  //                             {description}
  //                         </Card.Text>
  //                     </Card.Body>
  //                 </Card>
  //             ))}
  //         </>
  //     );
  // }

  return (
    <ReactPaginate
      previousLabel={"<"}
      nextLabel={">"}
      breakLabel={"..."}
      breakClassName={"break-me"}
      activeClassName={"active"}
      containerClassName={"pagination"}
      // subContainerClassName={"pages pagination"}
      initialPage={props.page - 1}
      pageCount={props.pagemax}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={paginationHandler}
    />
  );
};

// Pager.getInitialProps = async ({ query }) => {
//     const page = query.page || 1; //if page empty we request the first page
//     const response = await fetch(`${server}/api/posts/${page}`)
//     const posts = await response.json()
//     return {
//         totalCount: posts.totalCount,
//         pageCount: posts.pageCount,
//         currentPage: posts.currentPage,
//         perPage: posts.perPage,
//         posts: posts.posts,
//     };
// }

// export default withRouter(Blog)
