import path from 'path'
import fs from 'fs'
import findRoot from 'find-root'
import { Table } from 'console-table-printer'

export default async function main() {
  const rootDir = findRoot(process.cwd())
  const coverageFile = path.join(rootDir, 'coverage', 'coverage-summary.json')
  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'))
    const keys = Object.keys(coverage)
    const sortedKeys = keys.sort((a, b) => {
      const uncoveredA = coverage[a].lines.total - coverage[a].lines.covered
      const uncoveredB = coverage[b].lines.total - coverage[b].lines.covered
      return uncoveredA - uncoveredB
    })

    const p = new Table({
      columns: [
        { name: 'File', alignment: 'left' },
        { name: 'Stmts' },
        { name: 'Branch' },
        { name: 'Funcs' },
        { name: 'Lines' },
        { name: 'Uncovered Line', alignment: 'right' },
      ],
    });
    sortedKeys.forEach((key) => {
      const record = coverage[key]
      const relativePath = path.relative(rootDir, key)
      const stmts = (record.statements.pct)
      const branch = (record.branches.pct)
      const funcs = (record.functions.pct)
      const lines = record.lines.pct
      const uncovered = record.lines.total - record.lines.covered
      // return [key, stmts, branch, funcs, decorate(lines, `${lines} | ${uncovered}`)]
      const color = lines < 50 ? 'red' : 'green'
      p.addRow({
        File: relativePath,
        Stmts: stmts,
        Branch: branch,
        Funcs: funcs,
        Lines: lines,
        'Uncovered Line': (uncovered)
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
