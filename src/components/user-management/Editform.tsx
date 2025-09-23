import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { CustomButton } from "../common/CustomInputs";
import CustomDrawer from "../common/CustomDrawer";
import { LoadingSpinner } from "../LoadingSpinner";

// Giver + Seeker hooks
import {
  useCareGiverById,
  useUpdateCareGiver,
} from "@/store/data/care-giver/hook";
import {
  useCareSeekerById,
  useUpdateCareSeeker,
} from "@/store/data/care-seeker/hook";

export const formSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email().max(255),
  mobile: z.string().max(15).optional(),
  address: z.string().optional(),
  zipcode: z.string(),
  gender: z.string().max(255).optional(),
});

const initialFormValues = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  zipcode: "",
  gender: "",
};

interface Props {
  open: boolean;
  handleOpen: () => void;
  userId: string;
  role: "giver" | "seeker"; 
}

function EditForm({ open, handleOpen, userId, role }: Props) {
  // Role-based hooks
  const { data: userData, isFetching } =
    role === "giver" ? useCareGiverById(userId) : useCareSeekerById(userId);

  const updateUser =
    role === "giver" ? useUpdateCareGiver() : useUpdateCareSeeker();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  // Load current user data
  useEffect(() => {
    const user = userData?.data?.user?.[0];
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
        address: user.address ?? "",
        zipcode: user.zipcode?.toString() ?? "",
        gender: user.gender ?? "",
      });
    }
  }, [userData]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUser.mutate(
      { userId, updatedUser: values },
      {
        onSuccess: () => {
          handleOpen();
        },
      }
    );
  };

  return (
    <CustomDrawer open={open} handleOpen={handleOpen} className="max-w-lg !mx-auto">
      <div className="p-6">
        {isFetching ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {["name", "email", "mobile", "address", "zipcode", "gender"].map(
                (field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as keyof z.infer<typeof formSchema>}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${role} ${field}`}
                            {...f}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}

              <CustomButton
                type="submit"
                className="green-button w-full"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <LoadingSpinner />
                ) : role === "giver" ? (
                  "Update Caregiver"
                ) : (
                  "Update Careseeker"
                )}
              </CustomButton>
            </form>
          </Form>
        )}
      </div>
    </CustomDrawer>
  );
}

export default EditForm;
