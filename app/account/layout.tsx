import { ReactNode } from 'react'
import SideNavigation from '../_components/SideNavigation'

type Props = {
  children: ReactNode
}

export default function layout({ children }: Props) {
  return (
    <div className='grid grid-cols-[16rem_1fr] h-full gap-12'>
      <SideNavigation />
      <div>{children}</div>
    </div>
  )
}
