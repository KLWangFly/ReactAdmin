import React, {Component} from 'react'
import './left-nav.less'
import logo from '../../asserts/images/logo.png'
import {Menu, Icon} from 'antd';
import {Link,withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
const {SubMenu} = Menu;
/*
左侧导航组件
*/
class LeftNav extends Component {

    /*
   判断当前用户是否有看到当前item 对应菜单项的权限
   */
    hasAuth = (item) => {
        const key = item.key
        const menuSet = this.menuSet
        /*
        1. 如果菜单项标识为公开
        2. 如果当前用户是admin
        3. 如果菜单项的key 在用户的menus 中
        */
        if(item.isPublic || memoryUtils.user.username==='admin' || menuSet.has(key)) {
            return true
        // 4. 如果有子节点, 需要判断有没有一个child 的key 在menus 中
        } else if(item.children){
            return !!item.children.find(child => menuSet.has(child.key))
        }
    };
    /*
    根据menu的数据数组生成对应的标签数组,使用map+递归调用
    */
    getMenuNodes=(menuList)=>{
      return  menuList.map(item=>{
            if(!item.children){
             return(
                 <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
             )
            }else{
                return (
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                    }
                >
                    {this.getMenuNodes(item.children)}
                </SubMenu>
                )
            }
        })
    };
    /*
    根据menu的数据数组生成对应的标签数组,使用map+递归调用
     */
    getMenuNodes2=(menuList)=>{
        //获取当前请求的路由路径
       const path=this.props.location.pathname;
      return menuList.reduce((pre,item)=>{
          if(this.hasAuth(item)){
              if (!item.children) {
              pre.push((
                  <Menu.Item key={item.key}>
                      <Link to={item.key}>
                          <Icon type={item.icon}/>
                          <span>{item.title}</span>
                      </Link>
                  </Menu.Item>
              ))
          }
          else{
              //存在子菜单项的，访问路径的时候要自动展开，此处查找一个与当前请求路径匹配的子Item
              const cItem= item.children.find(cItem=>path.indexOf(cItem.key)===0);
              //如果存在，说明当前Item的字列表需要展开
              if(cItem){
                  this.openKey=item.key;
              }
              pre.push(
                  (<SubMenu
                      key={item.key}
                      title={
                          <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                      }
                  >
                      {this.getMenuNodes2(item.children)}
                  </SubMenu>)
              )
          }
          }
          return pre;
      },[])
    };
    //在第一次render()之前执行一次，为第一次render()准备数据（同步的）
    componentWillMount () {
        this.menuSet = new Set(memoryUtils.user.role.menus || []);
        this.menuNodes = this.getMenuNodes2(menuList)
    }
    render() {
        //获取当前请求的路由路径
        let path=this.props.location.pathname;
        if(path.indexOf('/product')===0){
            path= '/product'
        }
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                    <h1>React后台管理</h1>
                </Link>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[this.openKey]}>
                 {/*                   <Menu.Item key="1">
                        <Link to='/home'>
                            <Icon type="pie-chart"/>
                            <span>主页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                 <Icon type="mail"/>
                                 <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="5">
                            <Link to='/product'>
                                <Icon type="pie-chart"/>
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to='/category'>
                                <Icon type="pie-chart"/>
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>*/}
                    {
                        //this.getMenuNodes2(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
/*
withRouter高阶组件，包装非路由组件，
返回一个新的组件，新的组件会向非路由组件传回 3个属性：history，location，match
 */
export default withRouter(LeftNav)