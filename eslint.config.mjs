// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  solid: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  rules: {
    'ts/strict-boolean-expressions': 'off',
  },
})
