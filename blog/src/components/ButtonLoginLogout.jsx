export const ButtonLoginLogout = ({ user, onLoginClick, onLogout}) => {
  const toggleButtonType = () => {
    if (user === null) {
      return (
        <button
          onClick={onLoginClick}
          className="w-full m-1 text-left !text-blue-500 hover:underline"
        >
          Login
        </button>
      );
    }
    return (
      <button
        onClick={onLogout}
        className="w-full m-1 text-left !text-red-600 hover:underline"
      >
        Logout
      </button>
    );
  }
  return (
    <div className="w-full mt-5 border-t pt-4">
      <div className="w-fit">
        {toggleButtonType()}
      </div>
    </div>
  )
}
