import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiX as CloseIcon,
  FiPlus as PlusIcon,
  FiTrash2 as TrashIcon,
  FiMapPin as MapPinIcon,
  FiRefreshCw as RefreshIcon
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
  useAllLocationServices,
  useCreateLocationService,
  useUpdateLocationService,
  useDeleteLocationService,
  useAddServiceItem,
  useUpdateServiceItem,
  useDeleteServiceItem,
  LocationServiceType,
  ServiceItem,
} from "@/store/data/cms/locationServices/hook";

// Form schema
const locationServiceSchema = z.object({
  city: z.string().min(1, "City is required").max(100, "City must be less than 100 characters"),
  state: z.string().min(1, "State is required").max(100, "State must be less than 100 characters"),
  heroTitle: z.string().min(1, "Hero title is required").max(255, "Hero title must be less than 255 characters"),
  heroImage: z.string().url("Valid hero image URL is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
  whyChooseTitle: z.string().min(1, "Why choose title is required").max(255, "Why choose title must be less than 255 characters"),
  whyChooseDescription: z.string().min(1, "Why choose description is required"),
  servicesIntro: z.string().min(1, "Services intro is required").max(255, "Services intro must be less than 255 characters"),
  servicesDescription: z.string().min(1, "Services description is required"),
  services: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Service title is required").max(255, "Service title must be less than 255 characters"),
    items: z.array(z.string().min(1, "Item cannot be empty")).min(1, "At least one item is required"),
    image: z.string().url("Valid service image URL is required"),
  })).min(1, "At least one service is required").max(3, "Maximum 3 services allowed"),
  careDesignedTitle: z.string().min(1, "Care designed title is required").max(255, "Care designed title must be less than 255 characters"),
  careDesignedDescription: z.string().min(1, "Care designed description is required"),
  careDesignedImage: z.string().url("Valid care designed image URL is required"),
  proudlyServingTitle: z.string().min(1, "Proudly serving title is required").max(255, "Proudly serving title must be less than 255 characters"),
  proudlyServingDescription: z.string().min(1, "Proudly serving description is required"),
  steadyPartnerTitle: z.string().min(1, "Steady partner title is required").max(255, "Steady partner title must be less than 255 characters"),
  steadyPartnerDescription: z.string().min(1, "Steady partner description is required"),
});

type LocationServiceFormData = z.infer<typeof locationServiceSchema>;

const MAX_LOCATIONS = 5;
const MAX_SERVICES = 3;

