import { UserProfile } from "@clerk/nextjs";

const EditPage = () => {
    return (
      <div className="flex justify-center items-center">
        <UserProfile />
      </div>
    )
}

export default EditPage;