<template>
  <source :media="media" :srcset="srcset" />
</template>

<script>
import { generalProps, srcset } from './helpers'

export default {
  props: {
    ...generalProps,
    media: { type: String, default: '' },
    postfix: {
      type: [Object, Array],
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
  },

  computed: {
    srcset() {
      return srcset(this)
    },
  },
}
</script>
