# AI-Powered Task Management System

A modern, intelligent task management system that leverages AI to help users organize, prioritize, and manage their tasks more effectively.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://vaibhavk1-ai-task-manager.vercel.app/)

## 🚀 Features

### Core Features
- **Smart Task Management**
  - Create, edit, and delete tasks
  - Set priorities (low, medium, high)
  - Track task status (todo, in progress, in review, done)
  - Add due dates and estimated completion times
  - Organize tasks with tags
  - Break down tasks into subtasks

### AI Integration
- **AI-Powered Insights**
  - Task priority suggestions
  - Time estimation assistance
  - Smart task categorization
  - Workload optimization recommendations

### User Experience
- **Modern Interface**
  - Drag-and-drop task organization
  - Real-time updates
  - Responsive design for all devices
  - Dark/Light theme support
  - Smooth animations and transitions

### Collaboration
- **Team Features**
  - Assign tasks to team members
  - Track team member workload
  - Real-time collaboration
  - Team member status indicators

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling and UI components
- **Shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **Lucide Icons** - Modern icon set
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend & Database
- **Supabase**
  - Authentication
  - Real-time database
  - Row Level Security
  - PostgreSQL database

### Development Tools
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
├── lib/               # Utility functions and API
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   └── app/           # Main application pages
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/vaibhavk10/Ai-Task_Manager.git
cd Ai-Task_Manager
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 🔐 Authentication

The application uses Supabase Authentication with the following features:
- Email/Password authentication
- Secure session management
- Protected routes
- User profile management

## 💾 Database Schema

### Tasks Table
```sql
-- Drop existing table and policies
drop policy if exists "Enable read access for all users" on public.tasks;
drop policy if exists "Enable insert access for all users" on public.tasks;
drop policy if exists "Enable update access for all users" on public.tasks;
drop policy if exists "Enable delete access for all users" on public.tasks;
drop table if exists public.tasks;

-- Create the tasks table with the updated structure
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    priority text not null check (priority in ('low', 'medium', 'high')),
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done')),
    due_date timestamp with time zone not null,
    estimated_time text,
    assignee_name text not null,
    assignee_avatar text not null,
    ai_insights text,
    tags text[] default array[]::text[],
    subtasks jsonb default '[]'::jsonb,
    user_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS but allow all operations for now
alter table public.tasks enable row level security;

-- Create policies that allow all operations for everyone
create policy "Enable read access for all users" 
on public.tasks for select 
using (true);

create policy "Enable insert access for all users" 
on public.tasks for insert 
with check (true);

create policy "Enable update access for all users" 
on public.tasks for update 
using (true);

create policy "Enable delete access for all users" 
on public.tasks for delete 
using (true);

-- Grant access to authenticated and anon users
grant all on public.tasks to authenticated, anon;

-- Insert a test task to verify everything works
insert into public.tasks (
    title,
    description,
    priority,
    status,
    due_date,
    estimated_time,
    assignee_name,
    assignee_avatar,
    ai_insights,
    tags,
    subtasks,
    user_id
) values (
    'Test Task',
    'This is a test task to verify the table setup',
    'medium',
    'todo',
    now(),
    '2 hours',
    'Test User',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
    'Test insights',
    array['test', 'setup'],
    '[{"title": "Subtask 1", "completed": false}, {"title": "Subtask 2", "completed": true}]',
    'anonymous'
) returning *;
```


## 🎨 UI Components

The application uses a combination of custom components and shadcn/ui:
- Custom themed components
- Responsive layouts
- Accessible design
- Dark/Light mode support

## 🔄 State Management

- React Context for global state
- Local state with useState
- Form state with React Hook Form
- Real-time updates with Supabase subscriptions

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Different screen sizes and orientations

## 🔒 Security

- Row Level Security (RLS) policies
- Secure authentication
- Protected API endpoints
- Input validation and sanitization

## 🚀 Deployment

The application can be deployed to various platforms:
- Vercel
- Netlify
- AWS
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Framer Motion](https://www.framer.com/motion/) for animations

---

<div align="center">
  <a href="https://vaibhavk1-ai-task-manager.vercel.app/">
    <img src="https://img.shields.io/badge/View-Live%20Demo-blue?style=for-the-badge" alt="Live Demo" />
  </a>
</div>
