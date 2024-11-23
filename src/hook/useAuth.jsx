import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import { jwtDecode } from "jwt-decode";

function useAuth() {
  const token = useSelector(selectCurrentToken);

  if (!token) {
    return { username: null, roles: [], uuid: null };
  }

  try {
    const decoded = jwtDecode(token);
    const { jti: username, scope, uuid } = decoded;
    const roles = scope ? scope.split(" ") : [];

    return { username, roles, uuid };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return { username: null, roles: [], uuid: null };
  }
}

export default useAuth;
