<template>
  <source
    :media="media"
    :[srcsetAttribute]="srcset"
    :[srcsetAdditionalAttribute]="srcsetAdditionalComputed"
    :class="'rokka--attr-' + srcsetAttribute"
  />
</template>

<script>
import { generalProps, srcset } from './helpers'

export default {
  props: {
    ...generalProps,
    media: { type: String, default: '' },
    srcsetAdditionalAttribute: { type: String, default: null },

    srcsetAdditional: {
      type: String,
      default: null,
    },
  },

  computed: {
    srcset() {
      return srcset(this)
    },
    // returns srcsetAdditional if set, otherwise the link to the rokka URL
    // Is useful, when you want to set "srcset" to a loading image, which then later gets replaced
    // by a lazy loader and data-srcset
    srcsetAdditionalComputed() {
      console.log(this.srcsetAdditionalAttribute, this.srcsetAdditional)
      return this.srcsetAdditionalAttribute
        ? this.srcsetAdditional
          ? this.srcsetAdditional
          : srcset(this)
        : null
    },
  },
}
</script>
