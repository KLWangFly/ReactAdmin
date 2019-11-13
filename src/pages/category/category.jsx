import React, {Component} from 'react'
import {Button,Icon,Card,Table,message,Modal} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api/'
import AddForm from './add-form'
import UpdateForm from './update-form'

/*
商品类别路由组件
 */
class Category extends Component {
    state={
      categories:[],
      loading:false,
      parentId:'0',  //当前需要显示的分类列表的parentId
      parentName:'',
      subCategories:[],
      showStatus:0  //用于控制弹出层是否显示  0不显示 1显示添加 2显示修改
    };
    /*
    初始化Table中所有列的数组
     */
    initColums=()=>{
        this.columns= ([
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width:'20%',
                render:(category) =>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数：定义一个匿名函数，在函数中调用处理的函数，并传入参数数据*/}
                        {this.state.parentId==='0'?
                            <LinkButton onClick={()=>this.showSubCategories(category)}> 查看子分类</LinkButton>
                            :null
                        }
                    </span>
                )
            },
        ])
    };
    /*
    异步获取一级/二级分类列表显示
     */
    getCategories=async (parentId)=>{
        this.setState({loading:true});
       parentId=parentId||this.state.parentId;
       const result=await reqCategorys(parentId);
       this.setState({loading:false});
       if(result.status===0){
           const  categories=result.data;
           if(parentId==='0'){
               this.setState({categories})
           }else{
               this.setState({subCategories:categories})
           }
       }else{
           message.error("获取分类列表出错")
       }
    };
    /*
    获取指定一级对象的二级子列表
     */
    showSubCategories=(category)=>{
       this.setState({
           parentId:category._id,
           parentName:category.name
       }, ()=>{  //在状态更新且重新render后执行
           console.log('parentId',this.state.parentId);
           this.getCategories();
       });
       //console.log('parentId',this.state.parentId);
    };

    //更新为显示一级列表状态
    showCategory=()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategories:[]
        })
    };
    //弹出新增页面
    showAdd=()=>{
        this.setState({showStatus:1})
    };
    //保存新增
    addCategory= ()=>{
      console.log('addCategory()');
      this.form.validateFields(async (err, values) => {
          if(!err){
              //1.关闭页面
              this.setState({showStatus:0});
              //2.调用接口更新数据
              // const parentId=this.form.getFieldValue('parentId');
              // const categoryName=this.form.getFieldValue('categoryName');
              const {parentId,categoryName}=values;
              //清除缓存
              this.form.resetFields();
              const  result=await reqAddCategory(parentId,categoryName);
              if(result.status===0){
                  message.success('保存成功');
                  if(parentId===this.state.parentId){
                      //3.重新加载页面更新数据
                      this.getCategories();
                  }else if(parentId==='0'){
                      this.getCategories(parentId)
                  }
              }else{
                  message.error('更新数据出错')
              }
          }
      })
    };
    showUpdate=(category)=>{
        this.category=category;
        this.setState({showStatus:2})
    };
    //保存修改
    updateCategoty=()=>{
        console.log('updateCategory');
        this.form.validateFields(async (err, values) =>{
            if(!err){
                //1.关闭页面
                this.setState({showStatus:0});
                //2.调用接口更新数据
                const categoryId=this.category._id;
                //const categoryName=this.form.getFieldValue('categoryName');
                const {categoryName}=values;
                //清除缓存
                this.form.resetFields();
                const  result=await reqUpdateCategory({categoryId,categoryName});
                if(result.status===0){
                    message.success('更新成功');
                    //3.重新加载页面更新数据
                    this.getCategories();
                }else{
                    message.error('更新数据出错')
                }
            }
        });
    };
    //关闭弹窗
    handleCancel=()=>{
        //重置表单
        this.form.resetFields();
        this.setState({showStatus:0})
    };

    /*
    为第一次渲染render准备数据
     */
    componentWillMount(){
        this.initColums();
    }
    /*
    发异步ajax请求获取分类数据
     */
    componentDidMount(){
       this.getCategories();
    }
    render() {
        const {categories,loading,subCategories,parentId,parentName,showStatus}=this.state;
        const category=this.category||{};
        //card的左侧
        const title=(parentId==='0')?"一级分类列表":(
             <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <Icon type='arrow-right'/>
                {parentName}
             </span> );
        //card的右侧
        const extra=(<Button type='primary' onClick={this.showAdd}>
            <Icon type='plus'/>
            添加
        </Button>);
        return (
            <Card title={title} extra={extra} >
                <Table
                    columns={this.columns}
                    dataSource={parentId==='0'?categories:subCategories}
                    bordered
                    rowKey='_id'
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                    loading={loading}
                >
                </Table>

                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                   <AddForm categories={categories} parentId={parentId} setForm={(form)=>this.form=form}/>
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCategoty}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                  <UpdateForm categoryName={category.name} setForm={(form)=>this.form=form}/>
                </Modal>
            </Card>
        )
    }
}

export default Category