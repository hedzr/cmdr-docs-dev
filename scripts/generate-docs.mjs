import * as OpenAPI from "fumadocs-openapi";
import {rimraf, rimrafSync} from "rimraf";

const out = "./content/docs/(api)";
// './content/docs/openapi'

// // clean generated files
// rimrafSync(out, {
//   filter(v) {
//     return !v.endsWith('index.mdx') && !v.endsWith('meta.json');
//   },
// });
//
// void OpenAPI.generateFiles({
//   // input files
//   input: ["./openapi.json"],
//   output: out,
//   groupBy: "tag",
// });

export async function generateDocs() {
  // clean generated files
  await rimraf(out, {
    filter(v) {
      return !v.endsWith("index.mdx") && !v.endsWith("meta.json");
    },
  });

  // const demoRegex =
  //   /^---type-table-demo---\r?\n(?<content>.+)\r?\n---end---$/gm;

  await Promise.all([
    // OpenAPI.generateFiles({
    //   input: ["./openapi.json"],
    //   output: out,
    //   // input: ['./museum.yaml'],
    //   // output: './content/docs/openapi',
    //   // per: "operation",
    //   groupBy: "tag",
    // }),

    // Typescript.generateFiles({
    //   input: ['./content/docs/**/*.model.mdx'],
    //   transformOutput(_, content) {
    //     return content.replace(demoRegex, '---type-table---\n$1\n---end---');
    //   },
    //   output: (file) =>
    //     path.resolve(
    //       path.dirname(file),
    //       `${path.basename(file).split('.')[0]}.mdx`,
    //     ),
    // }),
  ]);
}
