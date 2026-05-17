// 월간 수익 리포트 온체인 해시 기록
// 배포된 Oracle 컨트랙트 (contracts/Oracle.sol)에 SHA-256 해시를 기록한다.
// NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS + Alchemy RPC 설정 후 활성화

import { createPublicClient, createWalletClient, http, parseAbi } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const ORACLE_ABI = parseAbi([
  'function recordMonthlyReport(string month, bytes32 reportHash, string note) external',
  'event MonthlyReportRecorded(string month, bytes32 reportHash, string note, uint256 timestamp)',
])

function getClients() {
  const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL ?? 'https://mainnet.base.org'
  const contractAddress = process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS as `0x${string}` | undefined
  const privateKey = process.env.ORACLE_ADMIN_PRIVATE_KEY as `0x${string}` | undefined

  if (!contractAddress || !privateKey) return null

  const account = privateKeyToAccount(privateKey)
  const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) })
  const walletClient = createWalletClient({ account, chain: base, transport: http(rpcUrl) })

  return { publicClient, walletClient, account, contractAddress }
}

export interface MonthlyReportParams {
  month: string    // 'YYYY-MM' (예: '2025-01')
  reportHash: string  // SHA-256 hex (리포트 PDF 해시)
  note?: string
}

// 온체인 해시 기록. 컨트랙트 미설정 시 null 반환.
export async function recordMonthlyReportHash(
  params: MonthlyReportParams,
): Promise<{ txHash: string } | null> {
  const clients = getClients()
  if (!clients) return null

  const { walletClient, contractAddress } = clients

  const hashBytes = `0x${params.reportHash.padStart(64, '0')}` as `0x${string}`

  try {
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: ORACLE_ABI,
      functionName: 'recordMonthlyReport',
      args: [params.month, hashBytes as `0x${string}`, params.note ?? ''],
    })

    return { txHash }
  } catch {
    return null
  }
}

// SHA-256 해시 계산 (파일 Buffer 또는 텍스트)
export async function computeSha256(data: Buffer | string): Promise<string> {
  const crypto = await import('crypto')
  const hash = crypto.createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}
