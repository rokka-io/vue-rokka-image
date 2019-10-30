<template>
  <div class="rokka-picture">
    <picture>
      <slot />
    </picture>
  </div>
</template>

<script>
import { generalProps } from './helpers'

export default {
  props: {
    ...generalProps,
  },
  data() {
    return {
      isRokkaPictureTag: true,
    }
  },
}
</script>
