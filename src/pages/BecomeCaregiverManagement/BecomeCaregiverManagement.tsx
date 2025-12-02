import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiPlus as PlusIcon,
  FiTrash2 as TrashIcon,
  FiStar as StarIcon,
 
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
import { DeleteDialog } from "@/components/common/CustomDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import RichTextEditor from "@/components/common/RichTextEditor";

import {
  useBecomeCaregiver,
  useUpdateBecomeCaregiver,
  useUpdatePoints,
  useAddTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/store/data/cms/becomeCaregiver/hook";

// Form schemas
const section1Schema = z.object({
  title1: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description1: z.string().min(1, "Description is required"),
});

const section2Schema = z.object({
  title2: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
});

const section3Schema = z.object({
  title3: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  testImage1: z.string().url("Valid image URL is required"),
  testImage2: z.string().url("Valid image URL is required"),
});

const pointSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(255, "Heading must be less than 255 characters"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().url("Valid icon URL is required"),
});

const testimonialSchema = z.object({
  description: z.string().min(1, "Description is required"),
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
});

type Section1Data = z.infer<typeof section1Schema>;
type Section2Data = z.infer<typeof section2Schema>;
type Section3Data = z.infer<typeof section3Schema>;
type PointData = z.infer<typeof pointSchema>;
type TestimonialData = z.infer<typeof testimonialSchema>;

function BecomeCaregiverManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("section1");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; data?: any } | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; index: number; id?: string } | null>(null);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useBecomeCaregiver();
  const updateBecomeCaregiver = useUpdateBecomeCaregiver();
  const updatePoints = useUpdatePoints();
  const addTestimonial = useAddTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const becomeCaregiverData = data?.data?.becomeCaregiver;

  // Forms
  const section1Form = useForm<Section1Data>({
    resolver: zodResolver(section1Schema),
    defaultValues: {
      title1: "",
      description1: "",
    },
  });

  const section2Form = useForm<Section2Data>({
    resolver: zodResolver(section2Schema),
    defaultValues: {
      title2: "",
    },
  });

  const section3Form = useForm<Section3Data>({
    resolver: zodResolver(section3Schema),
    defaultValues: {
      title3: "",
      testImage1: "",
      testImage2: "",
    },
  });

  const pointForm = useForm<PointData>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      heading: "",
      description: "",
      icon: "",
    },
  });

  const testimonialForm = useForm<TestimonialData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  // Reset forms when data is fetched
  useEffect(() => {
    if (becomeCaregiverData) {
      section1Form.reset({
        title1: becomeCaregiverData.title1,
        description1: becomeCaregiverData.description1,
      });
      section2Form.reset({
        title2: becomeCaregiverData.title2,
      });
      section3Form.reset({
        title3: becomeCaregiverData.title3,
        testImage1: becomeCaregiverData.testImage1,
        testImage2: becomeCaregiverData.testImage2,
      });
    }
  }, [becomeCaregiverData, section1Form, section2Form, section3Form]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Become Caregiver Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditingItem(null);
      // Reset forms to original data
      if (becomeCaregiverData) {
        section1Form.reset({
          title1: becomeCaregiverData.title1,
          description1: becomeCaregiverData.description1,
        });
        section2Form.reset({
          title2: becomeCaregiverData.title2,
        });
        section3Form.reset({
          title3: becomeCaregiverData.title3,
          testImage1: becomeCaregiverData.testImage1,
          testImage2: becomeCaregiverData.testImage2,
        });
      }
    }
  };

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleSectionSubmit = {
    section1: (values: Section1Data) => {
      updateBecomeCaregiver.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
    section2: (values: Section2Data) => {
      updateBecomeCaregiver.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
    section3: (values: Section3Data) => {
      updateBecomeCaregiver.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
  };

  const handleAddPoint = (values: PointData) => {
    if (!becomeCaregiverData?.points) return;

    const newPoint = {
      id: `temp-${Date.now()}`,
      ...values,
    };

    const updatedPoints = [...becomeCaregiverData.points];
    
    if (editingItem?.index === -1) {
      // Add new point (if there's space)
      if (updatedPoints.length < 6) {
        updatedPoints.push(newPoint);
      } else {
        showError(new Error("Maximum 6 points allowed"));
        return;
      }
    } else {
      // Update existing point
      if (editingItem?.index !== undefined) {
        updatedPoints[editingItem.index] = newPoint;
      }
    }

    updatePoints.mutate(updatedPoints, {
      onSuccess: () => {
        setEditingItem(null);
        pointForm.reset();
      },
    });
  };

  const handleAddTestimonial = (values: TestimonialData) => {
    if (editingItem?.index === -1) {
      // Add new testimonial
      addTestimonial.mutate(values, {
        onSuccess: () => {
          setEditingItem(null);
          testimonialForm.reset();
        },
      });
    } else {
      // Update existing testimonial
      if (!editingItem?.data?.id) return;
      
      updateTestimonial.mutate({
        testimonialId: editingItem.data.id,
        testimonialData: values,
      }, {
        onSuccess: () => {
          setEditingItem(null);
          testimonialForm.reset();
        },
      });
    }
  };

  const handleDeleteItem = () => {
    if (!itemToDelete || !becomeCaregiverData) return;

    const { type, index, id } = itemToDelete;

    switch (type) {
      case 'point':
        const updatedPoints = becomeCaregiverData.points?.filter((_ :any, i:any) => i !== index) || [];
        updatePoints.mutate(updatedPoints);
        break;
      case 'testimonial':
        if (id) {
          deleteTestimonial.mutate(id);
        }
        break;
    }

    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const openDeleteConfirm = (type: string, index: number, id?: string) => {
    setItemToDelete({ type, index, id });
    setOpenDeleteDialog(true);
  };

  const startEditingItem = (type: string, index: number, data?: any) => {
    setEditingItem({ type, index, data });
    switch (type) {
      case 'point':
        pointForm.reset(data || {
          heading: "",
          description: "",
          icon: "",
        });
        break;
      case 'testimonial':
        testimonialForm.reset(data || {
          description: "",
          name: "",
        });
        break;
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    pointForm.reset();
    testimonialForm.reset();
  };

  if (isFetching) {
    return <PageLoadingSpinner />;
  }

  if (!becomeCaregiverData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-lg">No Become Caregiver data found. Please create Become Caregiver page first.</p>
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
          <CustomButton
            onClick={handleEditToggle}
            className="flex items-center gap-2"
          >
            <EditIcon className="w-6 h-6" />
            {isEditing ? "Cancel Editing" : "Edit Content"}
          </CustomButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {['section1', 'section2', 'section3'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeSection === section
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {section === 'section1' && 'Section 1: Introduction'}
            {section === 'section2' && 'Section 2: Points'}
            {section === 'section3' && 'Section 3: Testimonials'}
          </button>
        ))}
      </div>

      {/* Section 1: Introduction */}
      {activeSection === 'section1' && (
        <Card>
          <CardHeader>
            <CardTitle>Section 1: Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...section1Form}>
              <form onSubmit={section1Form.handleSubmit(handleSectionSubmit.section1)} className="space-y-6">
                <FormField
                  control={section1Form.control}
                  name="title1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={section1Form.control}
                  name="description1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter section description"
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
                      disabled={updateBecomeCaregiver.isPending}
                    >
                      {updateBecomeCaregiver.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Section 1
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Points */}
      {activeSection === 'section2' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Section 2: Points ({becomeCaregiverData.points?.length || 0}/6)</CardTitle>
              {isEditing && becomeCaregiverData.points && becomeCaregiverData.points.length < 6 && (
                <CustomButton
                  onClick={() => startEditingItem('point', -1)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Point
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Section 2 Title */}
            <Form {...section2Form}>
              <form onSubmit={section2Form.handleSubmit(handleSectionSubmit.section2)} className="space-y-6 mb-8">
                <FormField
                  control={section2Form.control}
                  name="title2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEditing && (
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={updateBecomeCaregiver.isPending}
                  >
                    {updateBecomeCaregiver.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Save Title
                  </CustomButton>
                )}
              </form>
            </Form>

            {/* Add/Edit Point Form */}
            {editingItem?.type === 'point' && (
              <Card className="mb-6 border-blue-200">
                <CardContent className="pt-6">
                  <Form {...pointForm}>
                    <form onSubmit={pointForm.handleSubmit(handleAddPoint)} className="space-y-6">
                      <FormField
                        control={pointForm.control}
                        name="heading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heading</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter point heading"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={pointForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter point description"
                                {...field}
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={pointForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Image</FormLabel>
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

                      <div className="flex gap-4 pt-4">
                        <CustomButton
                          type="submit"
                          className="flex items-center gap-2 green-button"
                        >
                          <SaveIcon className="w-4 h-4" />
                          {editingItem.index === -1 ? 'Add Point' : 'Update Point'}
                        </CustomButton>
                        <CustomButton
                          type="button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </CustomButton>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {becomeCaregiverData.points?.map((point:any, index:any) => (
                <Card key={point.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {point.icon && (
                          <img 
                            src={point.icon} 
                            alt={point.heading}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <h3 className="text-lg font-bold">{point.heading}</h3>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => startEditingItem('point', index, point)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm('point', index)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </CustomButton>
                        </div>
                      )}
                    </div>
                    <p className="text-white">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Testimonials */}
      {activeSection === 'section3' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Section 3: Testimonials</CardTitle>
              {isEditing && (
                <CustomButton
                  onClick={() => startEditingItem('testimonial', -1)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Testimonial
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Section 3 Title and Images */}
            <Form {...section3Form}>
              <form onSubmit={section3Form.handleSubmit(handleSectionSubmit.section3)} className="space-y-6 mb-8">
                <FormField
                  control={section3Form.control}
                  name="title3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={section3Form.control}
                    name="testImage1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Image 1</FormLabel>
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
                    control={section3Form.control}
                    name="testImage2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Image 2</FormLabel>
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

                {isEditing && (
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={updateBecomeCaregiver.isPending}
                  >
                    {updateBecomeCaregiver.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Save Section 3
                  </CustomButton>
                )}
              </form>
            </Form>

            {/* Add/Edit Testimonial Form */}
            {editingItem?.type === 'testimonial' && (
              <Card className="mb-6 border-green-200">
                <CardContent className="pt-6">
                  <Form {...testimonialForm}>
                    <form onSubmit={testimonialForm.handleSubmit(handleAddTestimonial)} className="space-y-6">
                      <FormField
                        control={testimonialForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Testimonial Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter testimonial description"
                                {...field}
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={testimonialForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter person's name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 pt-4">
                        <CustomButton
                          type="submit"
                          className="flex items-center gap-2 green-button"
                        >
                          <SaveIcon className="w-4 h-4" />
                          {editingItem.index === -1 ? 'Add Testimonial' : 'Update Testimonial'}
                        </CustomButton>
                        <CustomButton
                          type="button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </CustomButton>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Testimonials List */}
            <div className="space-y-6">
              {becomeCaregiverData.testimonials?.map((testimonial:any, index:any) => (
                <Card key={testimonial.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StarIcon className="w-5 h-5 text-yellow-500" />
                          <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        </div>
                        <p className="text-white whitespace-pre-wrap">{testimonial.description}</p>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2 ml-4">
                          <CustomButton
                            onClick={() => startEditingItem('testimonial', index, testimonial)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm('testimonial', index, testimonial.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
        }}
        title={itemToDelete?.type === 'point' ? "Delete Point" : "Delete Testimonial"}
        description="Are you sure you want to delete this item? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteItem}
        isDeleting={updatePoints.isPending || deleteTestimonial.isPending}
      />
    </div>
  );
}

export default BecomeCaregiverManagement;