export type InvestmentStatus = 'PENDING' | 'DEPOSITED' | 'ACTIVE' | 'WITHDRAWN'
export type WithdrawStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED'

export interface User {
  id: string
  email?: string | null
  walletAddress?: string | null
  name?: string | null
  createdAt: Date
}

export interface Investment {
  id: string
  userId: string
  amountKrw: number
  tokenAmount: number
  entryPrice: number
  status: InvestmentStatus
  contractSigned: boolean
  depositConfirmed: boolean
  tokenMinted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OraclePrice {
  id: string
  price: number
  updatedBy: string
  note?: string | null
  createdAt: Date
}

export interface WithdrawRequest {
  id: string
  userId: string
  tokenAmount: number
  krwAmount: number
  txHash?: string | null
  status: WithdrawStatus
  createdAt: Date
  processedAt?: Date | null
}

export interface InviteLink {
  id: string
  token: string
  usedBy?: string | null
  usedAt?: Date | null
  expiresAt?: Date | null
  createdAt: Date
}

export interface DashboardData {
  tokenBalance: number
  currentPrice: number
  valuationKrw: number
  roi: number
  entryPrice: number
  priceHistory: { date: string; price: number }[]
  lockupEndsAt?: Date | null
  investment: Investment
}

// API response wrappers
export interface ApiOraclePriceResponse {
  currentPrice: number
  history: { date: string; price: number }[]
}

export interface ApiDashboardResponse extends DashboardData {
  user: Pick<User, 'id' | 'name' | 'email' | 'walletAddress'>
}
