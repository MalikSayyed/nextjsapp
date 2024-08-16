import BlogPage from "@/components/blog/BlogPage";

export const metadata = {
  metadataBase: new URL(
    "https://biznouserapp-git-daisyui-zahids-projects-84a2e499.vercel.app/"
  ),
  keywords: ["Hey Blog User", "Top Location Blogs", "Top Blogs", "Blogs"],
  title: {
    default: "Blog Page",
  },
  openGraph: {
    description: "Blog Page description",
  },
};

export default function Page() {
  return <BlogPage />;
}
