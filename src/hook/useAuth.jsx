import { useSelector } from "react-redux";
import { selectCurrentToekn } from "../redux/feature/auth/authSlice";
import { jwtDecode } from 'jwt-decode';

function useAuth() {  
  const token = useSelector(selectCurrentToekn);
  
  if (!token) {
    return { username: null, roles: [] };
  }

 try {
    const decoded = jwtDecode(token);
    const { jti: username, scope } = decoded;
    const roles = scope ? scope.split(" ") : [];

    return { username, roles };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return { username: null, roles: [] };
  }
}

export default useAuth;
