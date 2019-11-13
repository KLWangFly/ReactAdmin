import React, {Component} from 'react'
import {Card,Table,Button,Modal,Icon,message}from 'antd'
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/link-button";
import {reqUserList,reqDeleteUser,reqAddOrUpdateUser} from "../../api";
import AddForm from './add-form'

/*
用户管理路由组件
 */
class User extends Component {
     state={
         users:[],
         roles:[],
         loading:false,
         showModal:false
     };
     initColumns=()=>{
       this.columns=([{
           title:'用户名',
           dataIndex:'username'
       },{
           title:'邮箱',
           dataIndex:'email',
       },{
           title:'电话',
           dataIndex:'phone'
       },{
           title:'注册时间',
           dataIndex:'create_time',
           render:formateDate
       },{
           title:'所属角色',
           dataIndex:'role_id',
           render:(role_id)=>(this.state.roles.find(item=>item._id===role_id).name)
       },{
           title:'操作',
           render:(user)=>(<span>
               <LinkButton onClick={()=>this.updateUser(user)}>修改</LinkButton>
               <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
           </span>)
       }])
     };
     getUserList=async ()=>{
       this.setState({loading:true});
       const result=await reqUserList();
       this.setState({loading:false});
         if(result.status===0){
           const {users,roles}=result.data;
           this.setState({users,roles});
         }else{
           message.error('获取用户列表失败')
         }
     };
    updateUser=(user)=>{
        // 保存user
        this.user = user;
         this.setState({showModal:true})
    };
     deleteUser=(user)=>{
         console.log(user);
         Modal.confirm({
             title: `确认删除用户{${user.username}}么？`,
             okText: '确认',
             okType: 'danger',
             cancelText: '取消',
             onOk:async () => {
                 const result = await reqDeleteUser(user._id);
                 if (result.status === 0) {
                     message.success('删除成功');
                     this.getUserList()
                 }
             },
         })
     };
    handleOk=()=>{
        this.form.validateFields(async(errors, values) =>{
            if(!errors){
                const user=values;
                if (this.user) {
                    user._id = this.user._id
                }
                const result = await reqAddOrUpdateUser(user);
                this.form.resetFields();
                this.setState({showModal:false});
                if (result.status === 0) {
                    message.success(user._id?'更新角色成功':'新增角色成功');
                    this.getUserList();
                }
            }
        })
    };
     componentWillMount(){
         this.initColumns();
     }
     componentDidMount(){
         this.getUserList();
     }
    render() {
        const {users,roles,loading,showModal}=this.state;
        const user = this.user || {};
        const title=(<Button type='primary' onClick={()=>this.setState({showModal:true})}><Icon type='plus'/>添加用户</Button>);
        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    bordered
                    loading={loading}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:2,showQuickJumper:true}}
                >
                </Table>
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={showModal}
                    onOk={this.handleOk}
                    okText='确认'
                    cancelText='取消'
                    onCancel={()=>this.setState({showModal:false})}
                >
                    <AddForm setForm={(form)=>this.form=form}
                             roles={roles}
                             user={user}
                    />
                </Modal>
            </Card>
        )
    }
}

export default User