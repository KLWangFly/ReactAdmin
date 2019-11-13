import React, {Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductIndex from './product-index'
import ProductDetail from './product-detail'
import  ProductAddUpdate from './product-addupdate'
import './product.less'
/*
商品管理路由组件
 */
class Product extends Component {

    render() {
        return (
           <Switch>
               <Route path='/product' component={ProductIndex} exact></Route>
               <Route path='/product/detail' component={ProductDetail}></Route>
               <Route path='/product/addUpdate' component={ProductAddUpdate}></Route>
               <Redirect to='/product'></Redirect>
           </Switch>
        )
    }
}

export default Product