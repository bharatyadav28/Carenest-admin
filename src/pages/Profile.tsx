import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useGeneral from "@/store/features/general";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/common/CustomInputs";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
import { useProfile, useUpdateProfile } from "@/store/data/users/hooks";

import { showError } from "@/lib/resuable-fns";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name must contain atleast 1 character" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .refine((val) => val === "" || val.length >= 6, {
      message: "Password must be at least 6 characters long",
    })
    .optional(),
});

function Profile() {
  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useProfile();
  console.log("Profile fetched:", data);

  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  // When profile data is fetched, reset form values
  useEffect(() => {
    if (data) {
      reset({
        name: data?.data?.profile?.name || "",
        email: data?.data?.profile?.email || "",
      });
    }
  }, [data, reset]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile.mutate(values);
  }

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Initialise data
  useEffect(() => {
    replacePageName("Profile");
  }, []);

  return (
    <>
      <div className="main-container">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="input-container">
                  <FormLabel>Name</FormLabel>
                  <div className="user-input">
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="input"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="input-container">
                  <FormLabel>Email</FormLabel>
                  <div className="user-input">
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="input"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="input-container">
                  <FormLabel>New Password</FormLabel>
                  <div className="user-input">
                    <FormControl>
                      <Input
                        placeholder="Enter new password"
                        {...field}
                        type="password"
                        className="input"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <CustomButton
              type="submit"
              className={`green-button p-4`}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? <LoadingSpinner /> : "Save"}
            </CustomButton>
          </form>
        </Form>
      </div>

      {isFetching && <PageLoadingSpinner />}
    </>
  );
}

export default Profile;
