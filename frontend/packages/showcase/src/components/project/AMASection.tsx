import { Play, Calendar, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AMASectionProps {
  ama: {
    videoUrl: string
    transcript: string
    date: Date
  }
}

export function AMASection({ ama }: AMASectionProps) {
  return (
    <div className="space-y-6">
      <h4 className="font-medium">Sessão AMA</h4>
      
      <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-5 h-5 text-slate-200" />
          <span className="text-slate-200">
            Realizada em {formatDate(ama.date)}
          </span>
        </div>
        
        <div className="space-y-4">
          <a
            href={ama.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-button hover:bg-primary/20 transition-colors duration-200"
          >
            <Play className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Assistir Vídeo da AMA</span>
          </a>
          
          <div className="p-4 bg-slate-900 border border-slate-600Light rounded-button">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-slate-200" />
              <span className="font-medium">Transcrição</span>
            </div>
            <p className="text-slate-200 text-sm">
              {ama.transcript}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
