/*
入口js文件
 */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import 'antd/dist/antd.css'  在config-overrides配置实现按需打包，不需要引入全部的css文件

//将APP组件标签渲染到index页面的id为root的div上面
ReactDOM.render(<App/>,document.getElementById('root'));