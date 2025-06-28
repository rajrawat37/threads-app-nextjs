"use client";

import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LeftSidebar = () => {
  console.log("LeftSidebar component is rendering");
  
  const router = useRouter();
  const pathname = usePathname();

  const authState = useAuth();
  
  useEffect(() => {
    console.log("Clerk auth state changed:", {
      isLoaded: authState.isLoaded,
      isSignedIn: authState.isSignedIn,
      userId: authState.userId,
      hasGetToken: typeof authState.getToken === 'function'
    });
  }, [authState.isLoaded, authState.isSignedIn, authState.userId]);

  console.log("Complete auth state:", authState);
  console.log("User ID in LeftSidebar from useAuth:", authState.userId);
  console.log("Is loaded:", authState.isLoaded);
  console.log("Is signed in:", authState.isSignedIn);

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const finalRoute =
            link.route === "/profile" ? `${link.route}/${authState.userId}` : link.route;

          return (
            <Link
              href={finalRoute}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src='/assets/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />

              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;