import {useState} from "react";
import {useLogin} from "../hooks/useAuth.js";

export const ModelLogin = ({onClose}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { mutate: login, isLoading, error } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    login( {email, password },
      {
        onSuccess: (data)=> {
          console.log("Login Success:", data);
          onClose (data)
        },
          onError: (error)=> {
          console.log (error)
        },
      })
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]">
      <div className="p-6 rounded-xl shadow-xl w-lg bg-amber-50 text-gray-800">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className=" space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">Login failed</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 rounded"
              onClick={() => onClose(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
