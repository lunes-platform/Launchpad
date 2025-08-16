import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  variant?: 'default' | 'gradient' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  variant = 'default',
  size = 'md',
  children
}: StatsCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30'
      case 'minimal':
        return 'bg-transparent border-none shadow-none'
      default:
        return 'card'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4'
      case 'lg':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  const getValueSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xl'
      case 'lg':
        return 'text-4xl'
      default:
        return 'text-2xl'
    }
  }

  return (
    <div className={`${getVariantClasses()} ${getSizeClasses()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 bg-${iconColor.replace('text-', '')}/20 rounded-full flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        
        {trend && (
          <div className={`text-xs flex items-center space-x-1 ${
            trend.isPositive ? 'text-success' : 'text-error'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className={`font-bold ${getValueSize()} leading-none`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-200 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-slate-200 font-medium">{title}</p>

      {/* Trend Label */}
      {trend && (
        <p className="text-xs text-slate-400 mt-2">{trend.label}</p>
      )}

      {/* Custom Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Specialized Stats Cards
interface MetricCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    period: string
  }
  icon?: LucideIcon
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

export function MetricCard({ label, value, change, icon: Icon, color = 'primary' }: MetricCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/20',
    success: 'text-success bg-success/20',
    warning: 'text-warning bg-warning/20',
    error: 'text-error bg-error/20',
    info: 'text-info bg-info/20'
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className={`w-4 h-4 text-${color}`} />
          </div>
        )}
        
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            change.value >= 0 
              ? 'bg-success/20 text-success' 
              : 'bg-error/20 text-error'
          }`}>
            {change.value >= 0 ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      
      <p className="text-2xl font-bold mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      
      <p className="text-sm text-slate-200">{label}</p>
      
      {change && (
        <p className="text-xs text-slate-400 mt-1">{change.period}</p>
      )}
    </div>
  )
}

// Progress Stats Card
interface ProgressStatsCardProps {
  title: string
  current: number
  target: number
  unit?: string
  color?: string
  showPercentage?: boolean
}

export function ProgressStatsCard({ 
  title, 
  current, 
  target, 
  unit = '', 
  color = 'primary',
  showPercentage = true 
}: ProgressStatsCardProps) {
  const percentage = (current / target) * 100

  return (
    <div className="card p-6">
      <h3 className="font-medium mb-4">{title}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>{current.toLocaleString()}{unit}</span>
          <span className="text-slate-200">{target.toLocaleString()}{unit}</span>
        </div>
        
        <div className="w-full bg-borderLight rounded-full h-2">
          <div
            className={`bg-${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {showPercentage && (
        <div className="text-center">
          <p className={`text-2xl font-bold text-${color}`}>
            {percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-200">Concluído</p>
        </div>
      )}
    </div>
  )
}

// Comparison Stats Card
interface ComparisonStatsCardProps {
  title: string
  items: Array<{
    label: string
    value: number
    color: string
  }>
}

export function ComparisonStatsCard({ title, items }: ComparisonStatsCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="card p-6">
      <h3 className="font-medium mb-4">{title}</h3>
      
      <div className="space-y-3">
        {items.map((item, index) => {
          const percentage = (item.value / total) * 100
          
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span className="font-medium">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-borderLight rounded-full h-2">
                <div
                  className={`bg-${item.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-600Light">
        <div className="flex justify-between">
          <span className="text-sm text-slate-200">Total</span>
          <span className="font-bold">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
