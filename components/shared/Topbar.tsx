"use client";

import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignedIn , SignOutButton, SignedOut } from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import { SignInButton } from "@clerk/nextjs";

function Topbar() {
    return (
      <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden ">Threads</p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image src="/assets/logout.svg" alt="logout" width={24} height={24}></Image>
                            </div>
                        </SignOutButton>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                </div>
                {/* <OrganizationSwitcher
                  appearance={{
                    baseTheme : dark,
                    elements : {
                        oraganizationSwitcherTrigger : "py-2 px-4"
                    }
                  }}
                /> */}
            </div>

      </nav>
    )
}
export default Topbar;