feather2-parser-vue
==========================

编译vue的单文件组件

```sh
npm install feather2-parser-vue --save
```

### feather2 配置

conf/conf.js

```js
//识别vue文件解析成js文件
feather.config.set('project.fileType.js', 'vue');
//vue结尾的文件则编译
feather.match('**.vue', {
    parser: 'vue'
})
```

components/a/a.vue

```html
<style>
div{
    a{
        background: url(./1.png);
        font-size: 12px;
    }
}
</style>

<template>
<div>{{aaa}}</div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            id: Date.now()
        }
    }
};
</script>
```

index.html

```html
require.async('a', function(A){
    console.log(A);
});
```

###使用es6

```sh
npm install fis-parser-es6-babel --save
```

conf/conf.js

```js
//识别vue文件解析成js文件
feather.config.set('project.fileType.js', 'vue');
//vue结尾的文件则编译
feather.match('**.vue', {
    parser: ['vue', 'es6-babel']
})
```

```html
<style>
div{
    a{
        background: url(./1.png);
        font-size: 12px;
    }
}
</style>

<template>
<div>{{aaa}}</div>
</template>

<script>
export default{
    data(){
        return {
            id: Date.now()
        };
    }
}
</script>
```

### feather1.x

feather_conf.js

```js
feather.config.get('project.fileType.text', 'vue');
feather.config.set('modules.parser.vue', [require('feather2-parser-vue'), 'es6-babel']);
feather.config.get('roadmap.path').unshift({
    rExt: '.js',
    useCompile: true,
    reg: /^\/static\/(.+?).vue$/,
    release: '/static/${statics}/$1',
    url: '${statics}/$1',
    isJsLike: true,
    useHash: true,
    isMod: true
});
```

static/a.vue

```html
<style>
div{
    a{
        background: url(./1.png);
        font-size: 12px;
    }
}
</style>

<template>
<div>{{aaa}}</div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            id: Date.now()
        }
    }
};
</script>
```

index.html

```html
require.async('/static/a.vue', function(A){
    console.log(A);
});
```