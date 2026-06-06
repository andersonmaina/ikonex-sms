import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-md">
      <div className="max-w-md w-full bg-surface border border-outline-variant rounded-2xl shadow-lg p-xl relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary opacity-10 rounded-full -ml-8 -mb-8"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md mb-lg">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
          
          <h1 className="font-headline-xl text-headline-xl font-bold text-primary mb-xs text-center">Welcome to Ikonex</h1>
          <p className="font-body-md text-on-surface-variant text-center mb-xl">
            School Management System. Please log in to continue.
          </p>
          
          <form onSubmit={handleLogin} className="w-full space-y-md">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-xs ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input 
                  type="email" 
                  defaultValue="admin@ikonex.edu"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-label-md text-on-surface-variant mb-xs ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary text-on-primary py-md rounded-lg font-label-lg mt-md shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Login In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
