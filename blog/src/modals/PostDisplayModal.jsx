import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export const PostDisplayModal = ({post, onClose}) => {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const initialPadding = window.innerWidth > document.documentElement.clientWidth
      ? `${window.innerWidth - document.documentElement.clientWidth}px`
      : "0px";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = initialPadding;

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose();
    }, 300);
  }

  const handleBackgroundClose = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackgroundClose}>
      <div
        className={`relative p-6 rounded-xl shadow-xl bg-amber-50 text-gray-800 w-1/2 h-1/2 max-h-[80vh] transition-transform duration-300 transform ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">{post?.title}</h2>
        <div className={"overflow-y-auto h-4/5"}>
          <p className="text-sm text-gray-600">{post?.content}</p>
        </div>
        <div className={"w-full inline-flex items-center justify-center"}>
          <button className={"bg-gray-400 rounded-md w-1/2 m-2 h-10"}
                  type={"button"}
                  onClick={handleClose}>
            Close
          </button>
          <Link as={"button"} to={`post/${post?.uuid}`}
                className={"bg-gray-400 rounded-md w-1/2 m-2 text-center content-center h-10"}
                type={"button"}
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  )
}
