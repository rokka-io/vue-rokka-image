import RokkaImg from './Img.vue'
import RokkaPicture from './Picture.vue'
import RokkaSource from './Source.vue'
import { rokkaUrl } from './helpers'

module.exports = {
  RokkaImg,
  RokkaPicture,
  RokkaSource,
  rokkaUrl,
  default: {
    install(Vue) {
      Vue.component('rokka-img', RokkaImg)
      Vue.component('rokka-picture', RokkaPicture)
      Vue.component('rokka-source', RokkaSource)
    },
  },
}
