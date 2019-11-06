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

const defaultProperties = {
  ...generalDefaults,
  organization: 'testorg',
  hash: '1234',
}

const preUrl = `https://${defaultProperties.organization}.rokka.io`
const postUrlDefault = `/${defaultProperties.hash}/image.jpg`

const testUrl = (properties, urlPart, postUrl = postUrlDefault) => {
  expect(src(properties)).toBe(`${preUrl}${urlPart}${postUrl}`)
}
test('default properties', () => {
  testUrl({ $props: defaultProperties, $parent: {} }, '/dynamic')
})

test('default with dpr', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        options: { dpr: 1 },
      },
      $parent: {},
    },
    '/dynamic/o-dpr-1'
  )
})

test('default with dpr and operations', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        options: { dpr: 1 },
        operations: [{ name: 'resize', options: { width: 200 } }],
      },
      $parent: {},
    },
    '/dynamic/resize-width-200/o-dpr-1'
  )
})

test('default with dpr and operations,variables,options', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        options: { dpr: 1 },
        operations: [
          { name: 'resize', options: { width: 200 } },
          { name: 'crop', expressions: { width: '$width}' } },
          { name: 'grayscale' },
        ],
        variables: { width: 200 },
      },
      $parent: {},
    },
    '/dynamic/resize-width-200--crop-width-%5B%24width%7D%5D--grayscale/v-width-200/o-dpr-1'
  )
})

/** parent stuff **/

test(' overwrite filename  and format from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          operations: [{ name: 'resize', options: { width: 200 } }],
        },
      },
      $props: {
        ...generalDefaults,
        filename: 'hello',
        format: 'png',
      },
    },
    ['/dynamic/resize-width-200'],
    '/1234/hello.png'
  )
})

test(' operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          operations: [{ name: 'resize', options: { width: 200 } }],
        },
      },
      $props: {
        ...generalDefaults,
      },
    },
    ['/dynamic/resize-width-200']
  )
})

test(' overwrite operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          operations: [
            { name: 'resize', options: { width: 200 } },
            { name: 'crop', options: { width: 200 } },
          ],
          options: { af: true },
        },
      },
      $props: {
        ...generalDefaults,
        operations: [{ name: 'resize', options: { width: 300 } }],
      },
    },
    '/dynamic/resize-width-300/o-af-true'
  )
})

test(' variables from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          operations: [{ name: 'resize', options: { width: 200 } }],
          variables: { width: 100 },
        },
      },
      $props: {
        ...generalDefaults,
      },
    },
    '/dynamic/resize-width-200/v-width-100'
  )
})

test(' overwrite variables from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          operations: [{ name: 'resize', options: { width: 200 } }],
          variables: { width: 100 },
        },
      },
      $props: {
        ...generalDefaults,
        variables: { width: 200, height: 300 },
      },
    },
    '/dynamic/resize-width-200/v-width-200-height-300'
  )
})
test('postfix 1x, 2x and different operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [
            [{ name: 'resize', options: { width: 200 } }],
            [{ name: 'resize', options: { width: 400 } }],
          ],
          options: [{ af: true }, { af: true }],
        },
      },
      $props: {
        ...generalDefaults,
        operations: [{ name: 'resize', options: { width: 300 } }],
      },
    },
    '/dynamic/resize-width-300/o-af-true'
  )
})

test('postfix 1x 2x overwrite options', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
          options: [{ af: true }, { af: true }],
        },
      },
      $props: {
        ...generalDefaults,
        options: [{}, { dpr: 2 }],
      },
    },
    '/dynamic/resize-width-200'
  )
})

test('postfix 1x, 2x in parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [
            [{ name: 'resize', options: { width: 200 } }],
            [{ name: 'resize', options: { width: 400 } }],
          ],
          options: [{ af: true }, { af: true }],
        },
      },
      $props: {
        ...generalDefaults,
      },
    },
    '/dynamic/resize-width-200/o-af-true'
  )
})
