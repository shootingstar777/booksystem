# booksystem

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

<!-- 1.更新dom -->
$forceUpdate:只会触发beforeUpdate和update钩子函数，只更新自身以及插入插槽内容的子组件进行更新
优化
1.利用节流，比如用户名正则检验的时候
2.利用if条件分支共用点击事件，比如登录注册和修改信息用的是同一个点击事件
3.插件由全局引入变为按需引入
4.利用sessionStorage存储数据避免反复请求