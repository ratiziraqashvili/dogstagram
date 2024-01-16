import { UserProfile } from "@clerk/nextjs";

const EditPage = () => {
    return (
      <div className="flex xl:ml-0 justify-center items-center">
        <UserProfile />
      </div>
    )
}

export default EditPage;