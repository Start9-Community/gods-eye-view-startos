import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'gods-eye-view',
  title: "God's Eye View",
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/gods-eye-view-startos',
  upstreamRepo: 'https://github.com/bilawalsidhu/gods-eye-view',
  marketingUrl:
    'https://www.spatialintelligence.ai/p/i-open-sourced-gods-eye-view',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    'gods-eye-view': {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
