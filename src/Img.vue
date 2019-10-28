<template>
  <img
    :[srcAttribute]="src"
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
  mergeArraysDeep
} from './helpers'

export default {
  props: {
    ...generalProps
  },

  computed: {
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
          ? currentOperations[0]
          : currentOperations
      let options = Array.isArray(currentOptions)
        ? currentOptions[0]
        : currentOptions
      let variables = Array.isArray(currentVariables)
        ? currentVariables[0]
        : currentVariables

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
      }

      const url = buildRokkaUrl({
        ...this.$parent.$props,
        ...this.$props,
        operations,
        variables,
        options
      })

      return url
    }
  }
}
</script>
