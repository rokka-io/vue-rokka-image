import { srcset, generalProps } from '../src/helpers'

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
  organization: 'org',
  hash: '1234',
}

const preUrl = `https://${defaultProperties.organization}.rokka.io`
const postUrlDefault = `/${defaultProperties.hash}/image.jpg`

const testUrl = (properties, urlPart, postfix, postUrl = postUrlDefault) => {
  const parts = urlPart.map((value, key) => {
    return `${preUrl}${value}${postUrl} ${postfix[key]}`
  })

  expect(srcset(properties)).toBe(parts.join(', '))
}
test('default properties', () => {
  expect(srcset({ $props: defaultProperties, $parent: {} })).toBe(null)
})

test('default properties with zero length postfix', () => {
  expect(
    srcset({ $props: { ...defaultProperties, postfix: [] }, $parent: {} })
  ).toBe(null)
})

test('default postfix 1x', () => {
  testUrl(
    {
      $props: { ...defaultProperties, postfix: ['1x'] },
      $parent: {},
    },
    ['/dynamic'],
    ['1x']
  )
})

test('default postfix 1x 2x', () => {
  testUrl(
    {
      $props: { ...defaultProperties, postfix: ['1x', '2x'] },
      $parent: {},
    },
    ['/dynamic', '/dynamic'],
    ['1x', '2x']
  )
})

test('default postfix 1x 2x with dpr', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        postfix: ['1x', '2x'],
        options: [{ dpr: 1 }, { dpr: 2 }],
      },
      $parent: {},
    },
    ['/dynamic/o-dpr-1', '/dynamic/o-dpr-2'],
    ['1x', '2x']
  )
})

test('default postfix 1x 2x with dpr and operations', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        postfix: ['1x', '2x'],
        options: [{ dpr: 1 }, { dpr: 2 }],
        operations: [{ name: 'resize', options: { width: 200 } }],
      },
      $parent: {},
    },
    ['/dynamic/resize-width-200/o-dpr-1', '/dynamic/resize-width-200/o-dpr-2'],
    ['1x', '2x']
  )
})

test('default postfix 1x 2x with dpr and different operations', () => {
  testUrl(
    {
      $props: {
        ...defaultProperties,
        postfix: ['1x', '2x'],
        options: [{}, { af: 1 }],
        operations: [
          [{ name: 'resize', options: { width: 200 } }],
          [{ name: 'resize', options: { width: 400 } }],
        ],
      },
      $parent: {},
    },
    ['/dynamic/resize-width-200', '/dynamic/resize-width-400/o-af-1'],
    ['1x', '2x']
  )
})

/** parent stuff **/

test('postfix 1x from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x'],
        },
      },
      $props: {
        ...generalDefaults,
        operations: [{ name: 'resize', options: { width: 200 } }],
      },
    },
    ['/dynamic/resize-width-200'],
    ['1x']
  )
})

test('postfix 1x and operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
        },
      },
      $props: {
        ...generalDefaults,
      },
    },
    ['/dynamic/resize-width-200'],
    ['1x']
  )
})

test('postfix 1x, 2x and operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
          options: [{ af: true }, { af: true, dpr: 2 }],
        },
      },
      $props: {
        ...generalDefaults,
      },
    },
    [
      '/dynamic/resize-width-200/o-af-true',
      '/dynamic/resize-width-200/o-af-true-dpr-2',
    ],
    ['1x', '2x']
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
      },
    },
    [
      '/dynamic/resize-width-200/o-af-true',
      '/dynamic/resize-width-400/o-af-true',
    ],
    ['1x', '2x']
  )
})

test('postfix 1x, 2x and overwrite operations from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [
            { name: 'resize', options: { width: 200 } },
            { name: 'crop', options: { width: 200 } },
          ],
          options: [{ af: true }, { af: true, dpr: 2 }],
        },
      },
      $props: {
        ...generalDefaults,
        operations: [{ name: 'resize', options: { width: 300 } }],
      },
    },
    [
      '/dynamic/resize-width-300/o-af-true',
      '/dynamic/resize-width-300/o-af-true-dpr-2',
    ],
    ['1x', '2x']
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
        operations: [
          [{ name: 'resize', options: { width: 300 } }],
          [{ name: 'resize', options: { width: 600 } }],
        ],
      },
    },
    [
      '/dynamic/resize-width-300/o-af-true',
      '/dynamic/resize-width-600/o-af-true',
    ],
    ['1x', '2x']
  )
})

test('postfix 1x, 2x and different one operation from parent', () => {
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
        operations: [[{ name: 'resize', options: { width: 300 } }]],
      },
    },
    ['/dynamic/resize-width-300/o-af-true', '/dynamic/o-af-true'],
    ['1x', '2x']
  )
})

test('postfix 1x, 2x and overwrite both operations at once with single array from parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
          options: [{ af: true }, { af: true, dpr: 2 }],
        },
      },
      $props: {
        ...generalDefaults,
        operations: [{ name: 'resize', options: { width: 300 } }],
      },
    },
    [
      '/dynamic/resize-width-300/o-af-true',
      '/dynamic/resize-width-300/o-af-true-dpr-2',
    ],
    ['1x', '2x']
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
    ['/dynamic/resize-width-200', '/dynamic/resize-width-200/o-dpr-2'],
    ['1x', '2x']
  )
})

test('postfix 1x 2x overwrite options with just one option in parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
          options: { af: true },
        },
      },
      $props: {
        ...generalDefaults,
        options: [{}, { dpr: 2 }],
      },
    },
    ['/dynamic/resize-width-200', '/dynamic/resize-width-200/o-dpr-2'],
    ['1x', '2x']
  )
})

test('postfix 1x 2x variales  with just one variable in parent', () => {
  testUrl(
    {
      $parent: {
        $data: { isRokkaPictureTag: true },
        $props: {
          ...defaultProperties,
          postfix: ['1x', '2x'],
          operations: [{ name: 'resize', options: { width: 200 } }],
          options: [{}, { dpr: 2 }],
          variables: { width: 200, height: 200 },
        },
      },
      $props: {
        ...generalDefaults,
        variables: [{ width: 300 }, { width: 200, height: 100 }],
      },
    },
    [
      '/dynamic/resize-width-200/v-width-300',
      '/dynamic/resize-width-200/v-width-200-height-100/o-dpr-2',
    ],
    ['1x', '2x']
  )
})
