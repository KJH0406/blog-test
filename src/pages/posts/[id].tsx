import { MarkdownViewer } from '@/components/Markdown'
import { Post } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { format, parseISO } from 'date-fns'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

type PostPageProps = Post

export default function PostPage({
  id,
  title,
  content,
  created_at,
  category,
  tags,
  preview_image_url,
}: PostPageProps) {
  const formattedDate = format(parseISO(created_at), 'yyyy년 MM월 dd일')

  return (
    <div className="container mx-auto flex flex-col px-4 pb-40 pt-20 gap-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="flex flex-row items-center gap-2">
        <Link
          href={`/categories/${category}`}
          className="rounded-md bg-slate-800 px-2 py-1 text-sm text-white"
        >
          {category}
        </Link>
        {tags.map((tag) => (
          <Link
            href={`/tags/${tag}`}
            key={tag}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500"
          >
            {tag}
          </Link>
        ))}
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
      {preview_image_url && (
        <Image
          src={preview_image_url}
          width={0}
          height={0}
          sizes="100vw"
          alt={title}
          className=" h-auto w-full"
        />
      )}
      <MarkdownViewer source={content} className="min-w-full" />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { id } = query

  const supabase = createClient(req.cookies)

  const { data } = await supabase.from('Post').select('*').eq('id', Number(id))

  if (!data) {
    return {
      notFound: true,
    }
  }

  const { title, content, created_at, category, tags, preview_image_url } =
    data[0]

  return {
    props: {
      id,
      title,
      content,
      created_at,
      category,
      tags: JSON.parse(tags),
      preview_image_url,
    },
  }
}
