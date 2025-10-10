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
}

function GiverForm({ open, handleOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter caregiver name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter caregiver email"
                      {...field}
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
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter caregiver mobile"
                      {...field}
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter caregiver address"
                      {...field}
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter caregiver zip code"
                      {...field}
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
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton
              type="submit"
              className="green-button w-full"
              disabled={createGiver.isPending}
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
