"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLogin } from "../api/use-login";
import { loginSchema } from "../schemas";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="h-full w-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Bienvenido!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Correo electrónico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size={"lg"} className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Inicia sesión con Google
        </Button>
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Inicia sesión con Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex items-center justify-center p-7">
        <p>¿No tienes una cuenta aun?</p>
        <Link href={"/sign-up"}>
          <span className="text-blue-700">&nbsp;Crea tu cuenta</span>
        </Link>
      </CardContent>
    </Card>
  );
};