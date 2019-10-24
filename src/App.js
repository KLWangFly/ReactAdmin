
import React, {Component} from 'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Admin from './pages/admin/admin'
import Login from './pages/login/login'

/*
应用的根组件
 */
class App extends Component {

    render() {
        return (
                <BrowserRouter>
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/' component={Admin}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}
export  default  App