import Image from "next/image"
import { RegisterInputs } from "./register-inputs"


export const Register = () => {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-3">
                <Image
                className="object-cover"
                 src="/logo.png"
                 width={230}
                 height={230}
                 alt="dogstagram"
                />
                <span className="text-muted-foreground text-center text-sm">
                Sign up to see photos and videos from your friends.
                </span>
            </div>
            <div>
                <RegisterInputs />
            </div>
        </div>
    )
}