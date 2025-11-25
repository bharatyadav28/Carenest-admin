import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiX as CloseIcon,
 
  FiImage as ImageIcon
} from "react-icons/fi";
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
import { CustomButton } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/common/ImageUpload";
import RichTextEditor from "@/components/common/RichTextEditor";

import {
  useWhoWeAre,
  useUpdateMainSection,
  useUpdateCaregiverNetworkSection,
  useUpdatePromiseSection,
} from "@/store/data/cms/whoWeAre/hook";

// Form schemas
const mainSectionSchema = z.object({
  mainHeading: z.string().min(1, "Main heading is required").max(255, "Main heading must be less than 255 characters"),
  mainDescription: z.string().min(1, "Main description is required"),
  images: z.array(z.string().url("Valid image URL is required")).length(4, "Exactly 4 images are required"),
});

const caregiverNetworkSchema = z.object({
  caregiverNetworkHeading: z.string().min(1, "Heading is required").max(255, "Heading must be less than 255 characters"),
  caregiverNetworkDescription: z.string().min(1, "Description is required"),
  caregiverNetworkImage: z.string().url("Valid image URL is required"),
});

const promiseSchema = z.object({
  promiseHeading: z.string().min(1, "Heading is required").max(255, "Heading must be less than 255 characters"),
  promiseDescription: z.string().min(1, "Description is required"),
});

type MainSectionData = z.infer<typeof mainSectionSchema>;
type CaregiverNetworkData = z.infer<typeof caregiverNetworkSchema>;
type PromiseData = z.infer<typeof promiseSchema>;

function WhoWeAreManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("main");

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useWhoWeAre();
  const updateMainSection = useUpdateMainSection();
  const updateCaregiverNetworkSection = useUpdateCaregiverNetworkSection();
  const updatePromiseSection = useUpdatePromiseSection();

  const whoWeAreData = data?.data?.whoWeAre;

  // Forms
  const mainForm = useForm<MainSectionData>({
    resolver: zodResolver(mainSectionSchema),
    defaultValues: {
      mainHeading: "",
      mainDescription: "",
      images: ["", "", "", ""],
    },
  });

  const caregiverNetworkForm = useForm<CaregiverNetworkData>({
    resolver: zodResolver(caregiverNetworkSchema),
    defaultValues: {
      caregiverNetworkHeading: "",
      caregiverNetworkDescription: "",
      caregiverNetworkImage: "",
    },
  });

  const promiseForm = useForm<PromiseData>({
    resolver: zodResolver(promiseSchema),
    defaultValues: {
      promiseHeading: "",
      promiseDescription: "",
    },
  });

  // Reset forms when data is fetched
  useEffect(() => {
    if (whoWeAreData) {
      mainForm.reset({
        mainHeading: whoWeAreData.mainHeading,
        mainDescription: whoWeAreData.mainDescription,
        images: whoWeAreData.images || ["", "", "", ""],
      });
      caregiverNetworkForm.reset({
        caregiverNetworkHeading: whoWeAreData.caregiverNetworkHeading,
        caregiverNetworkDescription: whoWeAreData.caregiverNetworkDescription,
        caregiverNetworkImage: whoWeAreData.caregiverNetworkImage,
      });
      promiseForm.reset({
        promiseHeading: whoWeAreData.promiseHeading,
        promiseDescription: whoWeAreData.promiseDescription,
      });
    }
  }, [whoWeAreData, mainForm, caregiverNetworkForm, promiseForm]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Who We Are Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset forms to original data when canceling
      if (whoWeAreData) {
        mainForm.reset({
          mainHeading: whoWeAreData.mainHeading,
          mainDescription: whoWeAreData.mainDescription,
          images: whoWeAreData.images || ["", "", "", ""],
        });
        caregiverNetworkForm.reset({
          caregiverNetworkHeading: whoWeAreData.caregiverNetworkHeading,
          caregiverNetworkDescription: whoWeAreData.caregiverNetworkDescription,
          caregiverNetworkImage: whoWeAreData.caregiverNetworkImage,
        });
        promiseForm.reset({
          promiseHeading: whoWeAreData.promiseHeading,
          promiseDescription: whoWeAreData.promiseDescription,
        });
      }
    }
  };

  const handleImageUpload = (field: any, url: string, index?: number) => {
    if (index !== undefined) {
      // For main section images array
      const currentImages = mainForm.getValues("images") || ["", "", "", ""];
      currentImages[index] = url;
      mainForm.setValue("images", currentImages);
    } else {
      // For single image fields
      field.onChange(url);
    }
  };

  const handleMainSectionSubmit = (values: MainSectionData) => {
    updateMainSection.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCaregiverNetworkSubmit = (values: CaregiverNetworkData) => {
    updateCaregiverNetworkSection.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handlePromiseSubmit = (values: PromiseData) => {
    updatePromiseSection.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (isFetching) {
    return <PageLoadingSpinner />;
  }

  if (!whoWeAreData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-lg">No Who We Are data found. Please create Who We Are page first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <CustomButton
              onClick={handleEditToggle}
              className="flex items-center gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Edit Who We Are
            </CustomButton>
          ) : (
            <CustomButton
              onClick={handleEditToggle}
              className="flex items-center gap-2"
            >
              <CloseIcon className="w-4 h-4" />
              Cancel
            </CustomButton>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {['main', 'caregiverNetwork', 'promise'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeSection === section
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {section === 'main' && 'Main Section'}
            {section === 'caregiverNetwork' && 'Caregiver Network'}
            {section === 'promise' && 'Our Promise'}
          </button>
        ))}
      </div>

      {/* Main Section */}
      {activeSection === 'main' && (
        <Card>
          <CardHeader>
            <CardTitle>Main Section</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...mainForm}>
              <form onSubmit={mainForm.handleSubmit(handleMainSectionSubmit)} className="space-y-6">
                <FormField
                  control={mainForm.control}
                  name="mainHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter main heading"
                          {...field}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mainForm.control}
                  name="mainDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter main description"
                          className="min-h-[200px]"
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images Section */}
                <div className="space-y-4">
                  <FormLabel>Images (4 Required)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1, 2, 3].map((index) => (
                      <FormField
                        key={index}
                        control={mainForm.control}
                        name={`images.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image {index + 1}</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <ImageUpload
                                  onImageUpload={(url) => handleImageUpload(field, url, index)}
                                  currentImage={field.value}
                                  disabled={!isEditing}
                                />
                                {field.value && (
                                  <Input
                                    {...field}
                                    readOnly
                                    className="text-sm"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Image Previews */}
                {mainForm.watch("images").some(img => img) && (
                  <div className="space-y-4">
                    <FormLabel>Image Previews</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mainForm.watch("images").map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="aspect-square border rounded-lg overflow-hidden bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-center text-gray-600">Image {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={updateMainSection.isPending}
                    >
                      {updateMainSection.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Main Section
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Caregiver Network Section */}
      {activeSection === 'caregiverNetwork' && (
        <Card>
          <CardHeader>
            <CardTitle>Our Caregiver Network</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...caregiverNetworkForm}>
              <form onSubmit={caregiverNetworkForm.handleSubmit(handleCaregiverNetworkSubmit)} className="space-y-6">
                <FormField
                  control={caregiverNetworkForm.control}
                  name="caregiverNetworkHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter caregiver network heading"
                          {...field}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={caregiverNetworkForm.control}
                  name="caregiverNetworkDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter caregiver network description"
                          className="min-h-[200px]"
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={caregiverNetworkForm.control}
                  name="caregiverNetworkImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <ImageUpload
                            onImageUpload={(url) => handleImageUpload(field, url)}
                            currentImage={field.value}
                            disabled={!isEditing}
                          />
                          {field.value && (
                            <div className="space-y-2">
                              <Input
                                {...field}
                                readOnly
                                className="text-sm"
                              />
                              <div className="aspect-video max-w-md border rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={field.value}
                                  alt="Caregiver network preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={updateCaregiverNetworkSection.isPending}
                    >
                      {updateCaregiverNetworkSection.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Caregiver Network
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Promise Section */}
      {activeSection === 'promise' && (
        <Card>
          <CardHeader>
            <CardTitle>Our Promise</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...promiseForm}>
              <form onSubmit={promiseForm.handleSubmit(handlePromiseSubmit)} className="space-y-6">
                <FormField
                  control={promiseForm.control}
                  name="promiseHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter promise heading"
                          {...field}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={promiseForm.control}
                  name="promiseDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter promise description"
                          className="min-h-[200px]"
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={updatePromiseSection.isPending}
                    >
                      {updatePromiseSection.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Promise Section
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default WhoWeAreManagement;