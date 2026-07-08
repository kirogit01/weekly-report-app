import Navbar from '../components/Layout/Navbar';
import ProjectManager from '../components/Projects/ProjectManager';

const ProjectsPage = () => (
  <div>
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Projects / Categories</h1>
      <ProjectManager />
    </div>
  </div>
);

export default ProjectsPage;
