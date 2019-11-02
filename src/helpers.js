export const sanitizedFilename = fileName => {
  if (!fileName) {
    return 'image'
  }
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
  srcsetAttribute: { type: String, default: 'srcset' },
  postfix: {
    type: Array,
    default: null,
  },
  operations: {
    type: Array,
    default: () => {
      return []
    },
  },
  options: {
    type: [Object, Array],
    default: () => {
      return []
    },
  },
  variables: {
    type: [Object, Array],
    default: () => {
      return []
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
    organization,
    org: oldOrg, // for BC reasons
    stack,
    operations,
    variables,
    options,
    filename: _filename,
    name, // so that a sourceimage object can be used, it's the same as filename
    format,
    hash,
  } = props

  let org = organization
  if (!org && oldOrg) {
    org = oldOrg
  }

  let filename = _filename
  if (!filename && name) {
    filename = name
  }

  let operationsStr = null
  if (operations && operations.length) {
    operationsStr = operations
      .map(operation => {
        if (operation.options) {
          const operationOptions = flattenObject(operation.options).join('-')
          if (operationOptions) {
            return operation.name + '-' + operationOptions
          }
        }
        return operation.name
      })
      .join('--')
  }

  let variablesStr = ''
  if (variables) {
    variablesStr = flattenObject(variables).join('-')
    if (variablesStr) {
      variablesStr = 'v-' + variablesStr
    }
  }
  let optionsStr = ''
  if (options) {
    optionsStr = flattenObject(options).join('-')
    if (optionsStr) {
      optionsStr = 'o-' + optionsStr
    }
  }
  const url = [
    `${org}.rokka.io/${stack || 'dynamic'}`,
    operationsStr,
    variablesStr,
    optionsStr,
    hash,
    `${sanitizedFilename(filename)}.${format || 'jpg'}`,
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
export const mergeDeep = (targetIn, ...sourcesIn) => {
  if (!sourcesIn.length) return targetIn
  const source = Object.assign({}, sourcesIn.shift())
  const target = Object.assign({}, targetIn)

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

  return mergeDeep(target, ...sourcesIn)
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

  let parent = item.$parent
  let i = 0
  while (parent.$data && !parent.$data.isRokkaPictureTag && parent.$parent) {
    i++
    // just break after 2 levels, that's enough for the -lazy component
    // if needed, we can increase this
    if (i > 1) {
      break
    }
    parent = parent.$parent
  }
  const parrentPostfix = parent && parent.$props && parent.$props.postfix
  const parrentOperations = parent && parent.$props && parent.$props.operations
  const parrentOptions = parent && parent.$props && parent.$props.options
  const parrentVariables = parent && parent.$props && parent.$props.variables

  let postfixActual = currentPostfix
  // null === default, inherit from parent, if set, otherwise it's not set in parent or here, return null
  if (postfixActual === null) {
    if (parrentPostfix) {
      postfixActual = parrentPostfix
    } else {
      return null
    }
  }

  if (postfixActual.length === 0) {
    return null
  }

  const srcset = []
  for (let i = 0; i < postfixActual.length; i++) {
    // get the current props
    // depending if passed a obj or an array
    const postfix = postfixActual[i]

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

    let currentProps = item.$props

    if (parent.$data.isRokkaPictureTag) {
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
      currentProps = removeDefaultPropsProperties(item.$options.propsData)
    }

    if (options instanceof Array && options.length === 0) {
      options = {}
    }
    let url = rokkaUrl({
      ...parent.$props,
      ...currentProps,
      operations,
      variables,
      options,
    })

    url = encodeURI(url) + (postfix ? ' ' + postfix : '')

    srcset.push(url)
  }
  return srcset.join(', ')
}

export const removeDefaultPropsProperties = currentProps => {
  return currentProps
}
