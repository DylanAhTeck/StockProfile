export interface Portfolio {
    ticker: string,
    name: string,
    quantity: number,
    totalCost: number,
    averageCostPerShare: number,
    currentPrice: number,
    marketValue: number
    change: number
}