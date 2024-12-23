import Input from '@/components/Inupt'
import { MarkdownEditor } from '@/components/Markdown'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FormEvent, useRef, useState } from 'react'
import ReactSelect from 'react-select'

const supabase = createClient()

export default function Write({}) {
  const router = useRouter()

  const titleRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: existingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('category')
      return Array.from(new Set(data?.map((post) => post.category)))
    },
  })
  const { data: existingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('tags')
      return Array.from(new Set(data?.flatMap((post) => JSON.parse(post.tags))))
    },
  })

  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !titleRef.current?.value ||
      titleRef.current?.value.trim().length === 0
    ) {
      return alert('제목을 입력해주세요.')
    }
    if (category.length === 0) {
      return alert('카테고리를 선택해주세요.')
    }
    if (tags.length === 0) {
      return alert('태그를 선택해주세요.')
    }
    if (content.length === 0) {
      return alert('내용을 입력해주세요.')
    }

    const formData = new FormData()
    formData.append('title', titleRef.current?.value ?? '')
    formData.append('category', category)
    formData.append('tags', tags)
    formData.append('content', content)

    if (fileRef.current?.files?.[0]) {
      formData.append('preview_image', fileRef.current.files[0])
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.id) {
      router.push(`/posts/${data.id}`)
    }
  }

  return (
    <div className="container mx-auto flex flex-col px-4 pb-20 pt-12">
      <h1 className="mb-8 text-2xl font-medium">새로운 글</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input type="text" placeholder="제목" ref={titleRef} />
          <Input type="file" accept="image/*" ref={fileRef} />
          <ReactSelect
            options={existingCategories?.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="카테고리"
            onChange={(e) => e?.value && setCategory(e.value)}
            isMulti={false}
          />
          <ReactSelect
            options={existingTags?.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            placeholder="태그"
            onChange={(e) =>
              e && setTags(JSON.stringify(e.map((e) => e.value)))
            }
            isMulti
          />
          <MarkdownEditor
            height={500}
            value={content}
            onChange={(value) => value && setContent(value)}
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-gray-800 py-2 text-white"
        >
          작성하기
        </button>
      </form>
    </div>
  )
}
