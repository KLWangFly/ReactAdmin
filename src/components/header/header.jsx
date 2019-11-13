import React, {Component} from 'react'
import  './header.less'
import { formateDate} from "../../utils/dateUtils";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from "../../api";
import  {Modal} from 'antd'
import menuConfig from '../../config/menuConfig'
import {withRouter} from 'react-router-dom'
import LinkButton from '../link-button/link-button'

const { confirm } = Modal;
/*
头部组件
*/
class Header extends Component {
    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    };

    getTime=()=>{
        //每隔1s获取当前时间，并更新
        this.setIntervalId= setInterval(()=>{
           const currentTime=formateDate(Date.now());
           this.setState({currentTime})
        },1000)
    };
    /*
    发异步ajax 获取天气数据并更新状态
    */
    getWeather=async ()=>{
      const {dayPictureUrl,weather}=await reqWeather('成都');
      this.setState({dayPictureUrl,weather})
    };
    getTitle=()=>{
        const  path=this.props.location.pathname;
        let title;
        menuConfig.forEach(item=>{
            if(item.key===path){
               title=item.title;
            }else if(item.children){
                const cItem= item.children.find(cItem=>path.indexOf(cItem.key)===0);
                if(cItem){
                    title=cItem.title;
                }
            }
        });
        return title;
    };

    logout=()=>{
        confirm({
            title: '确认要退出么?',
            //content: 'Some descriptions',
            okText:'确定',
            cancelText:'取消',
            onOk:()=> {
                storageUtils.removeUser();
                memoryUtils.user={};
                this.props.history.replace('/')
            }
        });
    };
    /*
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
     */
    componentDidMount(){
        this.getTime();
        this.getWeather();
    }
    componentWillUnmount(){
        clearInterval(this.setIntervalId);
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;
        const  user=memoryUtils.user;
        const title=this.getTitle();
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎,{user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt='天气图标'/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)