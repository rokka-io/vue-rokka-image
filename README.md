## simple use

```
<rokka-img
  :alt="alt Text"
  :title="Title"
  :org="rokkaOrg"
  :stack="'resizecrop'"
  :hash="HASH"
  :format="jpg"
  :filename="image.jpg"
  :operations="[
    {
      name: 'resize',
      options: { mode: 'fill' },
      expressions: { width: '$width', height: '$height' }
    },
    { name: 'crop', expressions: { width: '$width', height: '$height' } }
  ]"
  :variables="{ width: 300, height: 200 }"
/>
```

## use of picture
This produces two sources because there is an array in `optons` and `postfix`.



```
<rokka-picture
  :alt="alt Text"
  :title="Title"
  :org="rokkaOrg"
  :stack="'resizecrop'"
  :hash="HASH"
  :format="jpg"
  :filename="image.jpg"
  :operations="[
    {
      name: 'resize',
      options: { mode: 'fill' },
      expressions: { width: '$width', height: '$height' }
    },
    { name: 'crop', expressions: { width: '$width', height: '$height' } }
  ]"
  :variables="{ width: 600, height: 400 }"
>
  <rokka-source
    :media="'all'"
    :postfix="['1x', '2x']"
    :variables="{
      width: 300,
      height: 200
    }"
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
