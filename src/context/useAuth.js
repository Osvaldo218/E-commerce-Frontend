import { useContext } from "react";
import AuthContext from "./AuthContext"; // Importa el contexto separado

// Hook personalizado para usar la autenticación
const useAuth = () => useContext(AuthContext);

export default useAuth;
