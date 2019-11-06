import { mount } from '@vue/test-utils'
import Img from '../src/Img'

// Now mount the component and you have the wrapper
let wrapper = mount(Img, {
  propsData: {
    organization: 'testorg',
    hash: '1234',
  },
})

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Img)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain(
      '<img src="https://testorg.rokka.io/dynamic/1234/image.jpg" ' +
        'class="rokka--attr-src">'
    )
  })

  it('set postfix/srcset', () => {
    wrapper.setProps({
      postfix: ['1x', '2x'],
      options: [{ af: 1 }, { af: 1, dpr: 2 }],
    })
    expect(wrapper.html()).toContain(
      '<img src="https://testorg.rokka.io/dynamic/o-af-1/1234/image.jpg" ' +
        'class="rokka--attr-src" ' +
        'srcset="https://testorg.rokka.io/dynamic/o-af-1/1234/image.jpg 1x, ' +
        'https://testorg.rokka.io/dynamic/o-af-1-dpr-2/1234/image.jpg 2x"' +
        '>'
    )
  })

  it('set postfix/srcset/operations/variables', () => {
    wrapper.setProps({
      postfix: ['1x', '2x'],
      options: [{ af: 1 }, { af: 1, dpr: 2 }],
      operations: [
        {
          name: 'resize',
          options: { width: 100 },
          expressions: { height: '$height' },
        },
        {
          name: 'crop',
          options: { width: 200 },
          expressions: { height: '$height * 2' },
        },
      ],
      variables: { height: 200 },
    })
    expect(wrapper.html()).toContain(
      '<img ' +
        'src="https://testorg.rokka.io/dynamic/resize-width-100-height-%5B%24height%5D--crop-width-200-height-%5B%24height%20*%202%5D/v-height-200/o-af-1/1234/image.jpg" ' +
        'class="rokka--attr-src" ' +
        'srcset="https://testorg.rokka.io/dynamic/resize-width-100-height-%5B%24height%5D--crop-width-200-height-%5B%24height%20*%202%5D/v-height-200/o-af-1/1234/image.jpg 1x, ' +
        'https://testorg.rokka.io/dynamic/resize-width-100-height-%5B%24height%5D--crop-width-200-height-%5B%24height%20*%202%5D/v-height-200/o-af-1-dpr-2/1234/image.jpg 2x"' +
        '>'
    )
  })
})

describe('Component srcAttribute', () => {
  const wrapperSrcAttribute = mount(Img, {
    propsData: {
      organization: 'testorg',
      hash: '1234',
    },
  })
  it('srcAttribute', () => {
    wrapperSrcAttribute.setProps({
      srcAttribute: 'data-src',
      stack: 'teststack',
    })
    expect(wrapperSrcAttribute.isEmpty()).toBe(true)
    expect(wrapperSrcAttribute.is('img')).toBe(true)
    expect(wrapperSrcAttribute.attributes('class')).toBe('rokka--attr-data-src')
    expect(wrapperSrcAttribute.attributes('data-src')).toBe(
      'https://testorg.rokka.io/teststack/1234/image.jpg'
    )
    expect(wrapperSrcAttribute.attributes('src')).toBe(undefined)

    expect(wrapperSrcAttribute.html()).toContain(
      '<img class="rokka--attr-data-src" data-src="https://testorg.rokka.io/teststack/1234/image.jpg">'
    )
  })

  it('srcAdditionalAttribute', () => {
    wrapperSrcAttribute.setProps({
      srcAttribute: 'data-src',
      srcAdditionalAttribute: 'src',
    })
    expect(wrapperSrcAttribute.isEmpty()).toBe(true)
    expect(wrapperSrcAttribute.is('img')).toBe(true)
    expect(wrapperSrcAttribute.attributes('class')).toBe('rokka--attr-data-src')
    expect(wrapperSrcAttribute.attributes('data-src')).toBe(
      'https://testorg.rokka.io/teststack/1234/image.jpg'
    )
    expect(wrapperSrcAttribute.attributes('src')).toBe(
      'https://testorg.rokka.io/teststack/1234/image.jpg'
    )

    expect(wrapperSrcAttribute.html()).toContain(
      '<img class="rokka--attr-data-src" ' +
        'data-src="https://testorg.rokka.io/teststack/1234/image.jpg" ' +
        'src="https://testorg.rokka.io/teststack/1234/image.jpg">'
    )
  })

  it('srcAdditionalAttribute with srcAdditional', () => {
    wrapperSrcAttribute.setProps({
      srcAttribute: 'data-src',
      srcAdditionalAttribute: 'src',
      srcAdditional: '/loader.svg',
    })
    expect(wrapperSrcAttribute.isEmpty()).toBe(true)
    expect(wrapperSrcAttribute.is('img')).toBe(true)
    expect(wrapperSrcAttribute.attributes('class')).toBe('rokka--attr-data-src')
    expect(wrapperSrcAttribute.attributes('data-src')).toBe(
      'https://testorg.rokka.io/teststack/1234/image.jpg'
    )
    expect(wrapperSrcAttribute.attributes('src')).toBe('/loader.svg')

    expect(wrapperSrcAttribute.html()).toContain(
      '<img class="rokka--attr-data-src" ' +
        'data-src="https://testorg.rokka.io/teststack/1234/image.jpg" ' +
        'src="/loader.svg">'
    )
  })
})
