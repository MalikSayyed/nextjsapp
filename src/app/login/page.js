"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (session && session.user && session.user.name === "admin") {
        window.location.href = "/adminform";
      } else if (session && session.user && session.user.name === "employee") {
        window.location.href = "/allblogemployee";
      } else {
        console.error("Invalid user type");
        console.log("session.user.name", session.user.name);
      }
    }
  }, [session, status]);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const response = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log("response", response);

      if (response.error) {
        window.location.href = "/login";
        throw new Error("Wrong Credentials...");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={(e) => handleLogin(e)}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
