import { Link } from 'react-router-dom';
import { useAuth } from '../contexts';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to KCA Event Management</h1>
      {currentUser && (
        <Link to="/dashboard">Go to Dashboard</Link>
      )}
    </div>
  );
}
