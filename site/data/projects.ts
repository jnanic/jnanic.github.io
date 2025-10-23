export interface Project {
  id: string;
  title: string;
  description: string;
  details: string[];
  technologies: string[];
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'spartahack-api',
    title: 'SpartaHack API',
    description: 'Lead a team of 3 web developers to port the existing SpartaHack API from Ruby on Rails to Python. The API serves as an endpoint for user registration, authentication, and application processing. Built using Flask framework to handle routing and PostgreSQL database for secure user data management.',
    details: [],
    technologies: ['Python', 'Flask', 'PostgreSQL', 'Ruby on Rails'],
    links: {
      github: 'https://github.com/SpartaHack/SpartaHack-API',
    },
  },
  {
    id: 'bikes4erp',
    title: '#BIKES4ERP Tracking Initiative',
    description: 'Contributed to a multi-platform solution enabling teachers, mechanics, and administrators to track bike fleets and manage inventory. Developed Firebase backend for real-time data synchronization in low-connectivity environments. Built and optimized ReactJS admin dashboard for fleet tracking and actionable performance analytics.',
    details: [],
    technologies: ['React', 'Firebase', 'JavaScript', 'ERP'],
    links: {
      website: 'https://www.capstone.cse.msu.edu/2020-08/projects/evolutio/',
    },
  },
];
