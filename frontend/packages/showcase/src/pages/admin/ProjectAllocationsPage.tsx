import { Link } from 'react-router-dom'
import { ArrowLeft, PieChart } from 'lucide-react'

export function ProjectAllocationsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/admin/projetos" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="heading-2">Alocações do Projeto</h1>
            <p className="text-slate-200">Gerencie alocações e distribuições</p>
          </div>
        </div>

        <div className="card text-center py-16">
          <PieChart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="heading-3 mb-4">Página em Desenvolvimento</h2>
          <p className="text-slate-200 mb-8">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
          <Link to="/admin/projetos" className="btn-primary">
            Voltar para Projetos
          </Link>
        </div>
      </div>
    </div>
  )
}
