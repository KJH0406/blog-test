import { GetServerSideProps } from 'next'

type PostProps = {
  id: string
}

export default function Post({ id }: PostProps) {
  return (
    <div className="flex">
      <h1>DUMMY POST</h1>
      <p>ID: {id}</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query

  return {
    props: {
      id,
    },
  }
}
