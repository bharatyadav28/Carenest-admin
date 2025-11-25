import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
  FiPlus as PlusIcon, 
  FiTrash2 as TrashIcon,
  FiLink as LinkIcon,
  FiMapPin as LocationIcon,
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
import { DeleteDialog } from "@/components/common/CustomDialog";
import { ImageUpload } from "@/components/common/ImageUpload";

import {
  useFooter,
  useUpdateFooter,
  useAddLocation,
  useUpdateLocation,
  useDeleteLocation,
  useAddSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
} from "@/store/data/cms/footer/hook";

// Form schemas
const footerDescriptionSchema = z.object({
  footerDescription: z.string().min(1, { message: "Footer description is required" }),
});

const locationSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }).max(255),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform name is required" }).max(50),
  url: z.string().url({ message: "Valid URL is required" }),
  icon: z.string().url({ message: "Valid icon URL is required" }), // Changed to URL validation for image
});

function FooterManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("description");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; data?: any } | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; index: number; id?: string } | null>(null);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useFooter();
  const updateFooter = useUpdateFooter();
  const addLocation = useAddLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();
  const addSocialLink = useAddSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();

  const footerData = data?.data?.footer;

  // Forms
  const descriptionForm = useForm<z.infer<typeof footerDescriptionSchema>>({
    resolver: zodResolver(footerDescriptionSchema),
    defaultValues: {
      footerDescription: "",
    },
  });

  const locationForm = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: "",
    },
  });

  const socialLinkForm = useForm<z.infer<typeof socialLinkSchema>>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
    },
  });

  // Reset forms when data is fetched
  useEffect(() => {
    if (footerData) {
      descriptionForm.reset({
        footerDescription: footerData.footerDescription,
      });
    }
  }, [footerData, descriptionForm]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Footer Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditingItem(null);
      // Reset forms to original data
      if (footerData) {
        descriptionForm.reset({
          footerDescription: footerData.footerDescription,
        });
      }
    }
  };

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    if (footerData) {
      descriptionForm.reset({
        footerDescription: footerData.footerDescription,
      });
    }
    locationForm.reset();
    socialLinkForm.reset();
  };

  const handleDescriptionSubmit = (values: z.infer<typeof footerDescriptionSchema>) => {
    updateFooter.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleAddLocation = (values: z.infer<typeof locationSchema>) => {
    addLocation.mutate(values.location, {
      onSuccess: () => {
        setEditingItem(null);
        locationForm.reset();
      },
    });
  };

  const handleEditLocation = (values: z.infer<typeof locationSchema>) => {
    if (!editingItem || !footerData?.locations) return;
    
    const oldLocation = footerData.locations[editingItem.index];
    updateLocation.mutate({
      oldLocation,
      newLocation: values.location
    }, {
      onSuccess: () => {
        setEditingItem(null);
        locationForm.reset();
      },
    });
  };

  const handleAddSocialLink = (values: z.infer<typeof socialLinkSchema>) => {
    addSocialLink.mutate(values, {
      onSuccess: () => {
        setEditingItem(null);
        socialLinkForm.reset();
      },
    });
  };

  const handleEditSocialLink = (values: z.infer<typeof socialLinkSchema>) => {
    if (!editingItem || !footerData?.socialLinks) return;
    
    const linkId = footerData.socialLinks[editingItem.index].id;
    updateSocialLink.mutate({
      linkId,
      socialLink: values
    }, {
      onSuccess: () => {
        setEditingItem(null);
        socialLinkForm.reset();
      },
    });
  };

  const handleDeleteItem = () => {
    if (!itemToDelete || !footerData) return;

    const { type, index, id } = itemToDelete;

    switch (type) {
      case 'location':
        const location = footerData.locations?.[index];
        if (location) {
          deleteLocation.mutate(location);
        }
        break;
      case 'socialLink':
        if (id) {
          deleteSocialLink.mutate(id);
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
      case 'location':
        locationForm.reset({ location: data });
        break;
      case 'socialLink':
        socialLinkForm.reset(data);
        break;
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    locationForm.reset();
    socialLinkForm.reset();
  };

  if (isFetching) {
    return <PageLoadingSpinner />;
  }

  if (!footerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-lg">No footer data found. Please create footer first.</p>
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
              Edit Footer
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

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {['description', 'locations', 'socialLinks'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeSection === section
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {section === 'description' && 'Description'}
            {section === 'locations' && 'Locations'}
            {section === 'socialLinks' && 'Social Links'}
          </button>
        ))}
      </div>

      {/* Description Section */}
      {activeSection === 'description' && (
        <Card>
          <CardHeader>
            <CardTitle>Footer Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...descriptionForm}>
              <form onSubmit={descriptionForm.handleSubmit(handleDescriptionSubmit)} className="space-y-6">
                <FormField
                  control={descriptionForm.control}
                  name="footerDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter footer description"
                          {...field}
                          disabled={!isEditing}
                          className="min-h-[120px]"
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
                      disabled={updateFooter.isPending}
                    >
                      {updateFooter.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Description
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Locations Section */}
      {activeSection === 'locations' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Locations</CardTitle>
              {isEditing && (
                <CustomButton
                  onClick={() => setEditingItem({ type: 'location', index: -1 })}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Location
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add/Edit Location Form */}
            {editingItem?.type === 'location' && (
              <Card className="mb-6 border-blue-200">
                <CardContent className="pt-6">
                  <Form {...locationForm}>
                    <form onSubmit={locationForm.handleSubmit(
                      editingItem.index === -1 ? handleAddLocation : handleEditLocation
                    )} className="space-y-6">
                      <FormField
                        control={locationForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter location"
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
                          {editingItem.index === -1 ? 'Add Location' : 'Update Location'}
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

            {/* Locations List */}
            <div className="space-y-4">
              {footerData?.locations?.map((location, index) => (
                <Card key={index} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <LocationIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-lg">{location}</span>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => startEditingItem('location', index, location)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm('location', index)}
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

      {/* Social Links Section */}
      {activeSection === 'socialLinks' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Social Links</CardTitle>
              {isEditing && (
                <CustomButton
                  onClick={() => setEditingItem({ type: 'socialLink', index: -1 })}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Social Link
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add/Edit Social Link Form */}
            {editingItem?.type === 'socialLink' && (
              <Card className="mb-6 border-green-200">
                <CardContent className="pt-6">
                  <Form {...socialLinkForm}>
                    <form onSubmit={socialLinkForm.handleSubmit(
                      editingItem.index === -1 ? handleAddSocialLink : handleEditSocialLink
                    )} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={socialLinkForm.control}
                          name="platform"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Platform Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Facebook, Twitter"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={socialLinkForm.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={socialLinkForm.control}
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
                          {editingItem.index === -1 ? 'Add Social Link' : 'Update Social Link'}
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

            {/* Social Links List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {footerData?.socialLinks?.map((link, index) => (
                <Card key={link.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {link.icon ? (
                          <img 
                            src={link.icon} 
                            alt={link.platform}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <LinkIcon className="w-8 h-8 text-gray-500" />
                        )}
                        <div>
                          <h3 className="text-lg font-bold">{link.platform}</h3>
                          <p className="text-sm text-gray-600 break-all">{link.url}</p>
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => startEditingItem('socialLink', index, link)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm('socialLink', index, link.id)}
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
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteItem}
        isDeleting={deleteLocation.isPending || deleteSocialLink.isPending}
      />
    </div>
  );
}

export default FooterManagement;