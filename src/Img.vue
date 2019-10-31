<template>
  <img
    :[srcAttribute]="rokkaSrc"
    :[srcsetAttribute]="rokkaSrcset"
    :[srcAdditionalAttribute]="srcAdditionalComputed"
    :alt="alt"
    :title="title"
    :class="'rokka--attr-' + srcAttribute"
  />
</template>

<script>
import {
  generalProps,
  rokkaUrl,
  mergeDeep,
  mergeArraysDeep,
  srcset,
} from './helpers'

export default {
  props: {
    ...generalProps,
    srcAdditional: {
      type: String,
      default: null,
    },
  },

  computed: {
    // returns srcAdditional if set, otherwise the link to the rokka URL
    // Is useful, when you want to set "src" to a loading image, which then later gets replaced
    // by a lazy loader and data-src(set)
    srcAdditionalComputed() {
      return this.srcAdditionalAttribute
        ? this.srcAdditional
          ? this.srcAdditional
          : this.rokkaSrc
        : null
    },
    rokkaSrcset() {
      return srcset(this)
    },
    rokkaSrc() {
      const currentOperations = this.operations
      const currentOptions = this.options
      const currentVariables = this.variables

      const parrentOperations =
        this.$parent && this.$parent.$props && this.$parent.$props.operations
      const parrentOptions =
        this.$parent && this.$parent.$props && this.$parent.$props.options
      const parrentVariables =
        this.$parent && this.$parent.$props && this.$parent.$props.variables

      // get the current props
      // depending if passed a obj or an array
      let operations =
        Array.isArray(currentOperations) && Array.isArray(currentOperations[0])
          ? currentOperations[0] || {}
          : currentOperations
      let options = Array.isArray(currentOptions)
        ? currentOptions[0] || {}
        : currentOptions
      let variables = Array.isArray(currentVariables)
        ? currentVariables[0] || {}
        : currentVariables

      let currentProps = this.$props
      if (this.$parent.$data.isRokkaPictureTag) {
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
        const pVariables =
          Array.isArray(parrentVariables) && parrentVariables.length > 0
            ? parrentVariables[0]
            : parrentVariables

        operations = mergeArraysDeep(pOperations, operations)
        variables = mergeDeep(pVariables, variables)
        options = mergeDeep(pOptions, options)
        //we have the default props already from the parent in this case, so just use the added ones
        currentProps = this.$options.propsData
      }

      const url = rokkaUrl({
        ...this.$parent.$props,
        ...currentProps,
        operations,
        variables,
        options,
      })

      return url
    },
  },
}
</script>
