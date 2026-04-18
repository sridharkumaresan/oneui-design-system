/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs)",
    "../../../packages/*/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../packages/organisms/*/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: true
  },
  viteFinal: async (viteConfig) => {
    const existingBuild = viteConfig.build ?? {};
    const existingRollupOptions = existingBuild.rollupOptions ?? {};
    const existingOnWarn = existingRollupOptions.onwarn;

    return {
      ...viteConfig,
      build: {
        ...existingBuild,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          ...existingRollupOptions,
          onwarn(warning, warn) {
            if (warning.code === "MODULE_LEVEL_DIRECTIVE" || warning.code === "EVAL") {
              return;
            }

            if (typeof existingOnWarn === "function") {
              existingOnWarn(warning, warn);
              return;
            }

            warn(warning);
          }
        }
      }
    };
  }
};

export default config;
