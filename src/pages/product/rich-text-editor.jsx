import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types'
import htmlToDraft from 'html-to-draftjs';

import  'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class RichTextEditor extends Component {
    static propTypes={
      detail:PropTypes.string
    };
    constructor(props){
        super(props);
       let editorState;
        const  {detail}=this.props;
        if(detail){
            const blocksFromHtml = htmlToDraft(detail);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            editorState = EditorState.createWithContent(contentState)
        } else {
            editorState = EditorState.createEmpty()
        }
        this.state={editorState}
    }

    onEditorStateChange= (editorState) => {
        this.setState({
            editorState,
        });
    };
    getEditor=()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    };
    uploadImageCallBack=(file)=>{
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                //xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    let data={data:{link:response.data.url}};
                    resolve(data);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    };
    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                  /*  wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"*/
                    //wrapperStyle={{}}
                    editorStyle={{border:"1px solid black",minHeight:"200px"}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
               {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />*/}
            </div>
        );
    }
}
export  default  RichTextEditor;