import { Login } from "./_components/login";

const LoginPage = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
        <div className="sm:border-[1px] w-80 h-[30rem] p-5">
            <Login />
        </div>
        </div>
    )
}

export default LoginPage;