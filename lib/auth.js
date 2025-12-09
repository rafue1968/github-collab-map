import { auth, githubProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export async function loginWithGitHub(){
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
}