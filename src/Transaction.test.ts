import { random } from 'lodash'

const delay = (ms: number) =>
  new Promise((rs) => {
    setTimeout(rs, ms)
  })

test('Test loop 1M', async () => {
  let count = 0
  const cancels: (() => Promise<void>)[] = []

  for (let i = 0; i < 1000000; i++) {
    let isCancelled = false
    delay(random(400, 600)).then(() => {
      if (isCancelled) return
      count++
    })
    cancels.push(async () => {
      await delay(random(1, 10))
      isCancelled = true
    })
  }

  const promises: any[] = []
  for (let i = 0; i < 1000000; i++) {
    promises.push(cancels[i]())
  }
  await Promise.all(promises)
  await delay(2000)
  console.log('count', count)

  expect(count).toBeGreaterThan(0)
})
