import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.action";
import User from "@/lib/models/user.model";

import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";

// Helper function to serialize MongoDB objects
function serializePost(post: any) {
  return {
    _id: post._id.toString(),
    text: post.text,
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
    },
    community: post.community ? {
      id: post.community.id,
      name: post.community.name,
      image: post.community.image,
    } : null,
    createdAt: post.createdAt.toISOString(),
    parentId: post.parentId,
    children: post.children.map((child: any) => ({
      author: {
        image: child.author.image,
        name: child.author.name,
      }
    }))
  };
}

// Force a new deployment by adding a comment
async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  noStore();
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Await searchParams for Next.js 15
  const resolvedSearchParams = await searchParams;

  const result = await fetchPosts(
    resolvedSearchParams.page ? +resolvedSearchParams.page : 1,
    30
  );

  // Serialize the posts data
  const serializedPosts = result.posts.map(serializePost);

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {serializedPosts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {serializedPosts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={resolvedSearchParams?.page ? +resolvedSearchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;