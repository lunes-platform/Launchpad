import { ExternalLink, Globe, Twitter, MessageCircle, FileText } from 'lucide-react'

interface ProjectHeaderProps {
  project: {
    name: string
    description: string
    logo: string
    website: string
    twitter: string
    telegram: string
    whitepaper: string
    tier: string
    network: string
    tags: string[]
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case 'A':
      return 'bg-gradient-to-r from-primary to-primaryLight text-white'
    case 'B':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    case 'C':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    default:
      return 'bg-textMuted text-white'
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const socialLinks = [
    { icon: Globe, url: project.website, label: 'Website' },
    { icon: Twitter, url: project.twitter, label: 'Twitter' },
    { icon: MessageCircle, url: project.telegram, label: 'Telegram' },
    { icon: FileText, url: project.whitepaper, label: 'Whitepaper' },
  ]

  return (
    <section className="bg-slate-800/50 border-b border-slate-600Light">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left Side - Project Info */}
          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="text-6xl flex-shrink-0">
              {project.logo}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="heading-2">{project.name}</h1>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                  Tier {project.tier}
                </span>
                <span className="text-sm bg-slate-800 border border-slate-600Light rounded-full px-3 py-1 text-slate-200">
                  {project.network}
                </span>
              </div>
              
              <p className="text-slate-200 text-lg mb-4 max-w-2xl">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Social Links */}
          <div className="flex flex-col space-y-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button px-4 py-3 transition-colors duration-200 group"
              >
                <link.icon className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors duration-200" />
                <span className="text-sm font-medium">{link.label}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors duration-200" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
