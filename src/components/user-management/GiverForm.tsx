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
import { useCreateGiver } from "@/store/data/users/hooks";
import { LoadingSpinner } from "../LoadingSpinner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated schema with all fields required
export const formSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be less than 255 characters")
    .nonempty("Name is required"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .nonempty("Email is required"),
  
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be less than 15 digits")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits")
    .nonempty("Mobile number is required"),
  
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters")
    .nonempty("Address is required"),
  
  zipcode: z.string()
    .min(5, "Zipcode must be at least 5 characters")
    .max(10, "Zipcode must be less than 10 characters")
    .regex(/^[0-9]+$/, "Zipcode must contain only digits")
    .nonempty("Zipcode is required"),
  
  gender: z.string()
    .nonempty("Gender is required")
    .refine((val) => ["Male", "Female", "Other"].includes(val), {
      message: "Please select a valid gender",
    }),
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
}

function GiverForm({ open, handleOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
    mode: "onChange", // Validate on change for real-time feedback
  });

  const createGiver = useCreateGiver();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createGiver.mutate(values, {
      onSuccess: () => {
        handleOpen();
        form.reset(initialFormValues);
      },
    });
  }

  return (
    <CustomDrawer
      open={open}
      handleOpen={handleOpen}
      className="max-w-lg !mx-auto"
    >
      <div className="p-6 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter caregiver name" 
                      {...field} 
                      className={form.formState.errors.name ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter caregiver email"
                      {...field}
                      className={form.formState.errors.email ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Mobile</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter caregiver mobile"
                      {...field}
                      className={form.formState.errors.mobile ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter caregiver address"
                      {...field}
                      className={form.formState.errors.address ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter caregiver zip code"
                      {...field}
                      className={form.formState.errors.zipcode ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Gender Dropdown */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className={form.formState.errors.gender ? "border-red-500" : ""}>
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
              className="green-button w-full mt-6"
              disabled={createGiver.isPending || !form.formState.isValid}
            >
              {createGiver.isPending ? <LoadingSpinner /> : "Add Caregiver"}
            </CustomButton>
          </form>
        </Form>
      </div>
    </CustomDrawer>
  );
}

export default GiverForm;