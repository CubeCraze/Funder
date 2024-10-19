import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  isUsingCustomYieldSourceAtom,
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultOwnerAddressAtom
} from 'src/atoms'
import { Address, isAddress, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SimpleInput } from './SimpleInput'

interface OwnerAndFeesFormValues {
  vaultOwner: string
  vaultFee: string
  vaultFeeRecipient: string
}

interface OwnerAndFeesFormProps {
  className?: string
}

export const OwnerAndFeesForm = (props: OwnerAndFeesFormProps) => {
  const { className } = props

  const formMethods = useForm<OwnerAndFeesFormValues>({ mode: 'onChange' })

  const { address: userAddress } = useAccount()

  const [vaultOwner, setVaultOwner] = useAtom(vaultOwnerAddressAtom)
  const [vaultFeePercentage, setVaultFeePercentage] = useAtom(vaultFeePercentageAtom)
  const [vaultFeeRecipient, setVaultFeeRecipient] = useAtom(vaultFeeRecipientAddressAtom)
  const isUsingCustomYieldSource = useAtomValue(isUsingCustomYieldSourceAtom)

  const formVaultFee = formMethods.watch('vaultFee')

  const { step, setStep, nextStep } = useVaultCreationSteps()

  useEffect(() => {
    formMethods.setValue('vaultOwner', vaultOwner ?? userAddress ?? '', {
      shouldValidate: !!vaultOwner || !!userAddress
    })
    formMethods.setValue('vaultFee', '70', { shouldValidate: true }) // Set 70% as default
    formMethods.setValue('vaultFeeRecipient', vaultFeeRecipient ?? userAddress ?? '', {
      shouldValidate: true
    })
  }, [])

  useEffect(() => {
    formMethods.trigger('vaultFeeRecipient')
  }, [formVaultFee])

  const onSubmit = (data: OwnerAndFeesFormValues) => {
    setVaultOwner(data.vaultOwner.trim() as Address)
    setVaultFeePercentage(70 * 1e7) // Set fixed 70% value in form submission
    setVaultFeeRecipient(data.vaultFeeRecipient.trim() as Address)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <a
          href="https://safe.global/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm underline mt-1"
        >
          ❗Projects Should Create a Multisig
        </a>
        <SimpleInput
          formKey='vaultOwner'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.'
          }}
          placeholder='...'
          defaultValue={userAddress ?? zeroAddress}
          label='Vault Owner'
          needsOverride={!!userAddress}
          className='w-full max-w-md'
        />
        <SimpleInput
          formKey='vaultFee'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isValidPercentage: (v: string) =>
              (parseFloat(v) >= 0 && parseFloat(v) < 100) ||
              'Enter a number between 0 (inclusive) and 100 (exclusive).',
            isNotTooPrecise: (v) =>
              v.split('.').length < 2 || v.split('.')[1].length <= 6 || 'Too many decimals'
          }}
          defaultValue={'70'} // Set default value to 70
          label='Yield Fee % (Default and Locked)'
          className='w-full max-w-md'
          disabled={true} // Disable the input to make it unchangeable
        />
        <SimpleInput
          formKey='vaultFeeRecipient'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.',
            isNotZeroAddress: (v: string) =>
              !formVaultFee ||
              parseFloat(formVaultFee) === 0 ||
              v !== zeroAddress ||
              'Enter a wallet address to receive yield fees.'
          }}
          defaultValue={''} // Set defaultValue to an empty string
          label='Yield Fee Recipient (likely same as vault owner)'
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton onClick={isUsingCustomYieldSource ? () => setStep(step - 2) : undefined} />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
