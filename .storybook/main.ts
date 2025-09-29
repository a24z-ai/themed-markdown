import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../industryMarkdown/**/*.stories.@(js|jsx|mjs|ts|tsx)',
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
    if (config.resolve) {
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve(__dirname, '..'),
      ];
      config.resolve.alias = {
        ...config.resolve.alias,
        '@a24z/industry-theme': path.resolve(__dirname, '../packages/industry-theme/src'),
        '@a24z/markdown-utils': path.resolve(__dirname, '../packages/markdown-utils/src'),
      };
    }
    return config;
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};

export default config;