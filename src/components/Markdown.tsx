import { MarkdownPreviewProps } from '@uiw/react-markdown-preview'
import { MDEditorProps } from '@uiw/react-md-editor'
import dynamic from 'next/dynamic'

import '@uiw/react-markdown-preview/markdown.css'
import '@uiw/react-md-editor/markdown-editor.css'

const MdEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

const MdViewer = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
})

export const MarkdownEditor = ({ ...rest }: MDEditorProps) => {
  return (
    <div data-color-mode="light">
      <MdEditor {...rest} />
    </div>
  )
}

export const MarkdownViewer = ({ ...rest }: MarkdownPreviewProps) => {
  return (
    <div data-color-mode="light">
      <MdViewer {...rest} />
    </div>
  )
}
