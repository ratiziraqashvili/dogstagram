const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="xl:pl-[16rem]">
            <ProfileNavbar />
            {children}
        </div>
    )
}

export default ProfileLayout;