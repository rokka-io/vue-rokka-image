export const sanitizedFilename = fileName => {
  if (!fileName) {
    return 'image'
  }
  let newFileName = fileName
  // remove old file endings
  newFileName = newFileName.replace(/\.[^/.]{2,4}$/, '')
  // according to the rokka team only point and slash are not allowed
  newFileName = newFileName.replace(/[.\\/]/g, '-')
  return encodeURIComponent(newFileName)
}

export const generalProps = {
  alt: { type: String, default: null },
  title: { type: String, default: null },
  org: { type: String, default: '' },
  stack: { type: String, default: 'dynamic' },
  hash: { type: String, default: '' },
  format: { type: String, default: 'jpg' },
  filename: { type: String, default: '' },
  sourceimage: { type: Object, default: () => {} },
  srcAttribute: { type: String, default: 'src' },
  srcsetAttribute: { type: String, default: 'srcset' },
  postfix: {
    type: Array,
    default: null,
  },
  operations: {
    type: Array,
    default: () => {
      return null
    },
  },
  options: {
    type: [Object, Array],
    default: () => {
      return null
    },
  },
  variables: {
    type: [Object, Array],
    default: () => {
      return null
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
  if (obj === null) {
    return ''
  }
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

export const rokkaUrl = _props => {
  let props = _props
  // merge sourceimage properties into prop, in case that's given.
  // Useful for less code, when one gets sourceimage objects from rokka.js
  if (props.sourceimage) {
    for (const key of Object.keys(props.sourceimage)) {
      if (!props[key]) {
        props[key] = props.sourceimage[key]
      }
    }
    delete props.sourceimage
  }
  const {
    organization,
    org: oldOrg, // for BC reasons
    stack,
    operations,
    variables,
    options,
    filename: _filename,
    name, // so that a sourceimage object can be used, it's the same as filename, filename has precedence
    format,
    hash,
    short_hash,
  } = props

  let org = organization
  if (!org && oldOrg) {
    org = oldOrg
  }

  let filename = _filename
  if (!filename && name) {
    filename = name
  }
  if (!filename) {
    filename = 'image'
  }

  let operationsStr = null
  if (operations && operations.length) {
    operationsStr = operations
      .map(operation => {
        let operationOptions = {}
        if (operation.options) {
          operationOptions = Object.assign(operationOptions, operation.options)
        }
        if (operation.expressions) {
          Object.keys(operation.expressions).forEach(key => {
            operationOptions[key] = encodeURIComponent(
              '[' + operation.expressions[key] + ']'
            )
          })
        }
        if (operationOptions) {
          const operationOptionsStr = flattenObject(operationOptions).join('-')
          if (operationOptionsStr) {
            return operation.name + '-' + operationOptionsStr
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
    short_hash || hash, //use short_hash if given
    `${sanitizedFilename(filename)}.${format || 'jpg'}`,
  ]
    .join('/')
    .replace(/\/{2,}/g, '/')

  return 'https://' + url
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = item => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export const srcset = item => {
  const currentPostfix = item.$props.postfix

  const parent = getParent(item)
  const parentPostfix = parent && parent.$props && parent.$props.postfix

  let postfixActual = currentPostfix
  // null === default, inherit from parentoperations, if set, otherwise it's not set in parentoperations or here, return null
  if (postfixActual === null) {
    if (parentPostfix) {
      postfixActual = parentPostfix
    } else {
      return null
    }
  }
  if (postfixActual.length === 0) {
    return null
  }
  const srcset = []
  for (let i = 0; i < postfixActual.length; i++) {
    const postfix = postfixActual[i]

    const url = src(item, i, parent) + (postfix ? ' ' + postfix : '')

    srcset.push(url)
  }
  return srcset.join(', ')
}

export const src = (item, index = 0, parentIn = null) => {
  let parent = parentIn
  if (parentIn === null) {
    parent = getParent(item)
  }
  const currentOperations = item.$props.operations
  const currentOptions = item.$props.options
  const currentVariables = item.$props.variables
  const parentOperations = parent && parent.$props && parent.$props.operations
  const parentOptions = parent && parent.$props && parent.$props.options
  const parentVariables = parent && parent.$props && parent.$props.variables

  // get the current props
  // depending if passed a obj or an array
  let operations =
    Array.isArray(currentOperations) && Array.isArray(currentOperations[0])
      ? currentOperations[index] || {}
      : currentOperations
  let options = Array.isArray(currentOptions)
    ? currentOptions[index] || {}
    : currentOptions
  let variables = Array.isArray(currentVariables)
    ? currentVariables[index] || {}
    : currentVariables

  let currentProps = item.$props
  if (parent.$data && parent.$data.isRokkaPictureTag) {
    // take parent, if not set in child
    if (!operations) {
      operations =
        Array.isArray(parentOperations) && Array.isArray(parentOperations[0])
          ? parentOperations[index]
          : parentOperations
    }
    if (!options) {
      options = Array.isArray(parentOptions)
        ? parentOptions[index]
        : parentOptions
    }
    if (!variables) {
      variables =
        Array.isArray(parentVariables) && parentVariables.length > 0
          ? parentVariables[index]
          : parentVariables
    }
    //we have the default props already from the parentoperations in this case, so just use the added ones
    currentProps = removeDefaultPropsProperties(item.$props)
  }
  return rokkaUrl({
    ...parent.$props,
    ...currentProps,
    operations,
    variables,
    options,
  })
}

export const getParent = item => {
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
  return parent
}

export const removeDefaultPropsProperties = currentProps => {
  const keys = Object.keys(currentProps).filter(key => {
    if (generalProps[key]) {
      if (generalProps[key].default instanceof Function) {
        return currentProps[key] !== generalProps[key].default()
      }
      return currentProps[key] !== generalProps[key].default
    }
    return true
  })

  const nonDefault = {}
  keys.forEach(key => {
    nonDefault[key] = currentProps[key]
  })
  return nonDefault
}
