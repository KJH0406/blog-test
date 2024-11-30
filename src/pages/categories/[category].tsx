import PostList from '@/components/PostList'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'

type CategoryPostsProps = {
  category: string
}

const supabase = createClient()

export default function CategoryPosts({ category }: CategoryPostsProps) {
  const { data: posts } = useQuery({
    queryKey: ['posts', category],
    queryFn: async () => {
      const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      if (!data) return []
      return data
    },
  })

  return <PostList category={category} />
}

export const getServerSideProps: GetServerSideProps<
  CategoryPostsProps
> = async ({ query }) => {
  return {
    props: {
      category: query.category as string,
    },
  }
}
