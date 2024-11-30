import { Post } from '@/types'
import { cn } from '@/utils/style'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

type PostCardProps = Omit<Post, 'tags'> & {
  className?: string
}

export const PostCard: FC<PostCardProps> = ({
  id,
  title,
  content,
  preview_image_url,
  created_at,
  className,
}) => {
  return (
    <Link href={`/posts/${id}`} className={cn('bg-white', className)}>
      <div className="relative aspect-[1.8/1] w-full">
        <Image
          src={preview_image_url ?? '/thumbnail.svg'}
          fill
          alt={title}
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="line-clamp-3 text-sm text-gray-500">{content}</p>
        <p className="mt-2 text-xs text-gray-400">
          {new Date(created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </Link>
  )
}
