interface TokenomicsChartProps {
  tokenomics: {
    totalSupply: number
    distribution: Array<{
      label: string
      value: number
      color: string
    }>
  }
}

export function TokenomicsChart({ tokenomics }: TokenomicsChartProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Distribuição de Tokens</h4>
        <p className="text-slate-200 mb-4">
          Total Supply: {tokenomics.totalSupply.toLocaleString()} tokens
        </p>
        
        <div className="space-y-3">
          {tokenomics.distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600Light rounded-button">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-slate-200">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
