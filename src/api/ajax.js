/*
发送异步ajax请求的函数模块
封装axios库,函数的返回值是一个promise对象
1.优化：统一处理请求异常
      在外包裹一个自己的promise对象，在请求出错的时候，不去reject，而是直接提示出错信息
2.优化：异步得到的不是response，而是response.data
       在请求成功resolve时，resolve(response.data)
 */
import axios from 'axios'
import {message} from 'antd'

export  default function ajax(url,data={},method='GET') {
    return new Promise((resolve,reject)=>{
        let promise;
        //1.执行异步ajax请求
        if(method==='GET'){  //发送get请求
            promise= axios.get(url,{  //配置对象
                params:data   //指定请求参数
            })
        }else{   //发送post请求
            promise= axios.post(url,data)
        }
        //2.如果成功了执行resolve(value)
        promise.then(response=>{
            resolve(response.data)
        //3.如果失败了,不调用reject(reason)，而是提示异常信息
        }).catch (error=> {
            message.error("请求出错了:" + error.message)
        })

    })
}