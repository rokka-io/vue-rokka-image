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
  srcAttributeAdditional: { type: String, default: null },
  operations: {
    type: Array,
    default: () => {
      return []
    }
  },
  options: {
    type: Object,
    default: () => {
      return {}
    }
  },
  variables: {
    type: Object,
    default: () => {
      return {}
    }
  }
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
        if (!flatObject.hasOwnProperty(x)) continue

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

export const buildRokkaUrl = props => {
  const {
    org,
    stack,
    // operations,
    variables,
    options,
    filename,
    format,
    hash
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
    `${sanitizedFilename(filename)}.${format}`
  ].join('/').replace(/\/{2,}/g, '/')

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
