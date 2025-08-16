import { Shield } from 'lucide-react'

export function AdminCustodyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="heading-2">Gerenciar Custódia</h1>
          <p className="text-slate-200">Administre custódia de tokens e ativos</p>
        </div>

        <div className="card text-center py-16">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="heading-3 mb-4">Página em Desenvolvimento</h2>
          <p className="text-slate-200 mb-8">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
