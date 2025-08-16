import { Users } from 'lucide-react'

export function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="heading-2">Gerenciar Usuários</h1>
          <p className="text-slate-200">Administre usuários da plataforma</p>
        </div>

        <div className="card text-center py-16">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="heading-3 mb-4">Página em Desenvolvimento</h2>
          <p className="text-slate-200 mb-8">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
