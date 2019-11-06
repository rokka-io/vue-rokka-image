import { rokkaUrl } from '../src/helpers'
const defaultProperties = {
  organization: 'org',
  hash: '1234',
}

const preUrl = `https://${defaultProperties.organization}.rokka.io`
const postUrlDefault = `/${defaultProperties.hash}/image.jpg`

const testUrl = (properties, urlPart, postUrl = postUrlDefault) => {
  expect(rokkaUrl(properties)).toBe(preUrl + urlPart + postUrl)
}

test('default properties', () => {
  testUrl(defaultProperties, '/dynamic')
})

test('default properties and stack', () => {
  testUrl({ ...defaultProperties, stack: 'foo' }, '/foo')
})

test('default properties and format', () => {
  testUrl({ ...defaultProperties, options: { af: 1 } }, '/dynamic/o-af-1')
})

test('default properties and filename with space', () => {
  testUrl(
    { ...defaultProperties, filename: 'foo bar' },
    '/dynamic',
    `/${defaultProperties.hash}/foo%20bar.jpg`
  )
})

test('default properties and operations', () => {
  testUrl(
    {
      ...defaultProperties,
      operations: [{ name: 'resize', options: { width: 100, height: 100 } }],
    },
    '/dynamic/resize-width-100-height-100'
  )
})

test('default properties and operations and expressions', () => {
  testUrl(
    {
      ...defaultProperties,
      operations: [
        {
          name: 'resize',
          options: { mode: 'fill' },
          expressions: { width: '$width', height: '$height' },
        },
      ],
      variables: { width: 100, height: 100 },
    },
    '/dynamic/resize-mode-fill-width-%5B%24width%5D-height-%5B%24height%5D/v-width-100-height-100'
  )
})
