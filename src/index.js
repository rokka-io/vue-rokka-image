import RokkaImageImg from "./Img.vue";
import RokkaImagePicture from "./Picture.vue";
import RokkaImageSource from "./Source"
import RokkaHelper from "./helpers"

export {
  RokkaImageImg,
  RokkaImagePicture,
  RokkaImageSource,
  RokkaHelper
}

export default {
  install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("rokka-image-img", RokkaImageImg);
    Vue.component("rokka-image-picture", RokkaImagePicture);
    Vue.component("rokka-image-source", RokkaImageSource);

  }
};