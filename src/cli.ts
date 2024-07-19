#!/usr/bin/env tsx

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import main, { UncoveredMode } from '.'

const validModes = ['lines', 'branches', 'functions', 'statements']

;(async () => {
  const argv = await yargs(hideBin(process.argv))
    .options({
      mode: {
        alias: 'm',
        choices: validModes,
        default: validModes[0],
        description: 'The coverage mode to sort by',
      },
    })
    .parse()
  const mode: UncoveredMode = (validModes.includes(argv.mode ?? '') ? argv.mode : validModes[0]) as UncoveredMode
  await main(mode)
})().catch(console.error)

