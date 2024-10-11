// 생성자 : Haein

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isLoggedIn, logout } from "../../store";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);
  const loggedIn = isLoggedIn(useSelector((state) => state));

  const handleLogout = () => {
    dispatch(logout());
    toast.success("로그아웃 되었습니다.");
    navigate("/");
  };
  const handleTitle = () => {
    navigate("/");
  };

  return (
    <header className="w-full min-h-16 bg-white shadow-md">
      <div className="w-full max-w-screen-lg mx-auto">
        <div className="flex flex-row justify-between items-center w-full h-full py-2">
          <div className="w-36 h-12 flex items-center justify-start text-emerald-500 font-bold text-2xl rounded-md">
            <span style={{ cursor: "pointer" }} onClick={handleTitle}>
              모여용
            </span>
          </div>

          <div className="w-36 relative">
            <div className="relative group">
              <div className="cursor-pointer text-lg font-medium text-gray-600 hover:text-emerald-500 transition-colors duration-500">
                임시메뉴
              </div>
              <ul className="absolute left-0 mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-white shadow-lg rounded-md py-2 w-full z-10 transform translate-y-2">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/allBoard">임시 게시판</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-2/5 h-full relative">
            <div className="relative">
              <select className="cursor-pointer text-base font-medium text-gray-600 duration-500 h-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-emerald-500 w-4/5">
                <option value="" disabled>
                  카테고리를 선택하세요.
                </option>
                <option value="hobby">취미/레저</option>
                <option value="culture">문화/예술</option>
                <option value="social">사회활동/인맥</option>
                <option value="creative">창의/제작</option>
                <option value="learning">학습/자기계발</option>
              </select>
            </div>
          </div>
          <div className="w-2/5 h-12 flex items-center justify-end rounded-md">
            <form className="w-full h-full flex items-center">
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                className="w-full h-10 px-4 py-2 text-gray-600 rounded-l-full focus:outline-none border border-emerald-500"
              />
              <button
                type="submit"
                className="w-20 h-10 px-4 bg-emerald-500 text-white rounded-r-full flex items-center justify-center"
              >
                검색
              </button>
            </form>
          </div>
          <div className="w-20 h-12 flex items-center justify-end text-slate-500 text-sm font-semibold rounded-md cursor-pointer hover:text-emerald-500 transition-colors duration-500">
            {loggedIn ? (
              <p onClick={handleLogout} title={username}>
                로그아웃
              </p>
            ) : (
              <Link to="/allMemberLogin/Login">로그인</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
