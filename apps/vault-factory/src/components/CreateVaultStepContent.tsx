import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { useSteps } from '@hooks/useSteps'
import { NetworkAndTokenForm } from './forms/NetworkAndTokenForm'

const allVaultStepContent: ReactNode[] = [<NetworkAndTokenForm />]

interface CreateVaultStepContentProps {
  className?: string
}

export const CreateVaultStepContent = (props: CreateVaultStepContentProps) => {
  const { className } = props

  const { step } = useSteps()

  const content = useMemo(() => allVaultStepContent[step] ?? <></>, [step])

  return (
    <div className={classNames('flex grow items-center justify-center', className)}>{content}</div>
  )
}