import path from 'path'
import fs from 'fs'
import findRoot from 'find-root'
import { Table } from 'console-table-printer'
import capitalize from 'lodash/capitalize'

export type UncoveredMode = 'lines' | 'branches' | 'functions' | 'statements'

export default async function main(mode: UncoveredMode = 'lines') {
  const rootDir = findRoot(process.cwd())
  const coverageFile = path.join(rootDir, 'coverage', 'coverage-summary.json')
  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'))
    const keys = Object.keys(coverage)

    const sortedKeys = keys.sort((a, b) => {
      const uncoveredA = coverage[a][mode].total - coverage[a][mode].covered
      const uncoveredB = coverage[b][mode].total - coverage[b][mode].covered
      return uncoveredA - uncoveredB
    })

    const lastColName = `Uncovered ${capitalize(mode)}`

    const p = new Table({
      columns: [
        { name: 'File', alignment: 'left' },
        { name: 'Stmts' },
        { name: 'Branch' },
        { name: 'Funcs' },
        { name: 'Lines' },
        { name: lastColName, alignment: 'right' },
      ],
    });
    sortedKeys.forEach((key) => {
      const record = coverage[key]
      const relativePath = path.relative(rootDir, key)
      const stmts = (record.statements.pct)
      const branch = (record.branches.pct)
      const funcs = (record.functions.pct)
      const lines = record.lines.pct
      const uncovered = record[mode].total - record[mode].covered
      // return [key, stmts, branch, funcs, decorate(lines, `${lines} | ${uncovered}`)]
      const color = record[mode].pct < 50 ? 'red' : 'green'
      p.addRow({
        File: relativePath,
        Stmts: stmts,
        Branch: branch,
        Funcs: funcs,
        Lines: lines,
        [lastColName]: (uncovered)
      }, { color })
    })

    p.printTable()
  } catch (error) {
    if (!fs.existsSync(coverageFile)) {
      console.error('Coverage file not found')
    } else {
      console.error('Error reading coverage file')
    }
    process.exit(1)
  }
}
