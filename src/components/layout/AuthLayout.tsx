import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              FRC Fantasy Draft
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};