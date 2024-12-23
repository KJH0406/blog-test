// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post, PostRequest } from '@/types'
import { createClient } from '@/utils/supabase/server'
import formidable from 'formidable'
import { readFileSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post>,
) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const form = formidable()

  const [fields, files] = await form.parse(req)

  let preview_image_url: string | null = null

  const supabase = createClient(req.cookies)

  if (files.preview_image?.length === 1) {
    const file = files.preview_image[0]
    const fileContent = await readFileSync(file.filepath)
    const fileName = `${file.newFilename}`
    const { data: uploadData, error } = await supabase.storage
      .from('blog-image')
      .upload(fileName, fileContent, {
        contentType: file.mimetype ?? undefined,
      })
    if (error) {
      console.log(error)

      res.status(403).end()
    }

    if (uploadData?.path) {
      const { data } = await supabase.storage
        .from('blog-image')
        .getPublicUrl(uploadData.path)
      preview_image_url = data.publicUrl
    }
  }

  const { title, category, tags, content } = fields

  const PostRequest = {
    title: title?.[0],
    category: category?.[0],
    tags: tags?.[0],
    content: content?.[0],
    preview_image_url,
  } as PostRequest

  const { data } = await supabase.from('Post').insert([PostRequest]).select()

  if (data && data.length === 1) {
    const { tags, ...reset } = data[0]
    res.status(200).json({ ...reset, tags: JSON.parse(tags) as string[] })
  } else {
    res.status(500).end()
  }
}

// 파싱 충돌 방지
export const config = {
  api: {
    bodyParser: false,
  },
}
