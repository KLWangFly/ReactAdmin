/*
包含应用中所有接口请求函数的模块
每个函数返回promise
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
//登录
/*export  function reqLogin(username,password) {
    return ajax("/login",{username,password},'POST');
}*/
//推荐使用箭头函数来写 ，代码看着简洁点
export  const reqLogin=(username,password)=>ajax("/login",{username,password},'POST');

/*
通过jsonp请求获取天气信息
 */
export  const reqWeather=(city)=>{
   const  url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
   return new Promise((resolve,reject)=>{
       jsonp(url,{},(error,response)=>{
           if(!error&&response.status === 'success'){
               //console.log(response)
               const {dayPictureUrl, weather} = response.results[0].weather_data[0];
               resolve({dayPictureUrl, weather})
           }else{
               message.error('获取天气信息失败')
           }
       })
   });

};

/*
获取一级或某个二级分类列表
 */
export const reqCategorys=(parentId)=>ajax("/manage/category/list",{parentId});

/*
添加分类
 */
export const reqAddCategory=(parentId,categoryName)=>ajax("/manage/category/add",{parentId,categoryName},'POST');
/*
更新品类名称
 */
export const reqUpdateCategory=({categoryId,categoryName})=>ajax("/manage/category/update",{categoryId,categoryName},'POST');

/*
获取商品分页列表
 */
export  const reqProducts=(pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize});
/*
根据名称/描述 搜索产品分页列表
 */
export const reqSearchProducts=({pageNum,pageSize,searchType,searchName})=>ajax('/manage/product/search',{pageNum,pageSize,[searchType]:searchName});
/*
根据分类ID获取分类
 */
export  const reqCategory=(categoryId)=>ajax('/manage/category/info',{categoryId});

/*
更新产品状态（对商品进行上架/下架处理）
 */
export const reqUpdateProductStatus=(productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST');
/*
根据图片名称删除图片
 */

export  const reqDeleteImg=(name)=>ajax('/manage/img/delete',{name},'POST');

/*
新增/更新商品
 */
export const reqAddOrUpdateProduct=(product)=>ajax("/manage/product/"+(product._id?"update":"add"),product,"POST");

/*
获取角色列表
 */
export  const reqRoleList=()=>ajax('/manage/role/list');

/*
添加角色
 */
export  const reqAddRole=(roleName)=>ajax('/manage/role/add',{roleName},'POST');

/*
设置角色权限
 */
export  const reqUpdateRole=(role)=>ajax('/manage/role/update',role,'POST');
/*
获取用户列表
 */
export const reqUserList=()=>ajax('/manage/user/list');

/*
删除用户
 */
export  const reqDeleteUser=(userId)=>ajax("/manage/user/delete",{userId},"POST");
/*
新增/修改用户
 */
export  const reqAddOrUpdateUser=(user)=>ajax('/manage/user/'+(user._id ? 'update' : 'add'), user,"POST");