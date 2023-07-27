import {
  VAULT_FACTORY_ADDRESSES,
  VaultDeployInfo,
  vaultFactory as vaultFactoryAbi
} from '@pooltogether/hyperstructure-client-js'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits a `deployVault` transaction to the vault factory
 * @param vaultDeployInfo data needed to deploy a new vault
 * @param options optional callbacks
 * @returns
 */
export const useSendDeployVaultTransaction = (
  vaultDeployInfo: VaultDeployInfo,
  options?: { onSend?: () => void; onSuccess?: () => void; onError?: () => void }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: Address
  txReceipt?: TransactionReceipt
  sendDeployVaultTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const {
    chainId,
    token,
    name,
    symbol,
    twabController,
    yieldSourceAddress,
    prizePool,
    claimer,
    feeRecipient,
    feePercentage,
    owner
  } = vaultDeployInfo

  const vaultFactoryAddress = chainId ? VAULT_FACTORY_ADDRESSES[chainId] : undefined

  const enabled =
    !!vaultDeployInfo &&
    !!chainId &&
    !!token &&
    !!name &&
    !!symbol &&
    !!twabController &&
    !!yieldSourceAddress &&
    prizePool &&
    !!claimer &&
    !!feeRecipient &&
    feePercentage !== undefined &&
    !!owner &&
    !!vaultFactoryAddress &&
    chain?.id === chainId

  const { config } = usePrepareContractWrite({
    chainId,
    address: vaultFactoryAddress,
    abi: vaultFactoryAbi,
    functionName: 'deployVault',
    args: [
      token,
      name,
      symbol,
      twabController,
      yieldSourceAddress,
      prizePool,
      claimer,
      feeRecipient,
      BigInt(feePercentage),
      owner
    ],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    write
  } = useContractWrite(config)

  const sendDeployVaultTransaction = !!write
    ? () => {
        write()
        options?.onSend?.()
      }
    : undefined

  const txHash = txSendData?.hash

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId, hash: txHash })

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendDeployVaultTransaction
  }
}