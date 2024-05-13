import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "../Pages/Homepage";
import Login from "../Pages/Login";
import MyProfile from "../Pages/MyProfile";
import Signup from "../Pages/Signup";
import { AuthReducer } from "../Context/AuthReducer";

const AllRoutes = () => {
  const { authContext } = useContext(AuthReducer);
  console.log(authContext)
  return (
    <Routes>
      <Route
        path="/"
        element={
          authContext.authStatus ? <Homepage /> : <Navigate to={"/login"} />
        }
      />
      <Route
        path="/myProfile"
        element={
          authContext.authStatus ? <MyProfile /> : <Navigate to={"/login"} />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AllRoutes;
