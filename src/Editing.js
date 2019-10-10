import React, { useState, useRef, useEffect, useMemo } from 'react';
import './App.css';

//改变ref --> 改变state和父组件的state
const Editing = (props) => {
  const { content, onChange: parentHandleChange, focus, onKeyDown: parentHandleKeyDown } = props
  const [value, setValue] = useState(content)
  const editRef = useRef(null)

  //触发input事件，改变state并且改变父组件的state
  const handleInput = (event) => {
    const newValue = editRef.current.innerText

    setValue(newValue)
    parentHandleChange(event, newValue)
  }

  //触发键盘事件，拦截回车:自己处理，或者返回给父组件处理
  const handleKeyDown = (event) => {

    if (event.key === 'Enter') {
			event.preventDefault()
      parentHandleKeyDown(event, editRef.current.innerText)
    }
  }

  const handleKeyUp = (event) => {

  }

  //设置光标到一行的末尾
  const setCursorToEnd = () => {
    if (focus && editRef.current) {
      //设置光标到最后一个字后面,如果存在则设置为1，否则为0. （如果起始节点类型是 Text， Comment, or CDATASection之一, 那么 startOffset指的是从起始节点算起字符的偏移量。 对于其他 Node 类型节点， startOffset 是指从起始结点开始算起子节点的偏移量。）
      const offset = value.length ? 1 : 0
      const range = document.createRange()
      range.setStart(editRef.current, offset)
      range.collapse(true)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const setFocus = () => {
    if (focus && editRef.current) {
      editRef.current.focus()
    }
  }

  useEffect(() => {
      setFocus()
      setCursorToEnd()
  }, [])

  const tempFn = () => {
    return (
      <p
        className='editing'
        contentEditable='true'
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{__html: value}}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        ref={editRef}
        />
    )
  }

  //只要ref不变，就不更新组件 --> 改变state也不去刷新
  const edit = useMemo( tempFn, [editRef])

  return (
    <>
    {edit}
    </>
  )
}

//改变ref--> 改变父组件state --> 通过props改变state（如果state和前面两个值不同，改变state
const Editing_V2 = (props) => {
    const { content, onChange: parentHandleChange } = props
    const [value, setValue] = useState(content)
    const editRef = useRef(null)

    //触发input事件，调用changeParentProps函数改变父组件的state
    const onInput = (event) => {
      const newValue = editRef.current.innerText

      parentHandleChange(newValue)
    }

    //如果state和ref以及props的值不同，更新state
    useEffect(() => {
      if (content === editRef.current.innerText && content !== value) {
        setValue(content)
      }
    },[content, value])

    const tempFn = () => {
      return (
        <div
          className='editing'
          contentEditable='true'
          suppressContentEditableWarning
          onInput={onInput}
          ref={editRef}
          >
          {value}
          </div>
      )
    }

    //只要ref不变，就不更新组件 --> 改变state也不去刷新
    const edit = useMemo( tempFn, [editRef])

    return (
      <>
      {edit}
      </>
    )
  }

export default Editing
