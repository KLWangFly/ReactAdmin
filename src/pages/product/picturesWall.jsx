import React, {Component} from 'react'
import {Icon,Upload,Modal,message} from 'antd'
import {reqDeleteImg} from "../../api";
import PropTypes from 'prop-types';
import {BASE_IMG_PATH} from "../../utils/constants";

class PicturesWall extends Component {
    static propTypes={
        imgs:PropTypes.array
    };
    // state = {
    //     previewVisible: false,  //标识是否显示大图预览Modal
    //     previewImage: '',   //大图的url
    //     fileList: [
    //      /*   {
    //             uid: '-1',  //每个file都有自己唯一的id
    //             name: 'image.png',
    //             status: 'done',
    //             url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //         },*/
    //     ],
    // };
    constructor(props){
        super(props);
        let fileList=[];
        const  {imgs}=this.props;
        if(imgs&&imgs.length>0){
            fileList=imgs.map((item,index)=>({
                uid: -index,  //每个file都有自己唯一的id
                name: item,
                status: 'done',
                url:BASE_IMG_PATH+imgs,
            }))
        }
        this.state={
            previewVisible: false,  //标识是否显示大图预览Modal
            previewImage: '',   //大图的url
            fileList
        }
    }




    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            //file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    //onChange#
    //上传中、完成、失败都会调用这个函数。
    //file:当前操作的图片文件（上传、删除）
    //fileList：所有已上传的图片文件对象的数组
    handleChange = async ({file, fileList }) => {
        console.log('handleChange',file,fileList,file===fileList[fileList.length-1]); //file和fileList[fileList.length-1]指向同一文件，但不是同一对象
        //一旦上传成功，将当前上传的file信息修正（name，url）
        if(file.status==='done'){
           const  result=file.response;//{status:0,data:{name:"xxx.jpg",url:"图片的地址"}
            if(result.status===0){
                message.success("上传成功！");
                const {name,url}=result.data;
                //file和fileList[fileList.length-1]指向同一文件，但不是同一对象，此处要修改的是fileList中的对象
                file=fileList[fileList.length-1];
                file.url=url;
                file.name=name;
            }else{
                message.error("上传失败！");
            }
        }else if(file.status==='removed'){
            const result= await reqDeleteImg(file.name);
            if(result.status===0){
                message.success("删除图片成功");
            }else {
                message.error("删除图片失败");
            }
        }
        this.setState({ fileList });
    };

    //获取所有已上传的图片文件的名称数组
    getImages=()=>{
        return this.state.fileList.map(e=>e.name);
    };
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    accept="image/*"   //接受上传的文件类型，此处限制只接受图片
                    action="/manage/img/upload" //上传的地址
                    name="image" //请求参数名
                    listType="picture-card"  //上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
                    fileList={fileList}  //已经上传的文件列表
                    onPreview={this.handlePreview}  //点击文件链接或预览图标时的回调
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
export  default  PicturesWall
/*
子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
父组件调用子组件的方法：在父组件中通过ref得到子组件的标签对象（也就是子组件对象），调用其方法
 */
