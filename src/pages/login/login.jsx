import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../asserts/images/logo.png'
import {Form, Icon, Input, Button,message} from 'antd';
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

class Login extends Component {

    handleSubmit=(event)=>{
        event.preventDefault();
        //from 的统一验证，对表单中所有数据进行验证，也可以指定相关字段验证
        this.props.form.validateFields(/*['username','password'],*/async (err, values) => {
            if (!err) {
                const {username,password}=values;
              /*  reqLogin(username,password).then(response=>{
                    console.log("请求成功！",response.data)
                }).catch(error=>{
                    console.log('请求失败',error.message)
                })*/
              //此处要简化promise对象的使用:不再使用then()来指定成功/失败的回调，使用async和await
              //   try{   统一封装了异常处理信息，不需要每个请求try catch处理了
                    let result=await reqLogin(username,password);
                    //console.log("请求成功！",response.data)
                    if(result.status===0){
                        //提示登陆成功
                        message.success("登陆成功");
                        // 保存用户登录信息
                        memoryUtils.user=result.data;
                        //保存到local中
                        storageUtils.saveUser(result.data)
                        //跳转到Admin主页
                        this.props.history.replace('/')
                    }else{
                        message.error(result.msg)
                    }
                // }catch (error) {
                //     console.log('请求失败',error.message)
                // }
            }else{
                console.log('检验失败',values)
            }
        });
    };

    //自定义验证函数，对密码进行自定义验证
    validatorPwd=(rule, value, callback)=>{
       if(!value){
           callback('密码不能为空');
       }
       else if(value.length>12){
           callback('密码长度不能大于12');
       }else if(value.length<4){
           callback('密码长度不能小于4')
       }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
           callback('用户名必须是英文、数组或下划线组成')
       }else {
           callback()
       }
    };

    render() {
        const user=memoryUtils.user;
        if(user&&user._id){
            return <Redirect to='/'/>
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='logo'/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                /*
                                getFieldDecorator 是一个高阶函数(返回值是一个函数)
                                getFieldDecorator(标识名称，配置对象)(组件标签) 返回新的标签
                                经过getFieldDecorator 包装的表单控件会自动添加value 和onChange，数据同步将被form接管
                               */
                                getFieldDecorator('username',
                                    {rules:
                                            [
                                                {required: true,whitespace:true, message: '用户名不能为空'},
                                                {min: 4, message: '用户名长度不能少于4位'},
                                                {max: 12, message: '用户名长度不能大于12位'},
                                                {pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文、数组或下划线组成"}
                                            ]
                                    })(<Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"
                                />)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',
                                 {rules:
                                            [
                                                {validator:this.validatorPwd}
                                            ]
                                 })(<Input
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="密码 "
                              />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrappedLogin = Form.create()(Login);
export default WrappedLogin