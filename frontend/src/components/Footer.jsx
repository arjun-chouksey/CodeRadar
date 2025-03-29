const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">CodeRadar</h2>
            <p className="text-gray-300 text-sm mt-1">Track coding contests from your favorite platforms</p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Platforms</h3>
              <ul className="text-gray-300 text-sm">
                <li className="mb-1">
                  <a 
                    href="https://codeforces.com/contests" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Codeforces
                  </a>
                </li>
                <li>
                  <a 
                    href="https://leetcode.com/contest/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    LeetCode
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Resources</h3>
              <ul className="text-gray-300 text-sm">
                <li className="mb-1">
                  <a 
                    href="https://github.com/your-username/coderadar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/your-username/coderadar/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Report an Issue
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          &copy; {currentYear} CodeRadar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 