import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">403</h1>
      <p className="text-lg font-semibold text-slate-700 mb-1">Access Denied</p>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        You do not have permission to access this page with your current account role.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
