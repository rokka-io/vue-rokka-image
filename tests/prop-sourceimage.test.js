import { src, generalProps } from '../src/helpers'

const generalDefaults = {}
Object.keys(generalProps).forEach(key => {
  const prop = generalProps[key]
  if (prop.default instanceof Function) {
    generalDefaults[key] = prop.default()
  } else {
    generalDefaults[key] = prop.default
  }
})

const sourceimage = {
  organization: 'testorg',
  hash: '123456789012345',
  short_hash: '1234',
  name: 'foo',
}

const defaultProperties = {
  sourceimage,
}

const preUrlDefault = `https://${
  defaultProperties.sourceimage.organization
}.rokka.io`
const postUrlDefault = `/${defaultProperties.sourceimage.short_hash}/foo.jpg`

const testUrl = (
  properties,
  preUrl = preUrlDefault,
  postUrl = postUrlDefault
) => {
  expect(src(properties)).toBe(`${preUrl}/dynamic${postUrl}`)
}
test('default properties', () => {
  testUrl({ $props: defaultProperties, $parent: {} })
})

test('with organization', () => {
  testUrl(
    { $props: { ...defaultProperties, organization: 'testorg2' }, $parent: {} },

    'https://testorg2.rokka.io'
  )
})

test('with hash', () => {
  testUrl(
    { $props: { ...defaultProperties, hash: '98765' }, $parent: {} },

    undefined,
    '/98765/foo.jpg'
  )
})

test('with short_hash', () => {
  testUrl(
    { $props: { ...defaultProperties, short_hash: '98765' }, $parent: {} },

    undefined,
    '/98765/foo.jpg'
  )
})

test('with short_hash and hash', () => {
  testUrl(
    {
      $props: { ...defaultProperties, hash: '8776543', short_hash: '98765' },
      $parent: {},
    },

    undefined,
    '/98765/foo.jpg'
  )
})

test('with filename', () => {
  testUrl(
    {
      $props: { ...defaultProperties, filename: 'hello' },
      $parent: {},
    },

    undefined,
    `/${defaultProperties.sourceimage.short_hash}/hello.jpg`
  )
})
