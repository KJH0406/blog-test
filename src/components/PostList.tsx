import { cn } from '@/utils/style'
import { createClient } from '@/utils/supabase/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostCard } from './PostCard'

const supabase = createClient()

type PostListProps = {
  category?: string
  tag?: string
  className?: string
}

const PostList = ({ category, tag, className }: PostListProps) => {
  const { ref, inView } = useInView()
  const {
    data: postsPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      let request = supabase.from('Post').select('*')
      if (category) request = request.eq('category', category)
      if (tag) request = request.like('tags', `%${tag}%`)

      const { data } = await request
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + 4)
      if (!data) return { posts: [], nextPage: null }
      return {
        posts: data,
        nextPage: data.length === 5 ? pageParam + 5 : null,
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className={cn('flex flex-col items-center gap-8 pt-20', className)}>
      <h1
        className={cn(
          'text-2xl font-bold',
          category || tag ? 'visible' : 'hidden',
        )}
      >
        {category ? `${category}` : tag ? `# ${tag}` : ''}
      </h1>
      <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 lg:gap-x-7 lg:gap-y-12">
        {postsPages?.pages
          .flatMap((page) => page.posts)
          .map((post) => <PostCard key={post.id} {...post} />)}
      </div>
      <div ref={ref}></div>
    </div>
  )
}

export default PostList
