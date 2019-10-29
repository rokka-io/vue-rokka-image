export const sanitizedFilename = fileName => {
  let newFileName = fileName
  // remove old file endings
  newFileName = newFileName.replace(/\.[^/.]{2,4}$/, '')
  // according to the rokka team only point and slash are not allowed
  newFileName = newFileName.replace(/[.\\/]/g, '-')
  return newFileName
}

export const generalProps = {
  alt: { type: String, default: null },
  title: { type: String, default: null },
  org: { type: String, default: '' },
  stack: { type: String, default: 'dynamic' },
  hash: { type: String, default: '' },
  format: { type: String, default: 'jpg' },
  filename: { type: String, default: 'image' },
  srcAttribute: { type: String, default: 'src' },
  srcAdditionalAttribute: { type: String, default: null },
  srcsetAttribute: { type: String, default: 'srcset' },
  operations: {
    type: Array,
    default: () => {
      return []
    },
  },
  options: {
    type: Object,
    default: () => {
      return {}
    },
  },
  variables: {
    type: Object,
    default: () => {
      return {}
    },
  },
}

// from an object to the rokka notation
// input
//       resize: {
//         width: 300,
//       },
//       crop: {
//         height: 200
//       }
// output
//       resize-width-300--crop-height-200
export const flattenObject = obj => {
  const toReturn = []

  Object.keys(obj).forEach(key => {
    const val = obj[key]

    // for objects we should do a recursion
    if (typeof val === 'object') {
      const flatObject = flattenObject(val)
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue
        // are we itteration over a array or object
        if (Array.isArray(flatObject)) {
          toReturn.push(`${key}-${flatObject[x]}`)
        } else {
          toReturn.push(`${key}-${x}-${flatObject[x]}`)
        }
      }
    } else {
      toReturn.push(`${key}-${val}`)
    }
  })
  return toReturn
}

export const rokkaUrl = props => {
  const {
    org,
    stack,
    // operations,
    variables,
    options,
    filename,
    format,
    hash,
  } = props

  // let operationsStr = null
  // if (operations && operations.length) {
  //   operationsStr = operations
  //     .reduce(operation => flattenObject(operation), [])
  //     .join('--')
  // }

  const variablesStr = flattenObject({ v: variables }).join('--')
  const optionsStr = flattenObject({ options }).join('--')

  const url = [
    `${org}.rokka.io/${stack}`,
    // operationsStr,
    variablesStr,
    optionsStr,
    hash,
    `${sanitizedFilename(filename)}.${format}`,
  ]
    .join('/')
    .replace(/\/{2,}/g, '/')

  return 'https://' + url
}

// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = item => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

// https://stackoverflow.com/questions/40712399/deep-merging-nested-arrays
export const mergeArraysDeep = (arr1, arr2) => {
  const unique = arr1.concat(arr2).reduce((accumulator, item) => {
    if (accumulator[item.name]) {
      accumulator[item.name] = mergeDeep(accumulator[item.name], item)
    } else {
      accumulator[item.name] = item
    }

    return accumulator
  }, {})

  return Object.keys(unique).map(function(key) {
    return unique[key]
  })
}

export const srcset = item => {
  const currentPostfix = item.postfix
  const currentOperations = item.operations
  const currentOptions = item.options
  const currentVariables = item.variables

  const parrentPostfix =
    item.$parent && item.$parent.$props && item.$parent.$props.postfix
  const parrentOperations =
    item.$parent && item.$parent.$props && item.$parent.$props.operations
  const parrentOptions =
    item.$parent && item.$parent.$props && item.$parent.$props.options
  const parrentVariables =
    item.$parent && item.$parent.$props && item.$parent.$props.variables

  let maxItems = Math.max(
    Array.isArray(currentPostfix) ? currentPostfix.length : 0,
    Array.isArray(currentOperations) ? currentOperations.length : 0,
    Array.isArray(currentOptions) ? currentOptions.length : 0,
    Array.isArray(currentVariables) ? currentVariables.length : 0
  )

  if (item.$parent.$options._componentTag === 'rokka-picture') {
    maxItems = Math.max(
      maxItems,

      Array.isArray(parrentPostfix) ? parrentPostfix.length : 0,
      Array.isArray(parrentOperations) ? parrentOperations.length : 0,
      Array.isArray(parrentOptions) ? parrentOptions.length : 0,
      Array.isArray(parrentVariables) ? parrentVariables.length : 0
    )
  }
  const srcset = []

  for (let i = 0; i < maxItems; i++) {
    // get the current props
    // depending if passed a obj or an array
    const postfix = Array.isArray(currentPostfix)
      ? currentPostfix[i]
      : currentPostfix
    let operations =
      Array.isArray(currentOperations) && Array.isArray(currentOperations[0])
        ? currentOperations[i]
        : currentOperations
    let options = Array.isArray(currentOptions)
      ? currentOptions[i]
      : currentOptions
    let variables = Array.isArray(currentVariables)
      ? currentVariables[i]
      : currentVariables

    if (item.$parent.$options._componentTag === 'rokka-picture') {
      // get the parent props
      // depending if passed a obj or an array
      const pOperations =
        Array.isArray(parrentOperations) && Array.isArray(parrentOperations[0])
          ? parrentOperations[i]
          : parrentOperations
      const pOptions = Array.isArray(parrentOptions)
        ? parrentOptions[i]
        : parrentOptions
      const pVariables = Array.isArray(parrentVariables)
        ? parrentVariables[i]
        : parrentVariables

      operations = mergeArraysDeep(pOperations, operations)
      variables = mergeDeep(pVariables, variables)
      options = mergeDeep(pOptions, options)
    }

    if (options instanceof Array && options.length === 0) {
      options = {}
    }

    let url = rokkaUrl({
      ...item.$parent.$props,
      ...item.$options.propsData,
      operations,
      variables,
      options,
    })

    url = encodeURI(url) + (postfix ? ' ' + postfix : '')

    srcset.push(url)
  }
  return srcset.join(', ')
}
