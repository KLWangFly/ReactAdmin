import React, {Component} from 'react'
import {Card,Table,Icon,Button,Input,Select,message} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqProducts,reqSearchProducts,reqUpdateProductStatus} from "../../api";

const Option=Select.Option;
class ProductIndex extends Component {
    state = {
        total: 0,
        products: [],
        pageNum: 1,
        pageSize: 2,
        loading: false,
        searchName: '',
        searchType: 'productName'
    };
    getInitColums = () => {
        this.columns = ([
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                width: 100,
                dataIndex: 'price',
                render: (price) => {
                    return <span>￥{price}</span>
                }
            },
            {
                title: '状态',
                width: 150,
                //dataIndex: 'status',
                render: (product) => { //1.在售 2.已下架
                    const {_id,status}=product;
                    const newStatus=status===1?2:1;
                   return (<span>
                        <Button type='primary' onClick={()=>this.updateProductStatus(_id,newStatus)} >{status===1?'下架':'上架'}</Button>
                        <span>{status===1?'在售':'已下架'}</span>
                    </span>)
                }
            },
            {
                title: '操作',
                width: 150,
                render: (product) => {
                    return (
                        <span>
                       <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                       <LinkButton
                           onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                   </span>
                    )
                }
            },
        ])
    };
    getProducts = async () => {
        this.setState({loading: true});
        const {searchType, searchName, pageNum, pageSize} = this.state;
        let result;
        console.log('searchParam',searchType, searchName, pageNum, pageSize);
        if (searchName) {
            result= await reqSearchProducts({pageNum, pageSize, searchType, searchName});
        } else {
            //一般分页
            result = await reqProducts(pageNum, pageSize);
        }
       // console.log('result',result.data,result.total);
        this.setState({loading: false});
        if (result.status === 0) {
            const {total, list} = result.data;
            this.setState({total, products: list})
        }
    };
    updateProductStatus=async (productId,status)=>{
     const result=await reqUpdateProductStatus(productId,status);
     if(result.status===0){
         message.success('更新成功');
         this.getProducts()
     }
    };

    componentWillMount() {
        this.getInitColums()
    };

    componentDidMount() {
       return  this.getProducts();
    }

    render() {
        const {products, total, pageNum, pageSize, loading, searchName, searchType} = this.state;
        const title = (
            <span>
                <Select defaultValue={searchType}
                        style={{width: 150}}
                        onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                     <Option value='productDesc'>按描述搜索</Option>
                 </Select>
                <Input placeholder='关键字'
                       style={{width: 200, marginLeft: 15, marginRight: 15}}
                       value={searchName}
                       onChange={(event) => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => {
                   return  (
                       this.getProducts(pageNum, pageSize))
                }}>搜索</Button>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        );
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        total,
                        current: pageNum,
                        defaultPageSize: pageSize,
                        showQuickJumper: true,
                        onChange: (pageNum, pageSize) => {
                            this.setState({pageNum,pageSize}, () => {
                                return this.getProducts(pageNum, pageSize)
                            })
                        },
                        showSizeChanger: true,
                        pageSizeOptions: ['1', '2', '3'],
                        onShowSizeChange: (current, size) => {
                            this.setState({pageNum:current,pageSize: size}, () => this.getProducts(current, size))
                        }
                    }}
                    loading={loading}
                >
                </Table>
            </Card>
        )
    }
}
export default ProductIndex