import LoginForm from '../features/auth/components/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            BIO<span className="text-blue-500">MATCHER</span>
          </h1>
          <p className="text-slate-400 font-medium">Versión Management System (VMS)</p>
          <div className="mt-4 inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-blue-400 font-mono">
            Gamasis Central Auth
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
