<template>
  <rokka-picture
    hash="1234"
    organization="testorg"
    alt="testimage"
    title="image title"
    :postfix="['1x', '2x']"
    :operations="[resize]"
    :options="[{ af: 1 }, { af: 1, dpr: 2 }]"
  >
    <rokka-source
      media="(max-width: 1000px)"
      :operations="[resize, { name: 'grayscale' }]"
    ></rokka-source>
    <rokka-source media="all"></rokka-source>

    <rokka-img alt="foo"></rokka-img>
  </rokka-picture>
</template>

<script>
import RokkaPicture from '../src/Picture'
import RokkaSource from '../src/Source'
import RokkaImg from '../src/Img'
export default {
  name: 'Picture',
  components: {
    RokkaPicture,
    RokkaSource,
    RokkaImg,
  },
  data() {
    return {
      resize: { name: 'resize', options: { width: 100, height: 1000 } },
    }
  },
}
</script>

<style scoped></style>
