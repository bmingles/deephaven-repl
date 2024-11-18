import { setGlobalDispatcher, Agent } from 'undici'
import { getDhc } from './utils/dhcUtils.mjs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
console.log('Node.js version:', process.version)
console.log('undici version:', process.versions.undici)

setGlobalDispatcher(
  new Agent({
    allowH2: true,
  }),
)

if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = import.meta.dirname
}

const serverUrl = new URL('https://localhost:8443/')

const dhc = await getDhc(serverUrl)

const client = new dhc.CoreClient(serverUrl.href)

await client.login({
  type: dhc.CoreClient.LOGIN_TYPE_ANONYMOUS,
})

const cn = await client.getAsIdeConnection()

const session = await cn.startSession('python')

// await session.runCode('print("Hello, World!")')
try {
  await session.runCode(
    'from deephaven import time_table\n\nsimple_ticking = time_table("PT2S")\n\nsimple_ticking2 = time_table("PT2S")\n\nsimple_ticking3 = time_table("PT2S")',
  )
  console.log('Success')
} catch (e) {
  console.log(e)
}

process.exit(0)