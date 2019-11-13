import React, {Component} from 'react'
import {Card, Icon, Form, Input, Button,Cascader,message} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys} from '../../api'
import PicturesWall from './picturesWall'
import RichTextEditor from './rich-text-editor'
import {reqAddOrUpdateProduct} from '../../api'

const Item=Form.Item;
const TextArea=Input.TextArea;
const formTailLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8},
};
class ProductAddUpdate extends Component {

    state={
        options:[] // 用来显示级联列表的数组
    };

    constructor(props){
        super(props);
        //创建用来保存ref标识的标签对象的容器
        this.picture=React.createRef();
        this.editor=React.createRef();
        //后将此容器指定给子组件的ref属性上，就会将子组件装进该容器中
    }
    //自定义验证价格
    checkPrice= (rule, value, callback) => {
        if (value*1>0) {
            callback();
            return;
        }
        callback('价格不能输入小于0的数字');
    };
    //表单提交 （采用button提交，不用处理事件冒泡，先验证通过再提交表单数据，
    // 如果采用From上定义onClick事件来提交表单数据，则先要处理事件冒泡，即：e.preventDefault()）
    submit=()=>{
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
               console.log("提交ajax请求成功",values);
               const {name,desc,price,categoryIds}=values;
               let pCategoryId;
               let categoryId;
               if(categoryIds.length===1){
                   pCategoryId='0';
                   categoryId=categoryIds[0];
               }else{
                   pCategoryId=categoryIds[0];
                   categoryId=categoryIds[1];
               }
                //获取子组件标签对象，调用子组件中定义的方法
                const imgs=this.picture.current.getImages();
                const detail=this.editor.current.getEditor();
                const productInfo={name,desc,price,categoryId,pCategoryId,imgs,detail};
                const {isUpdate,product}=this;
                if(isUpdate){
                    productInfo._id=product._id;
                }
                console.log("productInfo",productInfo);
                const result=await reqAddOrUpdateProduct(productInfo);
                if(result.status===0){
                    message.success(`${isUpdate?"修改":"添加"}成功`)
                    this.props.history.push('/product/')
                }else{
                    message.error(`${isUpdate?"修改":"添加"}失败`)
                }
            }
        })
    };
    //通过parentId查询分类列表（如果parentId 为'0'时获取一级列表）
    getCategorys= async (parentId)=>{
        const result=await reqCategorys(parentId);
        if(result.status===0){
            const categorys=result.data;
            if(parentId==='0'){
                // 根据一级分类数组初始化生成options 数组
                this.initOptions(categorys)
            }else{// 当前得到是二级分类列表
                // 返回二级分类列表(作为async 函数的promise 对象的成功的value 值)
                return categorys;
            }
        }
    };
    //生成级联的一级列表
    initOptions=async (categorys)=>{
        const options=categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }));

        const {isUpdate,product}=this;
        if(isUpdate){
            if(product.pCategoryId!=='0'){
                const subCategorys=await this.getCategorys(product.pCategoryId);
                if(subCategorys && subCategorys.length>0){
                    const children=subCategorys.map(c=>({
                        value: c._id,
                        label: c.name,
                        isLeaf: false,
                    }));
                    // 找到对应的option
                    const  targetOption=options.find(item=>item.value===product.pCategoryId);
                    targetOption.children=children;
                }
            }
        }
        // 更新状态
        this.setState({
            options
        })
    };

   //选择某个分类项时的回调,加载对应的二级分类显示
    loadData=async (selectedOptions)=>{
        const targetOption = selectedOptions[0];
        targetOption.loading = true;  // 显示loading
        // 异步请求获取对应的二级分类列表
         const subCategorys=await  this.getCategorys(targetOption.value);
         // await 的作用: 保证完成执行完保存的分类数组才进入后面的语句
        targetOption.loading = false; // 隐藏loading
         if(subCategorys&&subCategorys.length>0){
             // 生成一个二级的options
             // 添加为对应的option 的children(子options)
             targetOption.children=subCategorys.map(c => ({
                 value: c._id,
                 label: c.name,
                 isLeaf: true,
             }));
         }else { // 没有子分类
             targetOption.isLeaf = true
         }
        // 更新options 状态
         this.setState({
             options:[...this.state.options]
         })
    };
    componentDidMount(){
        this.getCategorys('0');
    };
    componentWillMount(){
        // 取出跳转传入的数据
    const product= this.props.location.state;
    this.isUpdate=!!product;   //!!xxx 将一个数据强制转换成布尔类型
    this.product=product||{};
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {isUpdate,product}=this;
        let categoryIds=[];
        if(isUpdate){
            if(product.pCategoryId==='0'){
                categoryIds.push(product.categoryId);
            }else{
                categoryIds.push(product.pCategoryId);
                categoryIds.push(product.categoryId);
            }
        }
        const  title=(<span>
            <LinkButton onClick={()=>this.props.history.goBack()}>
                <Icon type='arrow-left'/>
            </LinkButton>
            {isUpdate?'修改商品':'添加商品'}
        </span>);
        return (
            <Card title={title}>
                <Form>
                    <Item {...formTailLayout}  label='商品名称'> {/*labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}*/}
                        {
                            getFieldDecorator('name',
                                {initialValue:product.name,rules:[{required:true,message:'商品名称不能为空'}]}
                        )(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} label='商品描述'>
                        {
                            getFieldDecorator('desc',
                                {initialValue:product.desc,rules:[{required:true,message:'商品描述不能为空'}]}
                            )( <TextArea placeholder='请输入商品名称' autoSize={{minRows: 2, maxRows: 6}}/>)
                        }
                    </Item>
                    <Item labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} label='商品价格'>
                        {
                            getFieldDecorator('price',
                                {initialValue:product.price,
                                    rules:[
                                        {required:true,message:'商品价格不能为空'},
                                        { validator: this.checkPrice },
                                         ]
                                }
                            )(  <Input  placeholder='请输入商品价格' type='number' addonAfter='元' />)
                        }
                    </Item>
                    <Item labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} label='商品分类'>
                        {
                            getFieldDecorator('categoryIds',
                                {initialValue:categoryIds,
                                    rules:[
                                        {required:true,message:'商品分类不能为空'},
                                    ]
                                }
                            )(<Cascader
                                placeholder='选择商品分类'
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                            />)
                        }
                    </Item>
                    <Item labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} label='商品图片'>
                        <PicturesWall ref={this.picture} imgs={product.imgs} />
                    </Item>
                    <Item labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label='商品详情'>
                       <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Item>
                    <Item >
                       <Button type='primary' style={{marginLeft:50}} onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)