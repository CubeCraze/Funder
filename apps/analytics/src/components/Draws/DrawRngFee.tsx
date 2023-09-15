import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  NETWORK,
  shorten,
  sToMs
} from '@shared/utilities'
import classNames from 'classnames'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRngFeeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRngFee = (props: DrawRngFeeProps) => {
  const { prizePool, drawId, className } = props

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const rngTx = allRngTxs?.find((txs) => txs.rng.drawId === drawId)?.rng

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentFeePercentage } = useDrawRngFeePercentage({ refetchInterval: sToMs(60) })

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{isFetchedAllRngTxs && !rngTx ? 'Current ' : ''}RNG Fee</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700 whitespace-nowrap'>
        {isFetchedAllRngTxs ? (
          <>
            <span>
              {!!rngTx ? (
                <>
                  {!!rngTx.fee && !!prizeToken ? (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(rngTx.fee, prizeToken.decimals, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>{' '}
                      {prizeToken.symbol} (
                      {formatBigIntForDisplay(rngTx.feeFraction, 16, { maximumFractionDigits: 0 })}
                      %)
                    </>
                  ) : (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(rngTx.feeFraction, 16, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      %
                    </>
                  )}
                </>
              ) : !!currentFeePercentage ? (
                <>
                  <span className='text-xl font-semibold'>
                    {currentFeePercentage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  %
                </>
              ) : (
                <span>-</span>
              )}
            </span>
            {!!rngTx ? (
              <ExternalLink href={getBlockExplorerUrl(NETWORK.mainnet, rngTx.hash, 'tx')}>
                {shorten(rngTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              !!currentFeePercentage && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}