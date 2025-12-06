// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!jose|@panva/hkdf|oauth4webapi|preact|preact-render-to-string|openid-client|next-auth|@auth/core|@auth/prisma-adapter)/"
  ]

}

module.exports = createJestConfig(config)