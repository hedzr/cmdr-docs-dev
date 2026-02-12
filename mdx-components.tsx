import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
// import { FeedbackBlock } from "@/components/feedback/client";
// import { onBlockFeedbackAction } from "./lib/github";
import { Mermaid } from "@/components/mdx/mermaid";
import * as Twoslash from "fumadocs-twoslash/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { File, Files, Folder } from "@/components/mdx/files";
import { InlineTOC } from "@/components/mdx/inline-toc";
import { Step, Steps } from "./components/mdx/steps";
import * as TabsComponents from "fumadocs-ui/components/tabs";
// import { Callout } from "fumadocs-ui/components/callout";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // FeedbackBlock: (props) => (
    //   <FeedbackBlock {...props} onSendAction={onBlockFeedbackAction}>
    //     {children}
    //   </FeedbackBlock>
    // ),

    Accordions,
    Accordion,
    // Callout,
    File,
    Files,
    Folder,
    Mermaid,
    InlineTOC,
    Steps,
    Step,
    TypeTable,

    ...TabsComponents,
    ...Twoslash,
    ...components,
  };
}
