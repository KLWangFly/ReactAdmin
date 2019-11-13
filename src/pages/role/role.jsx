import React, {Component} from 'react'
import {Card,Button,Table,Icon,message,Modal} from 'antd'
import {reqRoleList,reqAddRole,reqUpdateRole}  from '../../api'
import AddRoleForm from './add-role-form'
import {formateDate} from '../../utils/dateUtils'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'

/*
角色管理路由组件
 */
class Role extends Component {
    state={
        roles:[],
        role:{},//当前选中的行的数据
        loading:false,
        showAddForm:false,
        showAuthForm:false
    };

    constructor(props){
        super(props);
        this.updateRole=React.createRef();
    }

    initColumns=()=>{
        this.columns=([{
              title:'角色名称',
              dataIndex:'name'
            },
             {
               title:'创建时间',
               dataIndex:'create_time',
               render:(create_time)=>formateDate(create_time)
             },
                {
                title:'授权时间',
                dataIndex:'auth_time',
                    render:formateDate
                },
                {
                title:'授权人',
                dataIndex:'auth_name'
                }
            ]
     )
    };
    getRoleList=async ()=>{
        this.setState({loading:true});
       const  result= await reqRoleList();
        this.setState({loading:false});
       if(result.status===0){
           const roles=result.data;
           this.setState({roles})
       }
    };
    onRow=(role)=>{
      return {
          onClick:event=>{
              console.log('role',role);
              this.setState({role})
          }
      }
    };
    handleOk=()=>{
        this.form.validateFields(async (errors, values) =>{
            if(!errors){
                this.setState({showAddForm:false});
                const {name}=values;
                //重置输入数据，清除缓存
                this.form.resetFields();
                const  result=await reqAddRole(name);
                if(result.status===0){
                    message.success('添加角色成功');
                    //刷新列表
                    //this.getRoleList();
                    // 新产生的角色
                    const role = result.data;
                    // 更新roles 状态
                    /*const roles = this.state.roles
                    roles.push(role)
                    this.setState({
                    roles
                    })*/
                    // 更新roles 状态: 基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                }else{
                    message.error('添加角色失败');
                }
            }
        })
    };
    handleAuthOk=async ()=>{
      const menus=this.updateRole.current.getMenus();
      const {role}=this.state;
        role.menus=menus;
        role.auth_time = Date.now();
        role.auth_name = memoryUtils.user.username;
      const result=await reqUpdateRole(role);
      if(result.status===0){
          this.setState(state=>({showAuthForm:!state.showAuthForm}));
          message.success("设置角色权限成功");
          //this.getRoles()
          this.setState({
              roles: [...this.state.roles]
          })
      }else{
          message.error("设置角色权限失败")
      }
   };
    componentDidMount(){
        return this.getRoleList();
    }
    componentWillMount(){
        this.initColumns();
    }
    render() {
        const  {roles,loading,role,showAddForm,showAuthForm}=this.state;
        const title=(<span>
            <Button type='primary' onClick={()=>this.setState({showAddForm:true})}><Icon type='plus'/>添加角色</Button>&nbsp;&nbsp;&nbsp;
            <Button type='primary' disabled={!role._id} onClick={()=>this.setState(state=>({showAuthForm:!state.showAuthForm}))}>设置角色权限</Button>
        </span>);
        return (
           <Card title={title}>
               <Table
                   columns={this.columns}
                   dataSource={roles}
                   bordered
                   rowKey='_id'
                   pagination={{defaultPageSize:5,showQuickJumper:true}}
                   loading={loading}
                   rowSelection={{type:'radio',
                       selectedRowKeys:[role._id],
                       onSelect:(role)=> this.setState({role})
                   }}
                   onRow={this.onRow}
                >
               </Table>
               <Modal
                   title="添加角色"
                   okText="确认"
                   cancelText="取消"
                   visible={showAddForm}
                   onOk={this.handleOk}
                   onCancel={()=>{this.setState({showAddForm:false})}}
                   >
                <AddRoleForm setForm={(form)=>this.form=form}/>
               </Modal>
               <Modal
                   title="设置角色权限"
                   okText="确认"
                   cancelText="取消"
                   visible={showAuthForm}
                   onOk={this.handleAuthOk}
                   onCancel={()=>{this.setState({showAuthForm:false})}}
                 >

                   <AuthForm role={role} ref={this.updateRole}/>
               </Modal>
           </Card>
        )
    }
}

export default Role