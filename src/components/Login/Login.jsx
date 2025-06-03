import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setUser } from "../../Store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import image from "../../assets/Login.png";
import "react-toastify/dist/ReactToastify.css";
import { usePost } from "@/Hooks/UsePost";

const Login = () => {
  const { postData, loadingPost, response } = usePost({ url:`https://bcknd.sea-go.org/api/village/login` });
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      toast.info("You are already logged in");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      toast.error("Email/Username and password are required");
      return;
    }
    const body = new FormData();
    body.append("email", emailOrUsername);
    body.append("password", password);
    postData(body, "Login successful!");
  };

    useEffect(() => {
    if (!loadingPost && response) {
      dispatch(setUser(response?.data));
      localStorage.setItem("user", JSON.stringify(response?.data));
localStorage.setItem("village_id", response?.data?.village?.village?.id);
      localStorage.setItem("token", response?.data.token);
      const redirectTo = new URLSearchParams(location.search).get("redirect");
      if (response?.data?.village?.village?.package_id === null) {
        navigate("/packages");
      } else {
        navigate(redirectTo || "/");
      }
    }
  }, [response, loadingPost, navigate, dispatch]);

  return (
    <div className="md:flex h-screen">
      <div className="flex flex-col !m-auto !px-4 sm:!px-8 md:!ps-10 w-full md:w-1/2 !py-8">
        <Card className="w-full shadow-none border-none">
          <CardContent className="!p-6">
            <h2 className="text-2xl font-bold !mb-10 text-bg-primary">Log In</h2>
            <p className="text-bg-primary text-xl font-semibold">Welcome Back</p>
            <p className="text-sm text-muted-foreground text-gray-500 !mb-4">
              Log in To Your Account.
            </p>
            <form onSubmit={handleLogin} className="space-y-4 w-full">
              <Input
                type="text"
                placeholder="Email"
                className="border-bg-primary w-full xl:w-[70%] rounded-[10px] !p-2 !mb-2 text-gray-500 focus:border-bg-primary focus:ring-bg-primary"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                className="border-bg-primary w-full xl:w-[70%] rounded-[10px] !p-2 !mb-2 text-gray-500 focus:border-bg-primary focus:ring-bg-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full xl:w-[70%] rounded-[10px] bg-bg-primary cursor-pointer hover:bg-teal-600 text-white"
                type="submit"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:flex w-1/2">
        <img
          src={image}
          alt="login"
          className="object-cover !m-auto w-full h-[98%]"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;