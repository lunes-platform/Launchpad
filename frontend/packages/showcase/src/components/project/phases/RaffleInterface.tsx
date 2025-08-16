import { useState } from 'react'
import { Gift, Ticket, Clock, DollarSign, Trophy, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency, formatTokenAmount } from '@/lib/utils'
import toast from 'react-hot-toast'

interface RaffleInterfaceProps {
  project: {
    id: string
    name: string
  }
}

// Mock raffle data
const raffleDraws = [
  {
    id: 1,
    name: 'Sorteio USDT #1',
    prize: 1000,
    currency: 'USDT',
    ticketPrice: 0.50,
    minTickets: 20,
    maxTickets: 100,
    drawTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    totalTickets: 2500,
    soldTickets: 1847,
    paymentMethods: ['USDT-TON', 'USDT-Solana'],
  },
  {
    id: 2,
    name: 'Sorteio USDT #2',
    prize: 1000,
    currency: 'USDT',
    ticketPrice: 0.50,
    minTickets: 20,
    maxTickets: 100,
    drawTime: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
    totalTickets: 2500,
    soldTickets: 1203,
    paymentMethods: ['USDT-TON', 'USDT-Solana'],
  },
  {
    id: 3,
    name: 'Sorteio LUNES',
    prize: 500,
    currency: 'LUNES',
    ticketPrice: 2.00,
    minTickets: 10,
    maxTickets: 50,
    drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    totalTickets: 1000,
    soldTickets: 756,
    paymentMethods: ['LUNES'],
  },
]

export function RaffleInterface({ project }: RaffleInterfaceProps) {
  const { selectedAccount } = useWallet()
  const [selectedDraw, setSelectedDraw] = useState(raffleDraws[0])
  const [ticketQuantity, setTicketQuantity] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(selectedDraw.paymentMethods[0])
  const [isBuying, setIsBuying] = useState(false)
  const [userTickets, setUserTickets] = useState<{[key: number]: number}>({}) // Mock user tickets

  const handleBuyTickets = async () => {
    const quantity = parseInt(ticketQuantity)
    
    if (!quantity || quantity < selectedDraw.minTickets) {
      toast.error(`Mínimo ${selectedDraw.minTickets} bilhetes`)
      return
    }

    if (quantity > selectedDraw.maxTickets) {
      toast.error(`Máximo ${selectedDraw.maxTickets} bilhetes`)
      return
    }

    setIsBuying(true)
    
    try {
      // Mock ticket purchase
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUserTickets(prev => ({
        ...prev,
        [selectedDraw.id]: (prev[selectedDraw.id] || 0) + quantity
      }))
      
      toast.success(`${quantity} bilhetes comprados com sucesso!`)
      setTicketQuantity('')
    } catch (error) {
      toast.error('Erro ao comprar bilhetes')
    } finally {
      setIsBuying(false)
    }
  }

  const totalCost = ticketQuantity ? parseInt(ticketQuantity) * selectedDraw.ticketPrice : 0
  const winChance = ticketQuantity ? (parseInt(ticketQuantity) / selectedDraw.totalTickets) * 100 : 0

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="heading-4">Sistema de Rifas</h3>
          <p className="text-slate-200 text-sm">
            Sorteios diários garantidos com prêmios em tokens
          </p>
        </div>
      </div>

      {/* Draw Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Escolha o Sorteio</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {raffleDraws.map((draw) => (
            <button
              key={draw.id}
              onClick={() => {
                setSelectedDraw(draw)
                setSelectedPayment(draw.paymentMethods[0])
                setTicketQuantity('')
              }}
              className={`p-4 border rounded-button transition-all duration-200 text-left ${
                selectedDraw.id === draw.id
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-600Light hover:border-primary/30'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="font-medium">{draw.name}</span>
              </div>
              <p className="text-2xl font-bold text-success mb-1">
                ${draw.prize} {draw.currency}
              </p>
              <p className="text-xs text-slate-200">
                Bilhete: ${draw.ticketPrice}
              </p>
              <div className="mt-2">
                <div className="w-full bg-borderLight rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(draw.soldTickets / draw.totalTickets) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {draw.soldTickets}/{draw.totalTickets} vendidos
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Draw Details */}
      <div className="bg-slate-800 border border-slate-600Light rounded-button p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">{selectedDraw.name}</h4>
          <div className="flex items-center space-x-2 text-warning">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {Math.ceil((selectedDraw.drawTime.getTime() - Date.now()) / (1000 * 60 * 60))}h restantes
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400 block">Prêmio</span>
            <span className="font-medium text-success text-lg">
              ${selectedDraw.prize} {selectedDraw.currency}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Preço do Bilhete</span>
            <span className="font-medium">${selectedDraw.ticketPrice}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Min/Max Bilhetes</span>
            <span className="font-medium">{selectedDraw.minTickets}/{selectedDraw.maxTickets}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Seus Bilhetes</span>
            <span className="font-medium text-primary">
              {userTickets[selectedDraw.id] || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Método de Pagamento</label>
        <div className="flex gap-3">
          {selectedDraw.paymentMethods.map((method) => (
            <button
              key={method}
              onClick={() => setSelectedPayment(method)}
              className={`flex-1 p-3 border rounded-button transition-all duration-200 ${
                selectedPayment === method
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-600Light hover:border-primary/30'
              }`}
            >
              <span className="font-medium">{method}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Quantidade de Bilhetes</label>
        <div className="relative">
          <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            value={ticketQuantity}
            onChange={(e) => setTicketQuantity(e.target.value)}
            placeholder="0"
            min={selectedDraw.minTickets}
            max={selectedDraw.maxTickets}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Mínimo: {selectedDraw.minTickets} bilhetes</span>
          <span>Máximo: {selectedDraw.maxTickets} bilhetes</span>
        </div>
      </div>

      {/* Purchase Summary */}
      {ticketQuantity && parseInt(ticketQuantity) > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-button p-4 mb-6">
          <h4 className="font-medium text-primary mb-3">Resumo da Compra</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-200">Bilhetes:</span>
              <span className="font-medium">{ticketQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Custo Total:</span>
              <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Chance de Ganhar:</span>
              <span className="font-medium text-success">{winChance.toFixed(4)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Pagamento:</span>
              <span className="font-medium">{selectedPayment}</span>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Info */}
      <div className="bg-info/10 border border-info/20 rounded-button p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-info font-medium mb-1">
              Estratégia de Preços
            </p>
            <p className="text-sm text-slate-200">
              Bilhetes baratos incentivam compras em volume. Quanto mais bilhetes, maior sua chance de ganhar!
              Sorteios garantidos todos os dias.
            </p>
          </div>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyTickets}
        disabled={!ticketQuantity || parseInt(ticketQuantity) < selectedDraw.minTickets || isBuying}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBuying ? (
          'Comprando Bilhetes...'
        ) : (
          <>
            <Ticket className="w-4 h-4 mr-2" />
            Comprar {ticketQuantity || 0} Bilhetes {totalCost > 0 && `por $${totalCost.toFixed(2)}`}
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        Sorteios são realizados automaticamente no horário programado.
        Vencedores são notificados por email e podem reivindicar prêmios na dashboard.
      </p>
    </div>
  )
}
