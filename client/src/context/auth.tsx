import React, { createContext, useReducer, useContext } from "react";
import jwtDecode from "jwt-decode";
const AuthStateContext = createContext({});
const AuthDispatchContext = createContext({});

let user: any = null;
const token = localStorage.getItem("token");
if (token) {
  const decodedToken: any = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiresAt) {
    localStorage.removeItem("token");
  } else {
    user = decodedToken;
  }
} else console.log("No Token");

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };

    default:
      throw new Error(`Unknown Action type: ${action.type}`);
  }
};

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
