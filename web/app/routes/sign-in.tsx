import { useAuth } from "@workos-inc/authkit-react";
import { Button } from "~/components/ui/button";

export default function SignIn() {
    const { signIn } = useAuth();
    return <div>
        <Button onClick={() => signIn()}>Sign In</Button>
    </div>;
}
