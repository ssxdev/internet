import path from 'path'

const buildEslintCommand = (filenames: string[]) =>
  `next lint --fix --file ${filenames
    .map(f => path.relative(process.cwd(), f))
    .join(' --file ')}`

const buildPrettierCommand = (filenames: string[]) =>
  `prettier --write ${filenames
    .map(f => path.relative(process.cwd(), f))
    .join(' ')}`

const buildTypeCheckCommand = (filenames: string[]) =>
  `tsc --noEmit --skipLibCheck --project tsconfig.json ${filenames
    .map(f => path.relative(process.cwd(), f))
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [
    buildEslintCommand,
    buildPrettierCommand,
    buildTypeCheckCommand,
  ],
}
