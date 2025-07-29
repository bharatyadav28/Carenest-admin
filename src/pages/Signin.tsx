import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomButton } from "@/components/common/CustomInputs";
import { Input } from "@/components/ui/input";
import { useSignin } from "@/store/data/users/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .transform((val) => val.toLowerCase()),
  password: z.string().trim().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const signin = useSignin();
  const isSubmitting = signin.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    signin.mutate(values);
  }

  return (
    <div className="flex h-max justify-center mt-[10rem] lg:mx-0 mx-3">
      <div className="w-full max-w-md p-8  space-y-6 bg-[#0f0f0f] rounded-lg shadow-lg">
        <h2 className="text-2xl font-medium text-center text-white uppercase">
          Admin Signin
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex relative">
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="input"
                      />
                      <span className="px-1 absolute right-2 top-1/2 -translate-y-1/2 ">
                        {!showPassword ? (
                          <Eye
                            onClick={() => setShowPassword((prev) => !prev)}
                            color="gray"
                            size={20}
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => setShowPassword((prev) => !prev)}
                            color="gray"
                            size={20}
                          />
                        )}
                      </span>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton type="submit" className="w-full py-5">
              {isSubmitting ? <LoadingSpinner /> : "Signin"}
            </CustomButton>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Signin;
