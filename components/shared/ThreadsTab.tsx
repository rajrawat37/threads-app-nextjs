import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.action";
import { fetchUserPosts } from "@/lib/actions/user.action";

import ThreadCard from "../cards/ThreadCard";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

// Helper function to serialize MongoDB objects
function serializeThread(thread: any) {
  return {
    _id: thread._id.toString(),
    text: thread.text,
    parentId: thread.parentId,
    author: {
      name: thread.author.name,
      image: thread.author.image,
      id: thread.author.id,
    },
    community: thread.community ? {
      id: thread.community.id,
      name: thread.community.name,
      image: thread.community.image,
    } : null,
    createdAt: thread.createdAt.toISOString(),
    children: thread.children.map((child: any) => ({
      author: {
        image: child.author.image,
        name: child.author.name || '',
      }
    }))
  };
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;

  result = await fetchUserPosts(accountId);

  if (!result) {
    redirect("/");
  }

  // Serialize the threads data
  const serializedThreads = result.threads.map(serializeThread);

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {serializedThreads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;