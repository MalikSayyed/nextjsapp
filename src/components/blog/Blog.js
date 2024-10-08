"use client";
import Image from "next/image";
import Link from "next/link";

export default function Blog({ blog }) {
  return (
    <div className="space-y-10">
      {
        <div className="space-y-4 ">
          {blog.image && (
            <div className="card-zoom bg-gray-100 w-full h-[28vh] sm:h-[60vh] rounded-xl ">
              <button className="absolute z-10 top-4 end-4 bg-indigo-500 hover:bg-indigo-700 text-white hover:text-gray-200 shadow-2xl hover:shadow-none font-semibold p-2 rounded-full "></button>
              <div className="card-zoom-image">
                <Image
                  src={`${blog.image}?t=${new Date().getTime()}`}
                  alt="img"
                  width={1000}
                  height={1000}
                  className="h-[100%]"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center items-center space-y-6 pb-6">
            <h1 className="text-gray-800 hover:text-red-600 text-2xl font-bold">
              {blog.title}
            </h1>

            {/* <div className="flex items-center text-gray-500 text-sm">
              <Image
                src={blog.author.image}
                alt={blog.author.imageAlt}
                width={40}
                height={40}
                className="rounded-full m-2 shadow-xl"
              />
              <div>
                By{" "}
                <Link href={blog.author.authorLink}>
                  {blog.author.firstName}
                </Link>{" "}
                <span className="px-1 ">&#x2022;</span> {blog.author.postDate}{" "}
              </div>
            </div> */}
            {blog.content && (
              <p
                className="text-justify text-gray-600 text-base font-normal leading-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></p>
            )}
            {/* <p className="text-justify text-gray-600 text-base font-normal leading-8">{blog.content}</p> */}
          </div>
        </div>
      }
    </div>
  );
}
