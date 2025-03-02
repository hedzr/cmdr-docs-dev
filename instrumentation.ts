import getConfig from "next/config";

export async function register() {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
    console.log(` + +++ [inspectInfo] __dirname: ${serverRuntimeConfig.PROJECT_ROOT}, serverRuntimeConfig: `,
        serverRuntimeConfig, ' publicRuntimeConfig: ', publicRuntimeConfig);
}