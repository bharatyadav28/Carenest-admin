import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiHome,
  FiX as CloseIcon,
  FiPlus as PlusIcon,
  FiTrash2 as TrashIcon
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

import {
  useVeteransHomeCare,
  useCreateVeteransHomeCare,
  useUpdateVeteransHomeCare,
  useDeleteVeteransHomeCare,
} from "@/store/data/cms/veteransHomeCare/hook";

// Form schema
const veteransHomeCareSchema = z.object({
  title1: z.string().min(1, "Title 1 is required").max(255, "Title 1 must be less than 255 characters"),
  description1: z.string().min(1, "Description 1 is required"),
  image1: z.string().url("Valid image URL is required"),
  image2: z.string().url("Valid image URL is required"),
  image3: z.string().url("Valid image URL is required"),
  title2: z.string().min(1, "Title 2 is required").max(255, "Title 2 must be less than 255 characters"),
  description2: z.string().min(1, "Description 2 is required"),
  title3: z.string().min(1, "Title 3 is required").max(255, "Title 3 must be less than 255 characters"),
  points: z.array(z.string().min(1, "Point cannot be empty")).min(1, "At least one point is required"),
  sectionImage: z.string().url("Valid section image URL is required"),
});

type VeteransHomeCareFormData = z.infer<typeof veteransHomeCareSchema>;

