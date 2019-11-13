import React, {Component} from 'react'
import {Tree,Input,Form} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const TreeNode=Tree.TreeNode;
const Item=Form.Item;
class AuthForm extends Component {
   static propTypes={
       role:PropTypes.object.isRequired
   };
   constructor(props){
       super(props);
       // 根据传入角色的menus 生成初始状态
       const {menus} = this.props.role;
       this.state = {
           checkedKeys: menus
       }
   }

   //通过menuList+reduce+递归调用生成所有TreeNode
   getTreeNodes=(menuList)=>{
       return menuList.reduce((pre,item)=>{
           pre.push(<TreeNode title={item.title} key={item.key}>
                   {item.children?this.getTreeNodes(item.children):null}
               </TreeNode>);
           return pre;
       },[])
   };
    //通过menuList+map+递归调用生成所有TreeNode
    getTreeNodes1=(menuList)=>{
        return menuList.map((item)=>{
         return    <TreeNode title={item.title} key={item.key}>
                 {item.children?this.getTreeNodes1(item.children):null}
            </TreeNode>
        })
    };

    //为父组件提交获取最新menus 数据的方法
    getMenus = () => this.state.checkedKeys;
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
   componentWillMount(){
      this.treeNodes=this.getTreeNodes(menuList);
   }
    /*
     当组件接收到新的属性时自动调用
     */
    componentWillReceiveProps (nextProps) {
        console.log('componentWillReceiveProps()', nextProps);
        const menus = nextProps.role.menus;
        this.setState({
            checkedKeys: menus
        })
// this.state.checkedKeys = menus
    }
    render() {
        console.log('AuthForm render()');
        const {role} = this.props;
        const {checkedKeys} = this.state;
        return (
            <div>
                <Item label='角色名称' labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                    <Input type='text' value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                    {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}

export default AuthForm