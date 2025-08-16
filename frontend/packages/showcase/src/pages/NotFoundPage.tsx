import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="container-custom text-center">
        <div className="max-w-md mx-auto">
          <div className="text-8xl mb-8">🌙</div>
          <h1 className="heading-1 mb-4">404</h1>
          <h2 className="heading-3 mb-4">Página Não Encontrada</h2>
          <p className="text-slate-200 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Anterior
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
