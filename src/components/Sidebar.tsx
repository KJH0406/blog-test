import Link from 'next/link'
import { AiFillGithub, AiFillInstagram, AiOutlineClose } from 'react-icons/ai'

type SidebarProps = {
  close: () => void
  isOpen: boolean
}

const Sidebar = ({ close, isOpen }: SidebarProps) => {
  return (
    <div
      className={`absolute min-h-screen flex-col gap-6 border-r bg-white p-10 pr-6 text-base lg:relative ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex justify-end lg:hidden">
        <AiOutlineClose className="h-5 w-5" onClick={close} />
      </div>
      <Link href="/" className="w-48 font-medium text-gray-600 hover:underline">
        홈
      </Link>
      <Link
        href="/tag"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        태그
      </Link>
      <Link
        href="/category/Web-Development"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        Web Development
      </Link>
      <div className="mt-10 flex items-center gap-4">
        <Link href="https://www.instagram.com/_djangho" target="_blank">
          <AiFillInstagram className="h-6 w-6" />
        </Link>
        <Link href="https://www.github.com/KJH0406" target="_blank">
          <AiFillGithub className="h-6 w-6" />
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
