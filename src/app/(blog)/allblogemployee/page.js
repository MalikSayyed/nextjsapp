"use client";
import AllBlogEmployeeTable from "@/components/employee/AllBlogEmployeeTable";
import SideNav from "@/components/sidebar/SideNav";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.name !== "employee") {
    return <div>Access Denied</div>;
  }
  return (
    <>
      <div className=" px-6 py-10 sm:px-8 sm:py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 sm:gap-x-10">
          <div className=" col-span-3 space-y-10">
            <SideNav />
          </div>

          <div className="col-span-9">
            <AllBlogEmployeeTable />
          </div>
        </div>
      </div>
    </>
  );
}
