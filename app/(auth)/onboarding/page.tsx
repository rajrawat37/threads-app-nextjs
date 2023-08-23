import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs"; 

async function Page() {
    //clerk provides us with currentUser.
    //The currentUser() helper returns the User object of the currently active user. 
    const user=await currentUser();

    //later on we have new fetch user fetching it from database & not the current logged in one .
    const userInfo ={};

    //creating an object of user to pass it on to AccountProfile component.
    const userData = {
        id:user?.id,
        objectId:userInfo?._id,
        username:userInfo?.username || user?.username,
        name:userInfo?.name || user?.firstName | "",
        bio:userInfo?.bio || "",
        image:userInfo?.image || user?.imageUrl,
    }
    return(
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20"> 
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;