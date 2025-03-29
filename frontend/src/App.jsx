import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AllContests from './components/AllContests';
import UpcomingContests from './components/UpcomingContests';
import OngoingContests from './components/OngoingContests';
import Footer from './components/Footer';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all" element={<AllContests />} />
              <Route path="/upcoming" element={<UpcomingContests />} />
              <Route path="/ongoing" element={<OngoingContests />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
