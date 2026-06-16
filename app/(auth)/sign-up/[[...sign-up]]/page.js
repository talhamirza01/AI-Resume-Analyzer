import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center gradient-bg px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
          },
        }}
      />
    </div>
  );
}
