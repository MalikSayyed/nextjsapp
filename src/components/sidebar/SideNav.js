import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SideNav() {
  const [userRole, setUserRole] = useState();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setUserRole(session.user.name);
    }
  }, [session, status]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        {userRole === "admin" && (
          <Link
            href="/addemployee"
            className="facebookBtn block bg-[#79ADFF] hover:scale-105 transition duration-300 text-white  px-4 py-2  rounded-md"
          >
            <div className="flex justify-start items-center space-x-2">
              {/* <i className="bi bi-facebook text-2xl font-bold"></i> */}
              <span className="text-base font-semibold"> Add Employee</span>
            </div>
          </Link>
        )}{" "}
        {userRole === "admin" && (
          <Link
            href="/allemployee"
            className="linkedinBtn block bg-[#29B4FF] hover:scale-105 transition duration-300 text-white  px-4 py-2  rounded-md"
          >
            <div className="flex justify-start items-center space-x-2">
              {/* <i className="bi bi-linkedin text-2xl font-bold"></i> */}
              <span className="text-base font-semibold"> All Employee</span>
            </div>
          </Link>
        )}
        <Link
          href="/addblog"
          className="instagramBtn block bg-[#9E7CF7] hover:scale-105 transition duration-300 text-white  px-4 py-2  rounded-md"
        >
          <div className="flex justify-start items-center space-x-2">
            {/* <i className="bi bi-instagram text-2xl font-bold"></i> */}
            <span className="text-base font-semibold"> Add Blog</span>
          </div>
        </Link>
        {userRole === "admin" && (
          <Link
            href="/allblogadmin"
            className="linkedinBtn block bg-[#79ADFF] hover:scale-105 transition duration-300 text-white  px-4 py-2  rounded-md"
          >
            <div className="flex justify-start items-center space-x-2">
              {/* <i className="bi bi-linkedin text-2xl font-bold"></i> */}
              <span className="text-base font-semibold"> All Blog</span>
            </div>
          </Link>
        )}
        {userRole === "employee" && (
          <Link
            href="/allblogemployee"
            className="linkedinBtn block bg-[#79ADFF] hover:scale-105 transition duration-300 text-white  px-4 py-2  rounded-md"
          >
            <div className="flex justify-start items-center space-x-2">
              {/* <i className="bi bi-linkedin text-2xl font-bold"></i> */}
              <span className="text-base font-semibold"> All Blog</span>
            </div>
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="youtubeBtn w-full block bg-[#F44F54] hover:scale-105 transition duration-300 text-white   px-4 py-2  rounded-md"
        >
          <div className="flex justify-start items-center space-x-2">
            {/* <i className="bi bi-youtube text-2xl font-bold"></i> */}
            <span className="text-base font-semibold"> Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
