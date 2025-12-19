import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import {
  useCareSeekerById,
  useUpdateCareSeeker,
} from "@/store/data/care-seeker/hook";

export const formSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email().max(255),
  mobile: z.string().max(15).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string(),
  gender: z.string().max(255).optional(),
});

const initialFormValues = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
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
  const { data: seekerData, isFetching: isFetchingSeeker } = useCareSeekerById(userId);
  const updateSeeker = useUpdateCareSeeker();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  // Load current user data - FIXED: Based on your API response
  useEffect(() => {
    // Your API returns: data.user (object, not array)
    const user = seekerData?.data?.user;
    
    if (user) {
      console.log("Setting form with user data:", user); // Debug log
      
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
        address: user.address ?? "",
        city: user.city ?? "",
        zipcode: user.zipcode?.toString() ?? "",
        gender: user.gender ?? "",
      });
    } else {
      // Debug: Check what data is actually coming
      console.log("Seeker Data:", seekerData);
      console.log("User data path check:", {
        hasData: !!seekerData?.data,
        hasUser: !!seekerData?.data?.user,
        user: seekerData?.data?.user
      });
    }
  }, [seekerData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateSeeker.mutate(
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
        {isFetchingSeeker ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {/* Map through form fields including city */}
              {["name", "email", "mobile", "address", "city", "zipcode"].map((field) => (
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
              ))}

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CustomButton
                type="submit"
                className="green-button w-full"
                disabled={updateSeeker.isPending}
              >
                {updateSeeker.isPending ? (
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