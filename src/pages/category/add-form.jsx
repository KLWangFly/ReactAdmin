import React, {Component} from 'react'
import {Form,Select,Input} from 'antd'
import  PropTypes from 'prop-types'

const Item=Form.Item;
const Option=Select.Option
class AddForm extends Component {
    static propTypes={
        categories:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    };
    componentWillMount(){
        this.props.setForm(this.props.form);
    }


    render() {
        const {getFieldDecorator}=this.props.form;
        const {categories,parentId}=this.props;
        return (
           <Form>
               <Item label='分类类别'>
                   {
                       getFieldDecorator("parentId",{initialValue:parentId})(<Select>
                       <Option value="0">一级分类</Option>
                           {
                               categories.map((item,index)=>(<Option value={item._id} key={index}>{item.name}</Option>))
                           }
                   </Select>)
                   }

               </Item>
               <Item label='分类名称'>
                   {getFieldDecorator("categoryName",{initialValue:'',rules:[{required:true,message:'分类名称不能为空'}]})(<Input placeholder="请输入分类名称" />)}
               </Item>
           </Form>
        )
    }
}

export default Form.create()(AddForm)