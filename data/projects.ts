export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'spartahack-api',
    title: 'SpartaHack API',
    description: 'Ported the existing SpartaHack API from Ruby on Rails to Python. The API serves as an endpoint for user registration, authentication, and application processing. Uses Flask for routing and Postgres as a database with SQLAlchemy ORM. Implemented OAuth for SpartaHack VI.',
    tech: ['Python', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'OAuth'],
    link: 'https://github.com/yash1337',
    featured: true,
  },
  // Add more projects here - just copy this structure:
  // {
  //   id: 'unique-id',
  //   title: 'Project Name',
  //   description: 'Brief description of what the project does and technologies used.',
  //   tech: ['Tech1', 'Tech2', 'Tech3'],
  //   link: 'https://github.com/...',
  //   featured: true/false,
  // },
]
