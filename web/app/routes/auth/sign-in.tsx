import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router";

export default function SignInPage() {
    return (
        <div className="flex flex-col gap-y-4">
            <SignIn />
            <p className="text-center text-muted-fg text-sm">
                New volunteer?{" "}
                <Link className="text-fg" to="https://qm.qq.com/q/EKcO0675Kw" target="_blank">
                    Apply to join our team
                </Link>
            </p>
        </div>
    )
}
