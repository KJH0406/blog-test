import PostList from '@/components/PostList'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'

type TagPostsProps = {
  tag: string
}

const supabase = createClient()

export default function TagPosts({ tag }: TagPostsProps) {
  const { data: posts } = useQuery({
    queryKey: ['posts', tag],
    queryFn: async () => {
      const { data } = await supabase
        .from('Post')
        .select('*')
        .like('tags', `%${tag}%`)
        .order('created_at', { ascending: false })
      if (!data) return []
      return data
    },
  })

  return <PostList tag={tag} />
}

export const getServerSideProps: GetServerSideProps<TagPostsProps> = async ({
  query,
}) => {
  return {
    props: {
      tag: query.tag as string,
    },
  }
}
