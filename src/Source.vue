<template>
  <source :media="media" :srcset="srcset" />
</template>

<script>
import {
  generalProps,
  buildRokkaUrl,
  mergeDeep,
  mergeArraysDeep
} from './helpers'

export default {
  props: {
    ...generalProps,
    media: { type: String, default: '' },
    postfix: {
      type: [Object, Array],
      default: () => {
        return []
      }
    },
    options: {
      type: [Object, Array],
      default: () => {
        return []
      }
    },
    variables: {
      type: [Object, Array],
      default: () => {
        return []
      }
    }
  },

  computed: {
    srcset() {
      const currentPostfix = this.postfix
      const currentOperations = this.operations
      const currentOptions = this.options
      const currentVariables = this.variables

      const parrentPostfix = this.$parent.$props.postfix
      const parrentOperations = this.$parent.$props.operations
      const parrentOptions = this.$parent.$props.options
      const parrentVariables = this.$parent.$props.variables

      let maxItems = Math.max(
        Array.isArray(currentPostfix) ? currentPostfix.length : 0,
        Array.isArray(currentOperations) ? currentOperations.length : 0,
        Array.isArray(currentOptions) ? currentOptions.length : 0,
        Array.isArray(currentVariables) ? currentVariables.length : 0
      )

      if (this.$parent.$options._componentTag === 'rokka-picture') {
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
          Array.isArray(currentOperations) &&
          Array.isArray(currentOperations[0])
            ? currentOperations[i]
            : currentOperations
        let options = Array.isArray(currentOptions)
          ? currentOptions[i]
          : currentOptions
        let variables = Array.isArray(currentVariables)
          ? currentVariables[i]
          : currentVariables

        if (this.$parent.$options._componentTag === 'rokka-picture') {
          // get the parent props
          // depending if passed a obj or an array
          const pOperations =
            Array.isArray(parrentOperations) &&
            Array.isArray(parrentOperations[0])
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

        let url = buildRokkaUrl({
          ...this.$parent.$props,
          ...this.$options.propsData,
          operations,
          variables,
          options
        })

        url = url + (postfix ? ' ' + postfix : '')

        srcset.push(url)
      }

      return srcset.join(', ')
    }
  }
}
</script>