function VeteransHomeCare() {
  const [isEditing, setIsEditing] = useState(false);
  const [newPoint, setNewPoint] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data: veteransHomeCareData, isFetching: isFetchingVeteransHomeCare, error } = useVeteransHomeCare();
  const createMutation = useCreateVeteransHomeCare();
  const updateMutation = useUpdateVeteransHomeCare();
  const deleteMutation = useDeleteVeteransHomeCare();

  const veteransHomeCare = veteransHomeCareData?.data?.veteransHomeCare;

  const form = useForm<VeteransHomeCareFormData>({
    resolver: zodResolver(veteransHomeCareSchema),
    defaultValues: {
      title1: "",
      description1: "",
      image1: "",
      image2: "",
      image3: "",
      title2: "",
      description2: "",
      title3: "",
      points: [],
      sectionImage: "",
    },
  });

  useEffect(() => {
    replacePageName("Veterans Home Care");
  }, []);

  useEffect(() => {
    if (error && (error as any)?.response?.status !== 404) {
      console.error("Error fetching Veterans Home Care:", error);
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    if (veteransHomeCare) {
      form.reset({
        title1: veteransHomeCare.title1 || "",
        description1: veteransHomeCare.description1 || "",
        image1: veteransHomeCare.image1 || "",
        image2: veteransHomeCare.image2 || "",
        image3: veteransHomeCare.image3 || "",
        title2: veteransHomeCare.title2 || "",
        description2: veteransHomeCare.description2 || "",
        title3: veteransHomeCare.title3 || "",
        points: veteransHomeCare.points || [],
        sectionImage: veteransHomeCare.sectionImage || "",
      });
      setIsEditing(false);
    }
  }, [veteransHomeCare, form]);

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (veteransHomeCare) {
      form.reset({
        title1: veteransHomeCare.title1 || "",
        description1: veteransHomeCare.description1 || "",
        image1: veteransHomeCare.image1 || "",
        image2: veteransHomeCare.image2 || "",
        image3: veteransHomeCare.image3 || "",
        title2: veteransHomeCare.title2 || "",
        description2: veteransHomeCare.description2 || "",
        title3: veteransHomeCare.title3 || "",
        points: veteransHomeCare.points || [],
        sectionImage: veteransHomeCare.sectionImage || "",
      });
    }
  };

  const handleSubmit = (values: VeteransHomeCareFormData) => {
    if (veteransHomeCare) {
      updateMutation.mutate(
        { id: veteransHomeCare.id, updateData: values },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
          onError: (error) => {
            showError(error);
          }
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error) => {
          showError(error);
        }
      });
    }
  };

  const handleDelete = () => {
    if (veteransHomeCare) {
      deleteMutation.mutate(veteransHomeCare.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
        onError: (error) => {
          showError(error);
        }
      });
    }
  };

  const addPoint = () => {
    if (!newPoint.trim()) return;

    const currentPoints = form.getValues("points") || [];
    form.setValue("points", [...currentPoints, newPoint.trim()]);
    setNewPoint("");
  };

  const removePoint = (index: number) => {
    const currentPoints = form.getValues("points") || [];
    form.setValue("points", currentPoints.filter((_, i) => i !== index));
  };

  if (isFetchingVeteransHomeCare && !veteransHomeCareData) {
    return <PageLoadingSpinner />;
  }

  if (!veteransHomeCare && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
         
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FiHome className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Veterans Home Care Page Found
              </h3>
              <p className="text-gray-600">
                No Veterans Home Care page available at the moment.
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
              {veteransHomeCare ? "Edit Page" : "Create Page"}
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
            {isEditing 
              ? (veteransHomeCare ? "Edit Veterans Home Care" : "Create Veterans Home Care") 
              : "Veterans Home Care"
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Section 1 */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="description1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description for section 1"
                            {...field}
                            className="min-h-[100px] resize-none"
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 2: Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images Gallery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["image1", "image2", "image3"].map((imageField, index) => (
                      <FormField
                        key={imageField}
                        control={form.control}
                        name={imageField as keyof VeteransHomeCareFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image {index + 1} URL</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {isEditing && (
                                  <ImageUpload
                                    onImageUpload={(url) => handleImageUpload(field, url)}
                                    currentImage={typeof field.value === 'string' ? field.value : undefined}
                                    disabled={!isEditing}
                                  />
                                )}
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                  readOnly={!isEditing}
                                />
                                {field.value && typeof field.value === 'string' && (
                                  <div className="aspect-video rounded overflow-hidden bg-gray-100 mt-2">
                                    <img
                                      src={field.value}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Section 3 */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="description2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description for section 2"
                            {...field}
                            className="min-h-[100px] resize-none"
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 4: Points and Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Section 3: Key Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title for key points section"
                            {...field}
                            readOnly={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Points</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {isEditing && (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter a key point"
                                  value={newPoint}
                                  onChange={(e) => setNewPoint(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addPoint();
                                    }
                                  }}
                                />
                                <CustomButton
                                  type="button"
                                  onClick={addPoint}
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </CustomButton>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              {field.value?.map((point, index) => (
                                <div key={index} className="flex items-center justify-between gap-2 p-2 border rounded">
                                  <span className="flex-1">{point}</span>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => removePoint(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <TrashIcon className="w-4 h-4" />
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

                  <FormField
                    control={form.control}
                    name="sectionImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {isEditing && (
                              <ImageUpload
                                onImageUpload={(url) => handleImageUpload(field, url)}
                                currentImage={field.value}
                                disabled={!isEditing}
                              />
                            )}
                            <Input
                              placeholder="https://example.com/section-image.jpg"
                              {...field}
                              readOnly={!isEditing}
                            />
                            {field.value && typeof field.value === 'string' && (
                              <div className="aspect-square max-w-md rounded overflow-hidden bg-gray-100 mt-2">
                                <img
                                  src={field.value}
                                  alt="Section preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
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
                <div className="flex justify-between items-center pt-6 border-t">
                  <div>
                    {veteransHomeCare && (
                      <CustomButton
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete Page
                      </CustomButton>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <CustomButton
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      {veteransHomeCare ? "Update Page" : "Create Page"}
                    </CustomButton>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Simple Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Veterans Home Care Page
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the Veterans Home Care page? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <CustomButton
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleDelete}
             
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <LoadingSpinner/> : null}
                Delete
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VeteransHomeCare;