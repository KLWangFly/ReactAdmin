/*
进行local数据存储管理的工具模块
 */
import store from 'store'
const USER_KEY="user_key";
export  default {
    //保存
    saveUser(user){
        //localStorage低版本浏览器支持不是很好
        // localStorage 只能保存string, 如果传递是对象, 会自动调用对象的toString()并保存
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY, user) // 内部会自动转换成json 再保存
    },

    getUser(){
       //return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
        return store.get(USER_KEY) || {}
    },
    removeUser() {
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}