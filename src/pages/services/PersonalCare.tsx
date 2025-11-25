import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiHome,
  FiX as CloseIcon
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
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/common/ImageUpload";
import RichTextEditor from "@/components/common/RichTextEditor";

import {
  useServicesByCareType,
  useUpdateService,
} from "@/store/data/cms/services/hook";

// Form schema
const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required").max(255, "Service name must be less than 255 characters"),
  serviceDescription: z.string().min(1, "Service description is required"),
  serviceIcon: z.string().url("Valid icon URL is required"),
  careType: z.enum(["Personal Care", "Home Maker Service", "Specialized Care", "Sitter Services", "Companion Care", "Transportation"]),
  title1: z.string().min(1, "Title 1 is required").max(255, "Title 1 must be less than 255 characters"),
  description1: z.string().min(1, "Description 1 is required"),
  title2: z.string().min(1, "Title 2 is required").max(255, "Title 2 must be less than 255 characters"),
  description2: z.string().min(1, "Description 2 is required"),
  title3: z.string().min(1, "Title 3 is required").max(255, "Title 3 must be less than 255 characters"),
  description3: z.string().min(1, "Description 3 is required"),
  description3Image: z.string().url("Valid image URL is required"),
  description3List: z.array(z.string().min(1, "List item cannot be empty")).min(1, "At least one list item is required"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

function PersonalCare() {
  const [isEditing, setIsEditing] = useState(false);
  const [newListItem, setNewListItem] = useState("");

  const careType: any = "Personal Care";
  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data: servicesData, isFetching: isFetchingServices, error } = useServicesByCareType(careType);
  const updateService = useUpdateService();

  const services = servicesData?.data?.services || [];
  const currentService = services[0];

  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      serviceDescription: "",
      serviceIcon: "",
      careType: careType,
      title1: "",
      description1: "",
      title2: "",
      description2: "",
      title3: "",
      description3: "",
      description3Image: "",
      description3List: [],
    },
  });

  useEffect(() => {
    replacePageName("Personal Care Services");
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Error fetching services:", error);
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    if (currentService) {
      serviceForm.reset({
        ...currentService,
        description3List: currentService.description3List || [],
      });
    }
  }, [currentService, serviceForm]);

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentService) {
      serviceForm.reset({
        ...currentService,
        description3List: currentService.description3List || [],
      });
    }
  };

  const handleSubmit = (values: ServiceFormData) => {
    if (currentService) {
      updateService.mutate(
        { id: currentService.id, updateData: values },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
          onError: (error) => {
            showError(error);
          }
        }
      );
    }
  };

  const addListItem = () => {
    if (!newListItem.trim()) return;

    const currentList = serviceForm.getValues("description3List") || [];
    serviceForm.setValue("description3List", [...currentList, newListItem.trim()]);
    setNewListItem("");
  };

  const removeListItem = (index: number) => {
    const currentList = serviceForm.getValues("description3List") || [];
    serviceForm.setValue("description3List", currentList.filter((_, i) => i !== index));
  };

  if (isFetchingServices && !servicesData) {
    return <PageLoadingSpinner />;
  }

  if (services.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
         
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FiHome className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Personal Care Services Found
              </h3>
              <p className="text-gray-600">
                No personal care services available at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
    
        
        <div className="flex items-center gap-4">
       
          
          {!isEditing ? (
            <CustomButton
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Edit Service
            </CustomButton>
          ) : (
            <CustomButton
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <CloseIcon className="w-4 h-4" />
              Cancel
            </CustomButton>
          )}
        </div>
      </div>

      {/* Service Form - Always visible, editable only when editing */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Personal Care Service" : "Personal Care Service"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={serviceForm.control}
                  name="serviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter service name"
                          {...field}
                          readOnly={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceForm.control}
                  name="serviceIcon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Icon URL</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <ImageUpload
                            onImageUpload={(url) => handleImageUpload(field, url)}
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
              </div>

              <FormField
                control={serviceForm.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter service description"
                        {...field}
                        className="min-h-[100px] resize-none"
                        readOnly={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section 1 */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={serviceForm.control}
                    name="title1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title for section 1"
                            {...field}
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceForm.control}
                    name="description1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter description for section 1"
                            className="min-h-[200px]"
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={serviceForm.control}
                    name="title2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title for section 2"
                            {...field}
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceForm.control}
                    name="description2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter description for section 2"
                            className="min-h-[200px]"
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 3 */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={serviceForm.control}
                    name="title3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title for section 3"
                            {...field}
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceForm.control}
                    name="description3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter description for section 3"
                            className="min-h-[200px]"
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceForm.control}
                    name="description3Image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <ImageUpload
                              onImageUpload={(url) => handleImageUpload(field, url)}
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

                  <FormField
                    control={serviceForm.control}
                    name="description3List"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature List</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {isEditing && (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter a feature"
                                  value={newListItem}
                                  onChange={(e) => setNewListItem(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addListItem();
                                    }
                                  }}
                                />
                                <CustomButton
                                  type="button"
                                  onClick={addListItem}
                                >
                                  Add
                                </CustomButton>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              {field.value?.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded">
                                  <span className="flex-1">{item}</span>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => removeListItem(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <CloseIcon className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons - Only show when editing */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t">
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={updateService.isPending}
                  >
                    {updateService.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Update Service
                  </CustomButton>
                  
                  <CustomButton
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </CustomButton>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PersonalCare;