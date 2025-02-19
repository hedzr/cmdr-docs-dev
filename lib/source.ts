import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { i18n } from "./i18n";
import { createOpenAPI } from "fumadocs-openapi/server";

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
    i18n: i18n
});
export const openapi = createOpenAPI();
