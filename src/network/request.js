import axios from "axios";

//const BASE_URL = 'http://10.147.20.7:9003/'
const BASE_URL = 'http://43.139.29.193:8080/'
const TIME_OUT = 10000
export function request(config, success, failure) {
  //1.创建axios实例
  const instance = axios.create({
   baseURL: BASE_URL,
  timeout: TIME_OUT
  })

  /*2. axios拦截器 */
  instance.interceptors.request.use(
    config => {
      config.headers['Authorization'] = sessionStorage.getItem('token')
      return config
    },
    error => {
      return Promise.reject(error);
    }
  )

  //2.2响应拦截
  instance.interceptors.response.use(response => {

        //拦截响应，做统一处理
      if (response.data.code === 401) {
        //sessionStorage.removeItem('token')
       sessionStorage.clear()
        //router.replace('/')
      } else {
        if (response.data.success) {
          return response.data
        } else {
          throw response.data
        }
      }
    }, 
    //接口错误状态处理，也就是说无响应时的处理 
      //console.log(response);
     // return response.data
   // },
    error => {
      return Promise.reject(error) // 返回接口返回的错误信息
    })

  return instance(config)
}

/* 封装最后都要返回一个promise */