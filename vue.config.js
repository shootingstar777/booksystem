// vue.config.js
module.exports = {
  /*   chainWebpack: config => {
      config
        .plugin('html')
        .tap(args => {
          args[0].title = 'gymApplication'
          return args
        })
    }, */
  devServer: {
    // 配置跨域
    proxy: {
      '/api': {
        target: 'http://43.139.29.193:8080/', //跨域请求的公共地址
        ws: false, //也可以忽略不写，不写不会影响跨域
        changeOrigin: true, //是否开启跨域，值为 true 就是开启， false 不开启
        pathRewrite: {
          '^/api': '/' //注册全局路径， 但是在你请求的时候前面需要加上 /api  
        }
      }
    }
  }
}