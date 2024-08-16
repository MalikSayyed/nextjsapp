"use client";
import React from "react";
import { useState, useRef, useEffect, forwardRef } from "react";
import SideNav from "@/components/sidebar/SideNav";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// import CryptoJS from "crypto-js";

const CryptoJS = dynamic(() => import("crypto-js"), { ssr: false });

const decryptID = (encryptedID, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedID, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [imageName, setImageName] = useState("");
  const [authorId, setAuthorId] = useState();
  const [previousimage, setPreviousImage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [blog, setBlog] = useState();
  const [blogLiveId, setBlogLiveId] = useState(null);

  const { data: session, status } = useSession();

  const searchParams = useSearchParams();

  useEffect(() => {
    const getBlogData = async () => {
      try {
        const encryptedID = searchParams.get("encryptedID");

        const blogID = decryptID(encryptedID, "thisissecret");

        const published = searchParams.get("published");

        const response = await fetch("/api/fetchblog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogID, published }),
        });

        const { error, result } = await response.json();

        if (error !== undefined) {
          console.log("Blog fetchingerror:", error);
        }
        setBlog(result);
      } catch (error) {
        console.error("fetch blog operation error", error);
      }
    };

    getBlogData();
  }, []);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDesc(blog.description);
      setContent(blog.content);
      setImage(blog.image);
      setSlug(blog.slug);
      setImageName("");
      setPreviousImage(blog.image);
      setSelectedId(blog.id);
      setAuthorId(blog.author_id);
      setBlogLiveId(blog.bloglive_id ? blog.bloglive_id : null);
    }
  }, [blog]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.name !== "employee") {
    return <div>Access Denied</div>;
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    setImageName(selectedFile ? selectedFile.name : ""); // Set the file name
  };

  const handleBlogUpdate = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("slug", slug);
      formData.append("selectedId", selectedId);
      formData.append("previousimage", previousimage);
      formData.append("published", searchParams.get("published"));
      formData.append("author_id", authorId);
      formData.append("blogLiveId", blogLiveId);

      const response = await fetch("/api/updateblog", {
        method: "PUT",
        body: formData,
      });

      const { error, result } = await response.json();

      if (error !== undefined) {
        console.log("Blog Updated error:", error);
      }
      window.location.href = "/allblogemployee";
    } catch (error) {
      console.error("Blog Update operation error", error);
    }
  };

  return (
    <>
      <div className=" px-6 py-10 sm:px-8 sm:py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 sm:gap-x-10">
          <div className=" col-span-3 space-y-10">
            <SideNav />
          </div>

          <div className="col-span-9">
            <div className="card w-full bg-base-100 rounded-md">
              <form className="card-body">
                <h1 className="pt-4 text-center text-3xl font-semibold">
                  Edit Blog Details
                </h1>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Title</span>
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full placeholder-gray-500"
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Meta Description</span>
                  </div>
                  <textarea
                    type="text"
                    id="desc"
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="textarea textarea-bordered placeholder-gray-500"
                    placeholder="Meta Description"
                  ></textarea>
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Blog Content</span>
                  </div>
                </label>

                <textarea
                  type="text"
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered placeholder-gray-500"
                  placeholder="Meta Description"
                ></textarea>

                <div className="mt-6">
                  <label
                    htmlFor="image"
                    className="p-2 border border-gray-300 cursor-pointer text-gray-500 hover:text-blue-700"
                  >
                    <span>
                      {imageName ? imageName : "Upload New Blog Image"}
                    </span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleBlogUpdate}
                    className="btn bg-[#dc2626] w-20 text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
