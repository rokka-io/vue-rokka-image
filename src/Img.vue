<template>
  <img
    :[srcAttribute]="src"
    :[srcsetAttribute]="srcset"
    :[srcAttributeAdditional]="srcAttributeAdditional ? src: null"
    :alt="alt"
    :title="title"
    :class="'rokka--attr-' + srcAttribute"
  />
</template>

<script>
import {
  generalProps,
  buildRokkaUrl,
  mergeDeep,
  mergeArraysDeep,
  srcset,
} from './helpers'

export default {
  props: {
    ...generalProps,
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
  },

  computed: {
    srcset() {
      return srcset(this)
    },
    src() {
      const currentOperations = this.operations
      const currentOptions = this.options
      const currentVariables = this.variables

      const parrentOperations = this.$parent.$props.operations
      const parrentOptions = this.$parent.$props.options
      const parrentVariables = this.$parent.$props.variables

      // get the current props
      // depending if passed a obj or an array
      let operations =
        Array.isArray(currentOperations) && Array.isArray(currentOperations[0])
          ? (currentOperations[0] || {})
          : currentOperations
      let options = Array.isArray(currentOptions)
        ? (currentOptions[0] || {})
        : currentOptions
      let variables = Array.isArray(currentVariables)
        ? (currentVariables[0] || {})
        : currentVariables

      let currentProps = this.$props
      if (this.$parent.$options._componentTag === 'rokka-picture') {
        // get the parent props
        // depending if passed a obj or an array
        const pOperations =
          Array.isArray(parrentOperations) &&
          Array.isArray(parrentOperations[0])
            ? parrentOperations[0]
            : parrentOperations
        const pOptions = Array.isArray(parrentOptions)
          ? parrentOptions[0]
          : parrentOptions
        const pVariables = Array.isArray(parrentVariables)
          ? parrentVariables[0]
          : parrentVariables

        operations = mergeArraysDeep(pOperations, operations)
        variables = mergeDeep(pVariables, variables)
        options = mergeDeep(pOptions, options)
        //we have the default props already from the parent in this case, so just use the added ones
        currentProps = this.$options.propsData
      }

      const url = buildRokkaUrl({
        ...this.$parent.$props,
        ...currentProps,
        operations,
        variables,
        options
      })

      return url
    }
  }
}
</script>