function LocationServicesAdmin() {
  const [activeLocation, setActiveLocation] = useState<LocationServiceType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteServiceConfirm, setShowDeleteServiceConfirm] = useState<{serviceId: string, serviceTitle: string} | null>(null);
  const [newServiceItem, setNewServiceItem] = useState<ServiceItem>({
    id: "",
    title: "",
    items: [""],
    image: "",
  });

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { 
    data: locationServicesData, 
    isFetching: isFetchingLocationServices, 
    error, 
    refetch 
  } = useAllLocationServices();

  const createMutation = useCreateLocationService();
  const updateMutation = useUpdateLocationService();
  const deleteMutation = useDeleteLocationService();
  const addServiceItemMutation = useAddServiceItem();
  const updateServiceItemMutation = useUpdateServiceItem();
  const deleteServiceItemMutation = useDeleteServiceItem();

  const locationServices = locationServicesData?.data?.locationServices || [];
  const canAddMoreLocations = locationServices.length < MAX_LOCATIONS;
  const canAddMoreServices = activeLocation ? (activeLocation.services?.length || 0) < MAX_SERVICES : true;

  const form = useForm<LocationServiceFormData>({
    resolver: zodResolver(locationServiceSchema),
    defaultValues: {
      city: "",
      state: "",
      heroTitle: "",
      heroImage: "",
      heroDescription: "",
      whyChooseTitle: "",
      whyChooseDescription: "",
      servicesIntro: "",
      servicesDescription: "",
      services: [],
      careDesignedTitle: "",
      careDesignedDescription: "",
      careDesignedImage: "",
      proudlyServingTitle: "",
      proudlyServingDescription: "",
      steadyPartnerTitle: "",
      steadyPartnerDescription: "",
    },
  });

  useEffect(() => {
    replacePageName("Location Services");
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Error fetching location services:", error);
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    if (activeLocation) {
      form.reset({
        city: activeLocation.city || "",
        state: activeLocation.state || "",
        heroTitle: activeLocation.heroTitle || "",
        heroImage: activeLocation.heroImage || "",
        heroDescription: activeLocation.heroDescription || "",
        whyChooseTitle: activeLocation.whyChooseTitle || "",
        whyChooseDescription: activeLocation.whyChooseDescription || "",
        servicesIntro: activeLocation.servicesIntro || "",
        servicesDescription: activeLocation.servicesDescription || "",
        services: activeLocation.services || [],
        careDesignedTitle: activeLocation.careDesignedTitle || "",
        careDesignedDescription: activeLocation.careDesignedDescription || "",
        careDesignedImage: activeLocation.careDesignedImage || "",
        proudlyServingTitle: activeLocation.proudlyServingTitle || "",
        proudlyServingDescription: activeLocation.proudlyServingDescription || "",
        steadyPartnerTitle: activeLocation.steadyPartnerTitle || "",
        steadyPartnerDescription: activeLocation.steadyPartnerDescription || "",
      });
    } else {
      // Reset to defaults
      form.reset({
        city: "",
        state: "",
        heroTitle: "",
        heroImage: "",
        heroDescription: "",
        whyChooseTitle: "",
        whyChooseDescription: "",
        servicesIntro: "",
        servicesDescription: "",
        services: [],
        careDesignedTitle: "",
        careDesignedDescription: "",
        careDesignedImage: "",
        proudlyServingTitle: "",
        proudlyServingDescription: "",
        steadyPartnerTitle: "",
        steadyPartnerDescription: "",
      });
    }
  }, [activeLocation, form]);

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleEdit = (location?: LocationServiceType) => {
    if (location) {
      setActiveLocation(location);
    } else {
      setActiveLocation(null);
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setActiveLocation(null);
    setNewServiceItem({
      id: "",
      title: "",
      items: [""],
      image: "",
    });
  };

  const handleSubmit = (values: LocationServiceFormData) => {
    if (activeLocation) {
      // Update existing - don't include services array in the main update
      const { services, ...updateData } = values;
      updateMutation.mutate(
        { id: activeLocation.id, updateData },
        {
          onSuccess: () => {
            setIsEditing(false);
            setActiveLocation(null);
          },
          onError: (error) => {
            showError(error);
          }
        }
      );
    } else {
      // Check if we can add more locations
      if (!canAddMoreLocations) {
        showError(new Error(`Cannot add more than ${MAX_LOCATIONS} locations`));
        return;
      }
      
      // Create new - include services
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
          setActiveLocation(null);
        },
        onError: (error) => {
          showError(error);
        }
      });
    }
  };

  const handleDelete = () => {
    if (activeLocation) {
      deleteMutation.mutate(activeLocation.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setIsEditing(false);
          setActiveLocation(null);
        },
        onError: (error) => {
          showError(error);
        }
      });
    }
  };

  const handleAddServiceItem = () => {
    if (!activeLocation || !newServiceItem.title.trim() || !newServiceItem.image.trim() || newServiceItem.items.length === 0) {
      showError(new Error("Please fill all service item fields"));
      return;
    }

    // Check if we can add more services
    if (!canAddMoreServices) {
      showError(new Error(`Cannot add more than ${MAX_SERVICES} services to a location`));
      return;
    }

    addServiceItemMutation.mutate(
      { 
        id: activeLocation.id, 
        serviceData: {
          title: newServiceItem.title,
          items: newServiceItem.items.filter(item => item.trim() !== ""),
          image: newServiceItem.image
        }
      },
      {
        onSuccess: () => {
          setNewServiceItem({
            id: "",
            title: "",
            items: [""],
            image: "",
          });
        },
        onError: (error) => {
          showError(error);
        }
      }
    );
  };

  const handleUpdateServiceItem = (serviceId: string, serviceData: Omit<ServiceItem, "id">) => {
    if (!activeLocation) return;

    updateServiceItemMutation.mutate(
      { 
        id: activeLocation.id, 
        serviceId, 
        updateData: {
          title: serviceData.title,
          items: serviceData.items.filter(item => item.trim() !== ""),
          image: serviceData.image
        }
      },
      {
        onSuccess: () => {
          // Service item updated via API, form will be refreshed
        },
        onError: (error) => {
          showError(error);
        }
      }
    );
  };

  const handleDeleteServiceItem = (serviceId: string, serviceTitle: string) => {
    if (!activeLocation) return;
    
    setShowDeleteServiceConfirm({ serviceId, serviceTitle });
  };

  const confirmDeleteServiceItem = () => {
    if (!activeLocation || !showDeleteServiceConfirm) return;
    
    deleteServiceItemMutation.mutate(
      { id: activeLocation.id, serviceId: showDeleteServiceConfirm.serviceId },
      {
        onSuccess: () => {
          setShowDeleteServiceConfirm(null);
        },
        onError: (error) => {
          showError(error);
        }
      }
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddListItem = (serviceIndex: number, newItem: string) => {
    if (!newItem.trim()) return;

    const currentServices = form.getValues("services");
    const updatedServices = [...currentServices];
    
    // Check if we're editing an existing service or adding to new service item
    if (serviceIndex >= 0 && serviceIndex < updatedServices.length) {
      // Existing service - update locally
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        items: [...updatedServices[serviceIndex].items, newItem.trim()]
      };
      form.setValue("services", updatedServices);
      
      // If service has an ID, update via API
      if (updatedServices[serviceIndex].id) {
        handleUpdateServiceItem(updatedServices[serviceIndex].id!, {
          title: updatedServices[serviceIndex].title,
          items: updatedServices[serviceIndex].items.filter(item => item.trim() !== ""),
          image: updatedServices[serviceIndex].image,
        });
      }
    } else {
      // New service item - add to local state
      setNewServiceItem(prev => ({
        ...prev,
        items: [...prev.items.filter(item => item.trim() !== ""), newItem.trim()]
      }));
    }
  };

  const handleRemoveListItem = (serviceIndex: number, itemIndex: number) => {
    const currentServices = form.getValues("services");
    const updatedServices = [...currentServices];
    
    if (serviceIndex >= 0 && serviceIndex < updatedServices.length) {
      // Existing service
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        items: updatedServices[serviceIndex].items.filter((_, i) => i !== itemIndex)
      };
      form.setValue("services", updatedServices);
      
      // If service has an ID, update via API
      if (updatedServices[serviceIndex].id) {
        handleUpdateServiceItem(updatedServices[serviceIndex].id!, updatedServices[serviceIndex]);
      }
    } else {
      // New service item
      setNewServiceItem(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== itemIndex)
      }));
    }
  };

  const handleUpdateServiceTitle = (serviceIndex: number, title: string) => {
    const currentServices = form.getValues("services");
    const updatedServices = [...currentServices];
    
    if (serviceIndex >= 0 && serviceIndex < updatedServices.length) {
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        title
      };
      form.setValue("services", updatedServices);
      
      // If service has an ID, update via API
      if (updatedServices[serviceIndex].id) {
        handleUpdateServiceItem(updatedServices[serviceIndex].id!, updatedServices[serviceIndex]);
      }
    }
  };

  const handleUpdateServiceImage = (serviceIndex: number, image: string) => {
    const currentServices = form.getValues("services");
    const updatedServices = [...currentServices];
    
    if (serviceIndex >= 0 && serviceIndex < updatedServices.length) {
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        image
      };
      form.setValue("services", updatedServices);
      
      // If service has an ID, update via API
      if (updatedServices[serviceIndex].id) {
        handleUpdateServiceItem(updatedServices[serviceIndex].id!, updatedServices[serviceIndex]);
      }
    }
  };

  if (isFetchingLocationServices && !locationServicesData) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <CustomButton
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={isFetchingLocationServices}
            >
              <RefreshIcon className={`w-4 h-4 ${isFetchingLocationServices ? 'animate-spin' : ''}`} />
              Refresh
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
          
          {!isEditing && canAddMoreLocations && (
            <CustomButton
              onClick={() => handleEdit()}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Location
            </CustomButton>
          )}
        </div>
      </div>

      {/* Location Count Alert */}
      {!isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Locations: {locationServices.length}/{MAX_LOCATIONS}
              </span>
            </div>
            {/* {!canAddMoreLocations && (
              <span className="text-sm text-red-600 font-medium">
                Maximum {MAX_LOCATIONS} locations reached
              </span>
            )} */}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isEditing ? (
        // Locations List
        <Card>
          <CardContent className="pt-6">
            {locationServices.length === 0 ? (
              <div className="text-center py-8">
                <MapPinIcon className="w-16 h-16 mx-auto text-white mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Location Services Found
                </h3>
                <p className="text-white mb-6">
                  No location service pages available at the moment.
                </p>
                {canAddMoreLocations && (
                  <CustomButton
                    onClick={() => handleEdit()}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Create Your First Location Service
                  </CustomButton>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {locationServices.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-semibold">
                            {location.city}, {location.state}
                          </h3>
                          {/* <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {location.services?.length || 0} Services
                          </span> */}
                        </div>
                        <div className="text-sm text-white mb-2">
                          <strong>Hero Title:</strong> {location.heroTitle}
                        </div>
                        <p className="text-sm text-white line-clamp-2">
                          {location.heroDescription}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <CustomButton
                          onClick={() => handleEdit(location)}
                          className="flex items-center gap-2"
                        >
                          <EditIcon className="w-4 h-4" />
                          Edit
                        </CustomButton>
                      </div>
                    </div>
                 
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Edit/Create Form
        <Card>
          <CardHeader>
            <CardTitle>
              {activeLocation 
                ? `Edit Location: ${activeLocation.city}, ${activeLocation.state}`
                : "Create New Location"
              }
              {activeLocation && (
                <div className="text-sm font-normal text-gray-600 mt-2">
                  Services: {(activeLocation.services?.length || 0)}/{MAX_SERVICES}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Location Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter city name"
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
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter state name"
                                {...field}
                                readOnly={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Hero Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="heroTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter hero section title"
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
                      name="heroImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Image URL</FormLabel>
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
                                placeholder="https://example.com/hero-image.jpg"
                                {...field}
                                readOnly={!isEditing}
                              />
                              {field.value && (
                                <div className="aspect-video rounded overflow-hidden bg-gray-100 mt-2">
                                  <img
                                    src={field.value}
                                    alt="Hero preview"
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

                    <FormField
                      control={form.control}
                      name="heroDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter hero description"
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

                {/* Why Choose Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whyChooseTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter why choose title"
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
                      name="whyChooseDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter why choose description"
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

                {/* Services Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Services Section
                      {activeLocation && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          ({activeLocation.services?.length || 0}/{MAX_SERVICES})
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="servicesIntro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Introduction Text</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter services introduction"
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
                      name="servicesDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter services description"
                              {...field}
                              className="min-h-[100px] resize-none"
                              readOnly={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Existing Service Items */}
                    <div className="space-y-4">
                      <FormLabel>Service Items</FormLabel>
                      {form.getValues("services").map((service, serviceIndex) => (
                        <Card key={service.id || serviceIndex} className="relative">
                          <CardContent className="pt-6">
                            {isEditing && service.id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteServiceItem(service.id!, service.title)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                disabled={deleteServiceItemMutation.isPending}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                            
                            <div className="space-y-4">
                              <Input
                                placeholder="Service Title"
                                value={service.title}
                                onChange={(e) => handleUpdateServiceTitle(serviceIndex, e.target.value)}
                                readOnly={!isEditing}
                              />

                              <div className="space-y-2">
                                <FormLabel>Service Items</FormLabel>
                                <div className="space-y-2">
                                  {service.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center justify-between gap-2 p-2 border rounded">
                                      <span className="flex-1">{item}</span>
                                      {isEditing && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveListItem(serviceIndex, itemIndex)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <CloseIcon className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
                                {isEditing && (
                                  <div className="flex gap-2 mt-2">
                                    <Input
                                      placeholder="Enter a new service item"
                                      id={`new-item-${serviceIndex}`}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const input = document.getElementById(`new-item-${serviceIndex}`) as HTMLInputElement;
                                          if (input.value.trim()) {
                                            handleAddListItem(serviceIndex, input.value);
                                            input.value = "";
                                          }
                                        }
                                      }}
                                    />
                                    <CustomButton
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`new-item-${serviceIndex}`) as HTMLInputElement;
                                        if (input.value.trim()) {
                                          handleAddListItem(serviceIndex, input.value);
                                          input.value = "";
                                        }
                                      }}
                                    >
                                      Add
                                    </CustomButton>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <FormLabel>Service Image URL</FormLabel>
                                <div className="space-y-2">
                                  {isEditing && (
                                    <ImageUpload
                                      onImageUpload={(url) => handleUpdateServiceImage(serviceIndex, url)}
                                      currentImage={service.image}
                                      disabled={!isEditing}
                                    />
                                  )}
                                  <Input
                                    placeholder="https://example.com/service-image.jpg"
                                    value={service.image}
                                    onChange={(e) => handleUpdateServiceImage(serviceIndex, e.target.value)}
                                    readOnly={!isEditing}
                                  />
                                  {service.image && (
                                    <div className="aspect-square max-w-xs rounded overflow-hidden bg-gray-100 mt-2">
                                      <img
                                        src={service.image}
                                        alt="Service preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Add New Service Item (only when editing an existing location and can add more services) */}
                    {isEditing && activeLocation && canAddMoreServices && (
                      <Card className="border-dashed">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <h4 className="font-medium">Add New Service Item</h4>
                            
                            <Input
                              placeholder="Service Title"
                              value={newServiceItem.title}
                              onChange={(e) => setNewServiceItem(prev => ({ ...prev, title: e.target.value }))}
                            />

                            <div className="space-y-2">
                              <FormLabel>Service Items</FormLabel>
                              <div className="space-y-2">
                                {newServiceItem.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center justify-between gap-2 p-2 border rounded">
                                    <span className="flex-1">{item}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewServiceItem(prev => ({
                                          ...prev,
                                          items: prev.items.filter((_, i) => i !== itemIndex)
                                        }));
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <CloseIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="Enter a new item"
                                  id="new-service-item"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const input = document.getElementById("new-service-item") as HTMLInputElement;
                                      if (input.value.trim()) {
                                        setNewServiceItem(prev => ({
                                          ...prev,
                                          items: [...prev.items.filter(item => item.trim() !== ""), input.value.trim()]
                                        }));
                                        input.value = "";
                                      }
                                    }
                                  }}
                                />
                                <CustomButton
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById("new-service-item") as HTMLInputElement;
                                    if (input.value.trim()) {
                                      setNewServiceItem(prev => ({
                                        ...prev,
                                        items: [...prev.items.filter(item => item.trim() !== ""), input.value.trim()]
                                      }));
                                      input.value = "";
                                    }
                                  }}
                                >
                                  Add
                                </CustomButton>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <FormLabel>Service Image URL</FormLabel>
                              <div className="space-y-2">
                                <ImageUpload
                                  onImageUpload={(url) => setNewServiceItem(prev => ({ ...prev, image: url }))}
                                  currentImage={newServiceItem.image}
                                  disabled={!isEditing}
                                />
                                <Input
                                  placeholder="https://example.com/service-image.jpg"
                                  value={newServiceItem.image}
                                  onChange={(e) => setNewServiceItem(prev => ({ ...prev, image: e.target.value }))}
                                />
                                {newServiceItem.image && (
                                  <div className="aspect-square max-w-xs rounded overflow-hidden bg-gray-100 mt-2">
                                    <img
                                      src={newServiceItem.image}
                                      alt="New service preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <CustomButton
                              type="button"
                              onClick={handleAddServiceItem}
                              className="w-full"
                              disabled={addServiceItemMutation.isPending || !newServiceItem.title.trim() || !newServiceItem.image.trim() || newServiceItem.items.filter(item => item.trim() !== "").length === 0}
                            >
                              {addServiceItemMutation.isPending ? (
                                <LoadingSpinner/>
                              ) : (
                                <PlusIcon className="w-4 h-4 mr-2" />
                              )}
                              Add Service Item
                            </CustomButton>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Cannot add more services message */}
                    {/* {isEditing && activeLocation && !canAddMoreServices && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-800 font-medium">
                            Maximum {MAX_SERVICES} services reached for this location
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          Delete an existing service item to add a new one.
                        </p>
                      </div>
                    )} */}
                  </CardContent>
                </Card>

                {/* Care Designed Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Care Designed Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="careDesignedTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter care designed title"
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
                      name="careDesignedDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter care designed description"
                              {...field}
                              className="min-h-[100px] resize-none"
                              readOnly={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="careDesignedImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
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
                                placeholder="https://example.com/care-designed-image.jpg"
                                {...field}
                                readOnly={!isEditing}
                              />
                              {field.value && (
                                <div className="aspect-video rounded overflow-hidden bg-gray-100 mt-2">
                                  <img
                                    src={field.value}
                                    alt="Care designed preview"
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

                {/* Proudly Serving Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proudly Serving Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="proudlyServingTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter proudly serving title"
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
                      name="proudlyServingDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter proudly serving description"
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

                {/* Steady Partner Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Steady Partner Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="steadyPartnerTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter steady partner title"
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
                      name="steadyPartnerDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter steady partner description"
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

                {/* Action Buttons - Only show when editing */}
                {isEditing && (
                  <div className="flex justify-between items-center pt-6 border-t">
                    <div>
                      {activeLocation && (
                        <CustomButton
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2"
                          style={{ backgroundColor: "#ef4444", color: "white" }}
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete Location
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
                        {activeLocation ? "Update Location" : "Create Location"}
                      </CustomButton>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Delete Location Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Location Service
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the location service for {activeLocation?.city}, {activeLocation?.state}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <CustomButton
                onClick={() => setShowDeleteConfirm(false)}
                style={{ border: "1px solid #d1d5db", backgroundColor: "white", color: "#374151" }}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleDelete}
                style={{ backgroundColor: "#ef4444", color: "white" }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <LoadingSpinner/> : null}
                Delete
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Service Item Confirmation Modal */}
      {showDeleteServiceConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Service Item
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the service item "{showDeleteServiceConfirm.serviceTitle}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <CustomButton
                onClick={() => setShowDeleteServiceConfirm(null)}
                style={{ border: "1px solid #d1d5db", backgroundColor: "white", color: "#374151" }}
                disabled={deleteServiceItemMutation.isPending}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={confirmDeleteServiceItem}
                style={{ backgroundColor: "#ef4444", color: "white" }}
                disabled={deleteServiceItemMutation.isPending}
              >
                {deleteServiceItemMutation.isPending ? <LoadingSpinner /> : null}
                Delete
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationServicesAdmin;