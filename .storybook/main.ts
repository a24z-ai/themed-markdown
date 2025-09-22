import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../industryMarkdown/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../industryTheme/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: async (config) => {
    // Add any custom webpack configuration here
    return config;
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};

export default config;