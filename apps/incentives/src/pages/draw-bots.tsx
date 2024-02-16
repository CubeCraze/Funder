import classNames from 'classnames'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function DrawBotsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Draw Auction Bot Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <Section
          title='What needs to be done?'
          content={
            <>
              <p>
                Every draw a random number must be generated, bridged* and supplied to the prize
                pool so that prizes may be awarded.
              </p>
              <p>
                The reward for doing so is a percentage of the prize pool's reserve, kept separate
                for this purpose. This percentage climbs non-linearly throughout the span of a draw
                period after it is closed.
              </p>
              <p className='text-lg text-pt-purple-300'>
                *While the current RNG implementation requires bridging from Ethereum mainnet to
                L2s, this system is currently being refactored. Check back soon!
              </p>
            </>
          }
        />
        <Section
          title='What is the incentive?'
          content={
            <div className='flex flex-col'>
              <span>Bot runners compete for</span>
              <span className='text-5xl'>up to $150/mo*</span>
              <span className='text-pt-purple-300'>*approximation based on current yield</span>
            </div>
          }
        />
        <Section
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              <ResourceLink href='https://dev.pooltogether.com/protocol/design/draw-auction'>
                Dev Docs: Draw Auction Design
              </ResourceLink>
              <ResourceLink href='https://dev.pooltogether.com/protocol/guides/completing-draw-auctions'>
                Dev Docs: Completing Draw Auctions Guide
              </ResourceLink>
              <ResourceLink href='https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F/1o-d_ScnJ8F0cer5SRmILMSPxTCn4vlWgN7fkU4FD4o'>
                Tutorial: Building a draw auctioning bot
              </ResourceLink>
              <ResourceLink href='https://github.com/GenerationSoftware/pt-v5-autotasks-monorepo'>
                Example: G9 Bots Monorepo
              </ResourceLink>
              <ResourceLink href='https://analytics.cabana.fi'>
                Analytics: Draws (Cabanalytics)
              </ResourceLink>
              <ResourceLink href='https://pooltime.app/draws'>
                Analytics: Draws (PoolTime)
              </ResourceLink>
            </div>
          }
        />
      </div>
    </Layout>
  )
}

interface SectionProps {
  title: string
  content: ReactNode
  className?: string
}

const Section = (props: SectionProps) => {
  const { title, content, className } = props

  return (
    <section className={classNames('flex flex-col gap-2 text-xl', className)}>
      <span className='text-pt-purple-300 font-semibold'>{title}</span>
      {content}
    </section>
  )
}