const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="xl:pl-[16rem]">
      {children}
    </div>
  );
};

export default ProfileLayout;
