#!/usr/bin/env tsx

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import main from '.'

(async () => {
  await yargs(hideBin(process.argv)).parse()
  await main()
})().catch(console.error)

