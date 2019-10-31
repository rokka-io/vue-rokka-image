<template>
  <source :media="media" :srcset="srcset" />
</template>

<script>
import { generalProps, srcset } from './helpers'

export default {
  props: {
    ...generalProps,
    media: { type: String, default: '' },
  },

  computed: {
    srcset() {
      return srcset(this)
    },
  },
}
</script>
