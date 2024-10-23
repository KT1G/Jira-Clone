import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SignInCard = () => {
  return (
    <Card className="h-full w-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Bienvenido!</CardTitle>
      </CardHeader>
      <div className="mb-2 px-7"></div>
    </Card>
  );
};
