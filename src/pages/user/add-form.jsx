import React, {PureComponent} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const Item=Form.Item;
const Option=Select.Option;
const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14},
};
class AddForm extends PureComponent {
    static  propTypes={
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array,
        user:PropTypes.object
    };
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {roles,user} =this.props;
        return (
            <Form {...formLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username',{
                            initialValue:user.username,
                            rules:[{required:true,message:'用户名不能为空'}]
                        })(<Input placeholder='请输入用户名'/>)
                    }
                </Item>
                <Item label='密码'>
                    {getFieldDecorator('password',{
                        initialValue:user.password,
                        rules:[{required:true,message:'密码不能为空'}]
                    })(<Input type='password' placeholder='请输入密码'/>)}
                </Item>
                <Item label='手机号'>
                    {getFieldDecorator('phone',{
                        initialValue:user.phone,
                        rules:[{required:true,message:'手机号不能为空'}]
                    })(<Input placeholder='请输入手机号'/>)}
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email',{
                        initialValue:user.email,
                    })(<Input placeholder='请输入邮箱'/>)}
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id',{
                        initialValue:user.role_id})(
                        <Select placeholder='请选择角色'>
                            {roles.map(item=>(<Option value={item._id} key={item._id}>{item.name}</Option>))}
                       </Select>
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)