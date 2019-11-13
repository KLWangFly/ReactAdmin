import React, {Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

const Item=Form.Item;

class AddRoleForm extends Component {
    static propTypes={
        setForm:PropTypes.func.isRequired
    };
    componentWillMount(){
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item label='角色名称' labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                    {
                        getFieldDecorator('name',{initialValue:'',rules:[{required:true,message:'角色名不能为空'}]})(<Input placeholder='请输入角色名'/>)
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddRoleForm)