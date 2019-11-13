/*
入口js文件
 */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import  storageUtils from './utils/storageUtils'
import  memoryUtils from './utils/memoryUtils'
//import 'antd/dist/antd.css'  在config-overrides配置实现按需打包，不需要引入全部的css文件

//读取local中保存的user,保存到内存中
const user= storageUtils.getUser();
memoryUtils.user=user;
//将APP组件标签渲染到index页面的id为root的div上面
ReactDOM.render(<App/>,document.getElementById('root'));