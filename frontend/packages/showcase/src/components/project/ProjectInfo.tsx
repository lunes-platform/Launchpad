interface ProjectInfoProps {
  project: {
    description: string
    tags: string[]
  }
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Sobre o Projeto</h4>
        <p className="text-slate-200 leading-relaxed">
          {project.description}
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Categorias</h4>
        <div className="flex flex-wrap gap-2">
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
  )
}
