/*!
 * vue-rokka-image v0.0.1
 * (c) 
 * Released under the ISC License.
 */
import __vue_normalize__ from '../node_modules/rollup-plugin-vue/runtime/normalize.js';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var sanitizedFilename = function sanitizedFilename(fileName) {
  var newFileName = fileName; // remove old file endings

  newFileName = newFileName.replace(/\.[^/.]{2,4}$/, ''); // according to the rokka team only point and slash are not allowed

  newFileName = newFileName.replace(/[.\\/]/g, '-');
  return newFileName;
};
var generalProps = {
  alt: {
    type: String,
    "default": null
  },
  title: {
    type: String,
    "default": null
  },
  org: {
    type: String,
    "default": ''
  },
  stack: {
    type: String,
    "default": 'dynamic'
  },
  hash: {
    type: String,
    "default": ''
  },
  format: {
    type: String,
    "default": 'jpg'
  },
  filename: {
    type: String,
    "default": 'image'
  },
  srcAttribute: {
    type: String,
    "default": 'src'
  },
  srcAdditionalAttribute: {
    type: String,
    "default": null
  },
  srcsetAttribute: {
    type: String,
    "default": 'srcset'
  },
  operations: {
    type: Array,
    "default": function _default() {
      return [];
    }
  },
  options: {
    type: Object,
    "default": function _default() {
      return {};
    }
  },
  variables: {
    type: Object,
    "default": function _default() {
      return {};
    }
  }
}; // from an object to the rokka notation
// input
//       resize: {
//         width: 300,
//       },
//       crop: {
//         height: 200
//       }
// output
//       resize-width-300--crop-height-200

var flattenObject = function flattenObject(obj) {
  var toReturn = [];
  Object.keys(obj).forEach(function (key) {
    var val = obj[key]; // for objects we should do a recursion

    if (_typeof(val) === 'object') {
      var flatObject = flattenObject(val);

      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue; // are we itteration over a array or object

        if (Array.isArray(flatObject)) {
          toReturn.push("".concat(key, "-").concat(flatObject[x]));
        } else {
          toReturn.push("".concat(key, "-").concat(x, "-").concat(flatObject[x]));
        }
      }
    } else {
      toReturn.push("".concat(key, "-").concat(val));
    }
  });
  return toReturn;
};
var buildRokkaUrl = function buildRokkaUrl(props) {
  var org = props.org,
      stack = props.stack,
      variables = props.variables,
      options = props.options,
      filename = props.filename,
      format = props.format,
      hash = props.hash; // let operationsStr = null
  // if (operations && operations.length) {
  //   operationsStr = operations
  //     .reduce(operation => flattenObject(operation), [])
  //     .join('--')
  // }

  var variablesStr = flattenObject({
    v: variables
  }).join('--');
  var optionsStr = flattenObject({
    options: options
  }).join('--');
  var url = ["".concat(org, ".rokka.io/").concat(stack), // operationsStr,
  variablesStr, optionsStr, hash, "".concat(sanitizedFilename(filename), ".").concat(format)].join('/').replace(/\/{2,}/g, '/');
  return 'https://' + url;
}; // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */

var isObject = function isObject(item) {
  return item && _typeof(item) === 'object' && !Array.isArray(item);
};
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */

var mergeDeep = function mergeDeep(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if (!sources.length) return target;
  var source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, _defineProperty({}, key, source[key]));
      }
    }
  }

  return mergeDeep.apply(void 0, [target].concat(sources));
}; // https://stackoverflow.com/questions/40712399/deep-merging-nested-arrays

var mergeArraysDeep = function mergeArraysDeep(arr1, arr2) {
  var unique = arr1.concat(arr2).reduce(function (accumulator, item) {
    if (accumulator[item.name]) {
      accumulator[item.name] = mergeDeep(accumulator[item.name], item);
    } else {
      accumulator[item.name] = item;
    }

    return accumulator;
  }, {});
  return Object.keys(unique).map(function (key) {
    return unique[key];
  });
};
var srcset = function srcset(item) {
  var currentPostfix = item.postfix;
  var currentOperations = item.operations;
  var currentOptions = item.options;
  var currentVariables = item.variables;
  var parrentPostfix = item.$parent.$props.postfix;
  var parrentOperations = item.$parent.$props.operations;
  var parrentOptions = item.$parent.$props.options;
  var parrentVariables = item.$parent.$props.variables;
  var maxItems = Math.max(Array.isArray(currentPostfix) ? currentPostfix.length : 0, Array.isArray(currentOperations) ? currentOperations.length : 0, Array.isArray(currentOptions) ? currentOptions.length : 0, Array.isArray(currentVariables) ? currentVariables.length : 0);

  if (item.$parent.$options._componentTag === 'rokka-picture') {
    maxItems = Math.max(maxItems, Array.isArray(parrentPostfix) ? parrentPostfix.length : 0, Array.isArray(parrentOperations) ? parrentOperations.length : 0, Array.isArray(parrentOptions) ? parrentOptions.length : 0, Array.isArray(parrentVariables) ? parrentVariables.length : 0);
  }

  var srcset = [];

  for (var i = 0; i < maxItems; i++) {
    // get the current props
    // depending if passed a obj or an array
    var postfix = Array.isArray(currentPostfix) ? currentPostfix[i] : currentPostfix;
    var operations = Array.isArray(currentOperations) && Array.isArray(currentOperations[0]) ? currentOperations[i] : currentOperations;
    var options = Array.isArray(currentOptions) ? currentOptions[i] : currentOptions;
    var variables = Array.isArray(currentVariables) ? currentVariables[i] : currentVariables;

    if (item.$parent.$options._componentTag === 'rokka-picture') {
      // get the parent props
      // depending if passed a obj or an array
      var pOperations = Array.isArray(parrentOperations) && Array.isArray(parrentOperations[0]) ? parrentOperations[i] : parrentOperations;
      var pOptions = Array.isArray(parrentOptions) ? parrentOptions[i] : parrentOptions;
      var pVariables = Array.isArray(parrentVariables) ? parrentVariables[i] : parrentVariables;
      operations = mergeArraysDeep(pOperations, operations);
      variables = mergeDeep(pVariables, variables);
      options = mergeDeep(pOptions, options);
    }

    if (options instanceof Array && options.length === 0) {
      options = {};
    }

    var url = buildRokkaUrl(Object.assign({}, item.$parent.$props, {}, item.$options.propsData, {
      operations: operations,
      variables: variables,
      options: options
    }));
    url = encodeURI(url) + (postfix ? ' ' + postfix : '');
    srcset.push(url);
  }

  return srcset.join(', ');
};

