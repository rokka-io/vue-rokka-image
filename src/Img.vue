<template>
  <img
    :[srcAttribute]="rokkaSrc"
    :[srcsetAttribute]="rokkaSrcset"
    :[srcAdditionalAttribute]="srcAdditionalComputed"
    :alt="alt || ($parent.isRokkaPictureTag && $parent.alt)"
    :title="title || ($parent.isRokkaPictureTag && $parent.title)"
    :class="'rokka--attr-' + srcAttribute"
  />
</template>

<script>
import { generalProps, srcset, src } from './helpers'

export default {
  props: {
    ...generalProps,
    srcAdditionalAttribute: { type: String, default: null },
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
      return src(this)
    },
  },
}
</script>
