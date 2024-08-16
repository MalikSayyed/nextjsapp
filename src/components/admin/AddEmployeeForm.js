import React, { useState } from "react";

const AddEmployeeForm = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [formSubmitted, setFormSubmitted] = useState();

  const handleAddEmployee = async (e) => {
    try {
      e.preventDefault();

      setFormSubmitted(true);
      setTimeout(async () => {
        if (password !== confirmpassword) {
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setFormSubmitted(false);
          return;
        }

        const response = await fetch("/api/combinedapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiName: "addemployee",
            username,
            email,
            password,
          }),
        });

        const { error, result } = await response.json();

        if (error !== undefined) {
          console.log("add Employee error:", error);
        }
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFormSubmitted(false);
      }, 1000);
    } catch (error) {
      console.error("add Employee operation error", error);
    }
  };

  return (
    <>
      {formSubmitted && password !== confirmpassword && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>Password and Confirm Password does not match</span>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <div className="first-letter:card w-full max-w-sm bg-base-100">
          <form className="card-body ">
            <h1 className="font-bold">Add Employee</h1>
            <div className="max-w-sm">
              <label className="form-control  w-full">
                <div className="label ">
                  <span className="label-text font-bold ">UserName</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="input input-bordered w-full  font-bold"
                />
              </label>
              <label className="form-control  w-full">
                <div className="label">
                  <span className="label-text font-bold">Email</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@gmail.com"
                  className="input input-bordered w-full  font-bold"
                />
              </label>
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text font-bold ">Password</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="input input-bordered w-full  font-bold"
                />
              </label>
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text font-bold ">
                    Confirm Password
                  </span>
                </div>
                <input
                  type="password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="password"
                  className="input input-bordered w-full  font-bold"
                />
              </label>
              <div className="flex justify-end col-span-2 mt-3">
                <button
                  onClick={(e) => handleAddEmployee(e)}
                  className="btn w-24 bg-[#dc2626] text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeForm;