//
var script = {
  props: Object.assign({}, generalProps, {
    postfix: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    },
    options: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    },
    srcAdditional: {
      type: String,
      "default": null
    }
  }),
  computed: {
    // returns srcAdditional if set, otherwise the link to the rokka URL
    // Is useful, when you want to set "src" to a loading image, which then later gets replaced
    // by a lazy loader and data-src(set)
    srcAdditionalComputed: function srcAdditionalComputed() {
      return this.srcAdditionalAttribute ? this.srcAdditional ? this.srcAdditional : this.rokkaSrc : null;
    },
    rokkaSrcset: function rokkaSrcset() {
      return srcset(this);
    },
    rokkaSrc: function rokkaSrc() {
      var currentOperations = this.operations;
      var currentOptions = this.options;
      var currentVariables = this.variables;
      var parrentOperations = this.$parent.$props.operations;
      var parrentOptions = this.$parent.$props.options;
      var parrentVariables = this.$parent.$props.variables; // get the current props
      // depending if passed a obj or an array

      var operations = Array.isArray(currentOperations) && Array.isArray(currentOperations[0]) ? currentOperations[0] || {} : currentOperations;
      var options = Array.isArray(currentOptions) ? currentOptions[0] || {} : currentOptions;
      var variables = Array.isArray(currentVariables) ? currentVariables[0] || {} : currentVariables;
      var currentProps = this.$props;

      if (this.$parent.$options._componentTag === 'rokka-picture') {
        // get the parent props
        // depending if passed a obj or an array
        var pOperations = Array.isArray(parrentOperations) && Array.isArray(parrentOperations[0]) ? parrentOperations[0] : parrentOperations;
        var pOptions = Array.isArray(parrentOptions) ? parrentOptions[0] : parrentOptions;
        var pVariables = Array.isArray(parrentVariables) ? parrentVariables[0] : parrentVariables;
        operations = mergeArraysDeep(pOperations, operations);
        variables = mergeDeep(pVariables, variables);
        options = mergeDeep(pOptions, options); //we have the default props already from the parent in this case, so just use the added ones

        currentProps = this.$options.propsData;
      }

      var url = buildRokkaUrl(Object.assign({}, this.$parent.$props, {}, currentProps, {
        operations: operations,
        variables: variables,
        options: options
      }));
      return url;
    }
  }
};

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('img', _vm._b({
    "class": 'rokka--attr-' + _vm.srcAttribute,
    attrs: {
      "alt": _vm.alt,
      "title": _vm.title
    }
  }, "img", _vm._d({}, [_vm.srcAttribute, _vm.rokkaSrc, _vm.srcsetAttribute, _vm.rokkaSrcset, _vm.srcAdditionalAttribute, _vm.srcAdditionalComputed])));
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var RokkaImageImg = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

//
var script$1 = {
  props: Object.assign({}, generalProps)
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "rokka-picture"
  }, [_c('picture', [_vm._t("default")], 2)]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var RokkaImagePicture = __vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script$2 = {
  props: Object.assign({}, generalProps, {
    media: {
      type: String,
      "default": ''
    },
    postfix: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    },
    options: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    },
    variables: {
      type: [Object, Array],
      "default": function _default() {
        return [];
      }
    }
  }),
  computed: {
    srcset: function srcset$1() {
      srcset(this);
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('source', {
    attrs: {
      "media": _vm.media,
      "srcset": _vm.srcset
    }
  });
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var RokkaImageSource = __vue_normalize__({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var index = {
  install: function install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("rokka-image-img", RokkaImageImg);
    Vue.component("rokka-image-picture", RokkaImagePicture);
    Vue.component("rokka-image-source", RokkaImageSource);
  }
};

export default index;
export { RokkaImageImg, RokkaImagePicture, RokkaImageSource, buildRokkaUrl };
