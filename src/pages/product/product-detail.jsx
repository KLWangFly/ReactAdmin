import React, {Component} from 'react'
import {Card,List,Icon} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {reqCategory} from "../../api";
import {BASE_IMG_PATH} from '../../utils/constants'

const Item=List.Item;
class ProductDetail extends Component {
    state = {
        cName1: '', // 一级分类名称
        cName2:''//二级分类名称
    };
    /*
    异步获取当前产品对应的分类名称
    */
    getCategoryName = async () => {
        const {categoryId, pCategoryId} = this.props.location.state;
        if (pCategoryId === '0') {
// 获取一级分类名称
            const result = await reqCategory(categoryId);
            const cName1 = result.data==null?'':result.data.name;
            this.setState({cName1})
        } else {
// 获取一级分类名称
            /*const result1 = await reqCategory(pCategoryId)
            const cName1 = result1.data.name
            // 获取二级分类名称
            const result2 = await reqCategory(categoryId)
            const cName2 = result2.data.name
            this.setState({cName1, cName2})*/
            /*
            一次发多个请求, 等所有请求都返回后一起处理, 如果有一个请求出错了, 整个都会失败
            Promise.all([promise1, promise2]) 返回值一个promise 对象, 异步成功返回的是
            [result1, result2]
            */
            const results = await Promise.all([reqCategory(pCategoryId),
                reqCategory(categoryId)]);
            const result1 = results[0];
            const result2 = results[1];
            const cName1 = result1.data==null?'':result1.data.name;
            const cName2 = result2.data==null?'':result2.data.name;
            this.setState({cName1, cName2})
        }
    };
    componentDidMount() {
       return  this.getCategoryName()
    }
    render() {
        const {cName1,cName2}=this.state;
        const {name, desc, price, imgs, detail} = this.props.location.state;
        const imgStyle = {width: 150, height: 150, marginRight: 10, border: '1px solid black'};
        const  title=(<span><LinkButton onClick={()=>this.props.history.goBack()}><Icon type='arrow-left'/></LinkButton> 商品详情</span>);
        return (
            <Card title={title} className='product-detail'>
                <List>
                <Item>
                    <span className='left'>商品名称:</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className='left'>商品描述:</span>
                    <span>{desc}</span>
                </Item>
                <Item>
                    <span className='left'>商品价格:</span>
                    <span>{price}元</span>
                </Item>
                <Item>
                    <span className='left'>所属分类:</span>
                    <span>{cName1 + (cName2 ? ' --> ' + cName2 : '')}</span>
                </Item>
                <Item>
                    <span className='left'>商品图片:</span>
                    <span>
                        {
                            imgs.map(img => (
                                <img src={BASE_IMG_PATH + img} alt="img" key={img} style={imgStyle}/>
                            ))
                        }
                    </span>
                </Item>
                <Item>
                    <span className='left'>商品详情:</span>
                    <div dangerouslySetInnerHTML={{__html: detail}}/>
                </Item>
                </List>
            </Card>
        )
    }
}

export default ProductDetail