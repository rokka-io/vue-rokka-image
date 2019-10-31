# Vue component for rokka-Images
[Vue 2.x](https://vuejs.org/) component for the image processing service [rokka.io](https://rokka.io/)


If you need a lazy version use [`vue-rokka-image-lazy`](https://github.com/rokka-io/vue-rokka-image-lazy)

## Installation

```sh
npm i vue-rokka-image
```

## simple use

```vue
<rokka-img
  alt="alt"
  title="Title"
  org="playground"
  stack="dynamic"
  hash="HASH"
  format="jpg"
  filename="image.jpg"
  :operations="[
    {
      name: 'resize',
      options: { mode: 'fill', width: 200, height: 200 }
     
    },
    { 
      name: 'crop', 
      options: { width: 200, height: 200 } 
    }
  ]"
/>
```

## use of picture
This produces two sources because there is an array in `optons` and `postfix`.



```vue
<rokka-picture
  alt="alt"
  title="Title"
  org="playground"
  stack="dynamic"
  hash="HASH"
  format="jpg"
  filename="image.jpg"
  :operations="[
    {
      name: 'resize',
      options: { mode: 'fill', width: 200, height: 200 }
     
    },
    { 
      name: 'crop', 
      options: { width: 200, height: 200 } 
    }
  ]"
  
>
  <rokka-source
    :media="'all'"
    :postfix="['1x', '2x']"
    :options="[
      {
        dpr: '1'
      },
      {
        dpr: '2'
      }
    ]"
  />
  <rokka-img />
</rokka-picture>
```
