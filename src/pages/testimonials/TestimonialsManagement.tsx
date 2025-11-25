import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
  FiPlus as PlusIcon, 
  FiTrash2 as TrashIcon,
  FiStar,
  FiUser,
  FiBriefcase,
  FiX as CloseIcon
} from "react-icons/fi";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
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
import { Badge } from "@/components/ui/badge";
import { DeleteDialog } from "@/components/common/CustomDialog";
import { ImageUpload } from "@/components/common/ImageUpload";

import {
  useTestimonials,
  useTestimonial,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
 
} from "@/store/data/cms/testimonials/hook";

// Form schema
const testimonialSchema = z.object({
  profilePic: z.string().optional().or(z.literal("")),
  name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Name must be less than 255 characters" }),
  profession: z.string().min(1, { message: "Profession is required" }).max(255, { message: "Profession must be less than 255 characters" }),
  rating: z.number().int().min(1, { message: "Rating must be at least 1" }).max(5, { message: "Rating must be at most 5" }),
  description: z.string().min(1, { message: "Testimonial description is required" }),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

function TestimonialsManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data: testimonialsData, isFetching: isFetchingTestimonials } = useTestimonials();
  const { data: testimonialData } = useTestimonial(editingTestimonial || "");
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const testimonials = testimonialsData?.data?.testimonials || [];
  const currentTestimonial = testimonialData?.data?.testimonial;

  const testimonialForm = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      profilePic: "",
      name: "",
      profession: "",
      rating: 5,
      description: "",
    },
  });

  useEffect(() => {
    replacePageName("Testimonials Management");
  }, []);

  useEffect(() => {
    if (currentTestimonial && editingTestimonial) {
      testimonialForm.reset({
        profilePic: currentTestimonial.profilePic || "",
        name: currentTestimonial.name,
        profession: currentTestimonial.profession,
        rating: currentTestimonial.rating,
        description: currentTestimonial.description,
      });
    }
  }, [currentTestimonial, editingTestimonial, testimonialForm]);

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTestimonial(null);
    testimonialForm.reset({
      profilePic: "",
      name: "",
      profession: "",
      rating: 5,
      description: "",
    });
  };

  const handleEditTestimonial = (id: string) => {
    setEditingTestimonial(id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTestimonial(null);
    testimonialForm.reset();
  };

  const handleSubmit = (values: TestimonialFormData) => {
    if (editingTestimonial) {
      updateTestimonial.mutate(
        { id: editingTestimonial, updateData: values },
        {
          onSuccess: () => {
            setEditingTestimonial(null);
          },
        }
      );
    } else {
      createTestimonial.mutate(values, {
        onSuccess: () => {
          setIsCreating(false);
          testimonialForm.reset();
        },
      });
    }
  };

  const handleDeleteTestimonial = () => {
    if (!testimonialToDelete) return;

    deleteTestimonial.mutate(testimonialToDelete, {
      onSuccess: () => {
        setOpenDeleteDialog(false);
        setTestimonialToDelete(null);
      },
    });
  };

  const openDeleteConfirm = (id: string) => {
    setTestimonialToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-white"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-white">({rating}/5)</span>
      </div>
    );
  };

  if (isFetchingTestimonials && !testimonialsData) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
     
        
        <CustomButton
          onClick={handleCreateNew}
          className="flex items-center gap-2 green-button"
        >
          <PlusIcon className="w-4 h-4" />
          New Testimonial
        </CustomButton>
      </div>

      {/* Testimonial Form Section */}
      {(isCreating || editingTestimonial) && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
              </CardTitle>
              <CustomButton
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <CloseIcon className="w-4 h-4" />
                Close
              </CustomButton>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...testimonialForm}>
              <form onSubmit={testimonialForm.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Profile Picture Upload */}
                <FormField
                  control={testimonialForm.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <ImageUpload
                            onImageUpload={(url) => handleImageUpload(field, url)}
                            currentImage={field.value}
                          />
                          {field.value && (
                            <div className="mt-2">
                              <Input
                                {...field}
                                readOnly
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name and Profession */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={testimonialForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter customer name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={testimonialForm.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession/Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter profession or company"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Rating */}
                <FormField
                  control={testimonialForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Star Rating Input */}
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => field.onChange(star)}
                                className={`p-1 rounded-full transition-colors ${
                                  star <= field.value 
                                    ? "bg-yellow-100 text-yellow-600" 
                                    : "bg-gray-100 text-white"
                                } hover:bg-yellow-200 hover:text-yellow-700`}
                              >
                                <FiStar className="w-6 h-6" />
                              </button>
                            ))}
                            <span className="ml-2 text-lg font-medium text-white">
                              {field.value} / 5
                            </span>
                          </div>
                          
                          {/* Numeric Input as Backup */}
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Testimonial Description */}
                <FormField
                  control={testimonialForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testimonial Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the testimonial content"
                          {...field}
                          className="min-h-[150px] resize-none"
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
                    disabled={createTestimonial.isPending || updateTestimonial.isPending}
                  >
                    {(createTestimonial.isPending || updateTestimonial.isPending) ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </CustomButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List Section */}
      {!isCreating && !editingTestimonial && (
        <Card>
          <CardHeader>
            <CardTitle>
              Customer Testimonials ({testimonials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFetchingTestimonials ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-8 text-white">
                <FiUser className="w-16 h-16 mx-auto text-white mb-4" />
                <p className="text-lg">No testimonials found.</p>
                <p className="text-white">Create your first testimonial to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      {/* Testimonial Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {testimonial.profilePic ? (
                            <img
                              src={testimonial.profilePic}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiUser className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-white">{testimonial.name}</h3>
                            <div className="flex items-center gap-1 text-white">
                              <FiBriefcase className="w-3 h-3" />
                              <span className="text-sm">{testimonial.profession}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          <CustomButton
                            onClick={() => handleEditTestimonial(testimonial.id)}
                          >
                            <EditIcon className="w-3 h-3" />
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm(testimonial.id)}
                          >
                            <TrashIcon className="w-3 h-3" />
                          </CustomButton>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-3">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Testimonial Content */}
                      <p className="text-white whitespace-pre-wrap line-clamp-4">
                        {testimonial.description}
                      </p>

                      {/* Timestamp */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs">
                          Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setTestimonialToDelete(null);
        }}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setTestimonialToDelete(null);
        }}
        onConfirm={handleDeleteTestimonial}
        isDeleting={deleteTestimonial.isPending}
      />
    </div>
  );
}

export default TestimonialsManagement;