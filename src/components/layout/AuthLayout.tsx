import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-primary/20 to-background">
      <div className="container mx-auto h-full flex items-center justify-center px-8">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              FRC Fantasy Draft
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};