import { ExternalLink } from 'lucide-react'

interface TeamSectionProps {
  team: Array<{
    name: string
    role: string
    avatar: string
    linkedin: string
    twitter: string
  }>
}

export function TeamSection({ team }: TeamSectionProps) {
  return (
    <div className="space-y-6">
      <h4 className="font-medium">Equipe</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div key={index} className="bg-slate-800 border border-slate-600Light rounded-card p-6 text-center">
            <div className="text-4xl mb-4">{member.avatar}</div>
            <h5 className="font-medium text-lg mb-1">{member.name}</h5>
            <p className="text-slate-200 text-sm mb-4">{member.role}</p>
            
            <div className="flex justify-center space-x-3">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
