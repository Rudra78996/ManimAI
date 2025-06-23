import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
};

export default SignInPage;
