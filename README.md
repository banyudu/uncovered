# uncovered

Sort vitest coverage by uncovered lines.

This utility parses `coverage/coverage-summary.json` file and sort files by uncovered lines to help you find the most **uncovered** file.

## Usage

```bash
# in the project dir
$ npx vitest --coverage
$ npx uncovered
$ npx uncovered --mode=functions # sort by uncovered functions, valid options are lines/branches/functions/statements
```
