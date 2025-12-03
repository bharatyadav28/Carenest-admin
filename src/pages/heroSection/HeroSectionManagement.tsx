import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiSave as SaveIcon, FiEdit as EditIcon } from "react-icons/fi";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
import { showError } from "@/lib/resuable-fns";
import useGeneral from "@/store/features/general";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/common/RichTextEditor"; // Add this import

// Mock hook - replace with your actual API hook
import { useHeroSection, useUpdateHeroSection } from "@/store/data/cms/herosection/hook";

const formSchema = z.object({
  heading: z.string().min(1, { message: "Heading is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  googleReviewLink: z.string().url({ message: "Must be a valid URL" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

function HeroSectionManagement() {
  const [isEditing, setIsEditing] = useState(false);

  const replacePageName = useGeneral((state) => state.replacePageName);

  // Mock hooks - replace with your actual implementation
  const { data, isFetching, error } = useHeroSection();
  const updateHeroSection = useUpdateHeroSection();

  const heroData = data?.data?.heroSection;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
      description: "",
      googleReviewLink: "",
      phoneNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateHeroSection.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (error) => {
        showError(error);
      },
    });
  }

  const { reset } = form;

  // When hero data is fetched, reset form values
  useEffect(() => {
    if (heroData) {
      reset({
        heading: heroData.heading,
        description: heroData.description,
        googleReviewLink: heroData.googleReviewLink,
        phoneNumber: heroData.phoneNumber,
      });
    }
  }, [heroData, reset]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Hero Section Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && heroData) {
      reset({
        heading: heroData.heading,
        description: heroData.description,
        googleReviewLink: heroData.googleReviewLink,
        phoneNumber: heroData.phoneNumber,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
        <CustomButton
          onClick={handleEditToggle}
          className="flex items-center gap-2"
        >
          <EditIcon className="w-6 h-6" />
          {isEditing ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Heading</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your main heading text"
                        {...field}
                        disabled={!isEditing}
                        className="min-h-[100px] resize-none text-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Updated: Changed from Textarea to RichTextEditor */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        readOnly={!isEditing}
                        placeholder="Enter your description text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1-800-123-4567"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="googleReviewLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Reviews Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://g.page/review/your-business"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={updateHeroSection.isPending}
                  >
                    {updateHeroSection.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Save Changes
                  </CustomButton>

                  <CustomButton
                    type="button"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </CustomButton>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {isFetching && <PageLoadingSpinner />}
    </div>
  );
}

export default HeroSectionManagement;