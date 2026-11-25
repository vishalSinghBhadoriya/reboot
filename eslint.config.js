import tseslint from 'typescript-eslint'
export default tseslint.config({ ignores: ['dist/**', '.qa/**'] }, ...tseslint.configs.recommended)
