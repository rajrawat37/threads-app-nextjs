import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/cards/ThreadCard";

import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";

export const revalidate = 0;

// Helper function to serialize MongoDB objects
function serializeThread(thread: any) {
  return {
    _id: thread._id.toString(),
    text: thread.text,
    author: {
      id: thread.author.id,
      name: thread.author.name,
      image: thread.author.image,
    },
    community: thread.community ? {
      id: thread.community.id,
      name: thread.community.name,
      image: thread.community.image,
    } : null,
    createdAt: thread.createdAt.toISOString(),
    parentId: thread.parentId,
    children: thread.children.map((child: any) => ({
      _id: child._id.toString(),
      text: child.text,
      author: {
        id: child.author.id,
        name: child.author.name,
        image: child.author.image,
      },
      community: child.community ? {
        id: child.community.id,
        name: child.community.name,
        image: child.community.image,
      } : null,
      createdAt: child.createdAt.toISOString(),
      parentId: child.parentId,
      children: child.children || []
    }))
  };
}

async function page({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15
  const resolvedParams = await params;
  
  if (!resolvedParams.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(resolvedParams.id);
  
  // Serialize the thread data
  const serializedThread = serializeThread(thread);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          id={serializedThread._id}
          currentUserId={user.id}
          parentId={serializedThread.parentId}
          content={serializedThread.text}
          author={serializedThread.author}
          community={serializedThread.community}
          createdAt={serializedThread.createdAt}
          comments={serializedThread.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          threadId={resolvedParams.id}
          currentUserImg={user.imageUrl}
          currentUserId={userInfo._id.toString()}
        />
      </div>

      <div className='mt-10'>
        {serializedThread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;