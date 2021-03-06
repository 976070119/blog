import React, { useState, useEffect, useRef } from 'react';
import SimpleMDE from "react-simplemde-editor";
import { Input, Space, Button, Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';
import marked from 'marked';
import { connect } from 'react-redux';
import { publish } from '../../redux/actions';
import "easymde/dist/easymde.min.css";
import './writer.less';
// import 'github-markdown-css/github-markdown.css'

function Writer(props) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const [content, setContent] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputVisible])

    const getTitle = value => setTitle(value.target.value);

    const getDesc = value => setDesc(value.target.value);
    
    const getContent = value => {
        setContent(value);
    }
    // const getInsance = instance => {
    //     console.log(instance)
    //     instance.togglePreview()
        // setContent(value);
    // }

    const handleClose = removedTag => {
        const tag = tags.filter(tag => tag !== removedTag);
        setTags(tag)
    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        let tag;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tag = [...tags, inputValue];
        }
        if (tag) setTags(tag);
        setInputValue('');
        setInputVisible(false);
    };
    const showInput = () => setInputVisible(true);

    const forMap = tag => {
        const tagElem = (
            <Tag
                closable
                onClose={e => {
                    e.preventDefault();
                    handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    }

    const publish = () => {

        // console.log('title:', title, 'desc:', desc, 'tags:', tags, 'inputValue:', inputValue, 'inputVisible:', inputVisible, 'content:', content);
        const data = {title, desc, tags, content};
        props.publish(data);
        setTitle('');
        setDesc('');
        setTags([]);
        setContent('');
    }

    const tagChild = tags.map(forMap);

    return (
        <div>
            <Space direction="vertical" className='space'>
                标题：<Input allowClear={true} placeholder="标题" onChange={getTitle} value={title}/>
                描述：<Input allowClear={true} placeholder="描述" onChange={getDesc} value={desc} />
                标签：
                <Space>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: 'from',
                            duration: 100,
                            onComplete: e => {
                                e.target.style = '';
                            },
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                    >
                        {tagChild}
                    </TweenOneGroup>
                    {inputVisible && (
                        <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                        />
                    )}
                    {!inputVisible && (
                        <Tag onClick={showInput} className="site-tag-plus">
                            <PlusOutlined /> New Tag
                        </Tag>
                    )}
                </Space>
                <Space></Space>
                <SimpleMDE 
                    onChange={getContent} 
                    // getMdeInstance= { getInsance }
                    id="your-custom-id"
                    label="内容："
                    value={content}
                    options={{
                        autosave: {
                          enabled: true,
                        }
                    }} />
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: marked(content)}}></div>
                <Button style={{display: 'block', margin: '0 auto 50px'}} onClick={publish}>发布</Button>
            </Space>
        </div>
    )
}
export default connect(
    state => ({ data: state.data }),
    { publish }
)(Writer)