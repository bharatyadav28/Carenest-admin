import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
  FiPlus as PlusIcon, 
  FiTrash2 as TrashIcon,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
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
import { DeleteDialog } from "@/components/common/CustomDialog";

import {
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/store/data/cms/contact/hook";

// Form schema
const contactSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }).max(20, { message: "Phone number must be less than 20 characters" }),
  email: z.string().email({ message: "Valid email is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  businessHours: z.string().min(1, { message: "Business hours are required" }).max(100, { message: "Business hours must be less than 100 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching } = useContact();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contactData = data?.data?.contact;
  const contactExists = !!contactData;

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phoneNumber: "",
      email: "",
      address: "",
      businessHours: "",
    },
  });

  // Reset form when data is fetched
  useEffect(() => {
    if (contactData) {
      contactForm.reset({
        phoneNumber: contactData.phoneNumber,
        email: contactData.email,
        address: contactData.address,
        businessHours: contactData.businessHours,
      });
    }
  }, [contactData, contactForm]);



  useEffect(() => {
    replacePageName("Contact Page Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form to original data when canceling edit
      if (contactData) {
        contactForm.reset({
          phoneNumber: contactData.phoneNumber,
          email: contactData.email,
          address: contactData.address,
          businessHours: contactData.businessHours,
        });
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    contactForm.reset({
      phoneNumber: "",
      email: "",
      address: "",
      businessHours: "",
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    if (contactData) {
      contactForm.reset({
        phoneNumber: contactData.phoneNumber,
        email: contactData.email,
        address: contactData.address,
        businessHours: contactData.businessHours,
      });
    }
  };

  const handleSubmit = (values: ContactFormData) => {
    if (isCreating) {
      createContact.mutate(values, {
        onSuccess: () => {
          setIsCreating(false);
        },
      });
    } else {
      updateContact.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    }
  };

  const handleDeleteContact = () => {
    deleteContact.mutate(undefined, {
      onSuccess: () => {
        setOpenDeleteDialog(false);
        setIsCreating(true);
      },
    });
  };

  if (isFetching && !data) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
      
        
        <div className="flex items-center gap-4">
     
          
          {contactExists ? (
            <>
              <CustomButton
                onClick={handleEditToggle}
                className="flex items-center gap-2"
              >
                <EditIcon className="w-6 h-6" />
                {isEditing ? "Cancel Editing" : "Edit Contact Info"}
              </CustomButton>
              
         
            </>
          ) : (
            <CustomButton
              onClick={handleCreateNew}
              className="flex items-center gap-2 green-button"
            >
              <PlusIcon className="w-6 h-6" />
              Create Contact Page
            </CustomButton>
          )}
        </div>
      </div>

      {/* Contact Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isCreating ? "Create Contact Page" : "Contact Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!contactExists && !isCreating) ? (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <FiMapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contact Page Found</h3>
                <p className="text-gray-600 mb-6">
                  You haven't set up your contact information yet. Create your contact page to display your business details.
                </p>
                <CustomButton
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 green-button mx-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Contact Page
                </CustomButton>
              </div>
            </div>
          ) : (
            <Form {...contactForm}>
              <form onSubmit={contactForm.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Phone Number */}
                <FormField
                  control={contactForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg">
                        <FiPhone className="w-5 h-5 text-blue-600" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          disabled={!isEditing && !isCreating}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg">
                        <FiMail className="w-5 h-5 text-green-600" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@company.com"
                          {...field}
                          disabled={!isEditing && !isCreating}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={contactForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg">
                        <FiMapPin className="w-5 h-5 text-red-600" />
                        Business Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your complete business address"
                          {...field}
                          disabled={!isEditing && !isCreating}
                          className="min-h-[100px] resize-none text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Hours */}
                <FormField
                  control={contactForm.control}
                  name="businessHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg">
                        <FiClock className="w-5 h-5 text-purple-600" />
                        Business Hours
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                          {...field}
                          disabled={!isEditing && !isCreating}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                {(isEditing || isCreating) && (
                  <div className="flex gap-4 pt-6 border-t">
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={createContact.isPending || updateContact.isPending}
                    >
                      {(createContact.isPending || updateContact.isPending) ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      {isCreating ? 'Create Contact Page' : 'Save Changes'}
                    </CustomButton>
                    
                    <CustomButton
                      type="button"
                      onClick={isCreating ? handleCancelCreate : handleEditToggle}
                    >
                      Cancel
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          )}

         
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => setOpenDeleteDialog(false)}
        title="Delete Contact Page"
        description="Are you sure you want to delete the contact page? This will remove all contact information and cannot be undone."
        Icon={TrashIcon}
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteContact}
        isDeleting={deleteContact.isPending}
      />
    </div>
  );
}

export default ContactManagement;