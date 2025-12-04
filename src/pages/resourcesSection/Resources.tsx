import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
  FiPlus as PlusIcon, 
  FiTrash2 as TrashIcon,
  FiTrash2,
  FiExternalLink
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
import { Badge } from "@/components/ui/badge";
import { DeleteDialog } from "@/components/common/CustomDialog";

import {
  useResources,
  useUpdateResources,
  useAddResourceCard,
  useUpdateResourceCard,
  useDeleteResourceCard,
} from "@/store/data/cms/resources/hook";

// Form schemas
const mainSectionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const resourceCardSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  redirectUrl: z.string().url({ message: "Valid URL is required" }),
  badges: z.array(z.string().min(1))
    .min(1, { message: "At least one badge is required" })
    .max(4, { message: "Maximum 4 badges allowed" }), // Add max validation
});

function ResourcesManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<{ index: number; data?:any } | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [badgeInput, setBadgeInput] = useState("");

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useResources();
  const updateResources = useUpdateResources();
  const addResourceCard = useAddResourceCard();
  const updateResourceCard = useUpdateResourceCard();
  const deleteResourceCard = useDeleteResourceCard();

  const resourcesData = data?.data?.resources;

  // Main form for basic sections
  const mainForm = useForm<z.infer<typeof mainSectionSchema>>({
    resolver: zodResolver(mainSectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Form for resource cards
  const cardForm = useForm<z.infer<typeof resourceCardSchema>>({
    resolver: zodResolver(resourceCardSchema),
    defaultValues: {
      title: "",
      description: "",
      redirectUrl: "",
      badges: [],
    },
    mode: "onChange",
  });

  // Reset forms when data is fetched
  useEffect(() => {
    if (resourcesData) {
      mainForm.reset({
        title: resourcesData.title,
        description: resourcesData.description,
      });
    }
  }, [resourcesData, mainForm]);

  // Reset card form when entering add mode
  useEffect(() => {
    if (editingCard?.index === -1) {
      cardForm.reset({
        title: "",
        description: "",
        redirectUrl: "",
        badges: [],
      });
      setBadgeInput("");
    }
  }, [editingCard]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("Resources Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditingCard(null);
      // Reset forms to original data
      if (resourcesData) {
        mainForm.reset({
          title: resourcesData.title,
          description: resourcesData.description,
        });
      }
    }
  };

  const handleMainSectionSubmit = (values: z.infer<typeof mainSectionSchema>) => {
    updateResources.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (error) => {
        showError(error);
      }
    });
  };

  const handleAddBadge = () => {
    if (!badgeInput.trim()) return;

    const currentBadges = cardForm.getValues("badges") || [];
    
    // Check if maximum badges reached
    if (currentBadges.length >= 4) {
      cardForm.setError("badges", {
        type: "manual",
        message: "Maximum 4 badges allowed"
      });
      return;
    }
    
    if (!currentBadges.includes(badgeInput.trim())) {
      cardForm.setValue("badges", [...currentBadges, badgeInput.trim()], {
        shouldValidate: true
      });
      // Clear any previous error if badges are now valid
      if (cardForm.formState.errors.badges) {
        cardForm.clearErrors("badges");
      }
    }
    setBadgeInput("");
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    const currentBadges = cardForm.getValues("badges") || [];
    cardForm.setValue("badges", currentBadges.filter(badge => badge !== badgeToRemove), {
      shouldValidate: true
    });
  };

  const handleCardSubmit = async (values: z.infer<typeof resourceCardSchema>) => {
    const isValid = await cardForm.trigger();
    
    if (!isValid) {
      return;
    }
    
    if (editingCard) {
      if (editingCard.index >= 0) {
        // Update existing card
        const cardId = resourcesData?.resourceCards?.[editingCard.index]?.id;
        
        if (cardId) {
          updateResourceCard.mutate(
            { cardId, cardData: values },
            {
              onSuccess: () => {
                setEditingCard(null);
                cardForm.reset();
              },
              onError: (error) => {
                showError(error);
              }
            }
          );
        }
      } else {
        // Add new card (index === -1)
        addResourceCard.mutate(values, {
          onSuccess: () => {
            setEditingCard(null);
            cardForm.reset();
          },
          onError: (error) => {
            showError(error);
          }
        });
      }
    }
  };

  const handleDeleteCard = () => {
    if (cardToDelete === null || !resourcesData?.resourceCards) return;

    const cardId = resourcesData.resourceCards[cardToDelete]?.id;
    if (cardId) {
      deleteResourceCard.mutate(cardId, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setCardToDelete(null);
        },
        onError: (error) => {
          showError(error);
        }
      });
    }
  };

  const openDeleteConfirm = (index: number) => {
    setCardToDelete(index);
    setOpenDeleteDialog(true);
  };

  const startEditingCard = (index: number, data:any) => {
    setEditingCard({ index, data });
    cardForm.reset({
      title: data.title,
      description: data.description,
      redirectUrl: data.redirectUrl,
      badges: data.badges,
    });
  };

  const cancelCardEditing = () => {
    setEditingCard(null);
    cardForm.reset({
      title: "",
      description: "",
      redirectUrl: "",
      badges: [],
    });
    setBadgeInput("");
  };

  if (isFetching) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end items-center">
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

      {/* Main Section */}
      <Card>
        <CardHeader>
          <CardTitle>Main Section</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...mainForm}>
            <form onSubmit={mainForm.handleSubmit(handleMainSectionSubmit)} className="space-y-6">
              <FormField
                control={mainForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter page title"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={mainForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter page description"
                        {...field}
                        disabled={!isEditing}
                        className="min-h-[120px] resize-none"
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
                    disabled={updateResources.isPending}
                  >
                    {updateResources.isPending ? (
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

      {/* Resource Cards Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resource Cards</CardTitle>
            {isEditing && (
              <CustomButton
                onClick={() => setEditingCard({ index: -1 })}
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Resource Card
              </CustomButton>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Add/Edit Resource Card Form */}
          {editingCard && (
            <Card className="mb-6 border-blue-200">
              <CardContent className="pt-6">
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-6">
                    <FormField
                      control={cardForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter card title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cardForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter card description"
                              {...field}
                              className="min-h-[100px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cardForm.control}
                      name="redirectUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redirect URL</FormLabel>
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

                    <FormItem>
                      <FormLabel>Badges (Max 4)</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter a badge"
                            value={badgeInput}
                            onChange={(e) => setBadgeInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddBadge();
                              }
                            }}
                            disabled={cardForm.watch("badges")?.length >= 4} // Disable input when max reached
                          />
                          <CustomButton
                            type="button"
                            onClick={handleAddBadge}
                            disabled={cardForm.watch("badges")?.length >= 4} // Disable button when max reached
                          >
                            Add
                          </CustomButton>
                        </div>
                        
                        {/* Show badge limit message */}
                        {cardForm.watch("badges")?.length >= 4 && (
                          <div className="text-sm text-amber-600">
                            Maximum 4 badges reached. Remove a badge to add more.
                          </div>
                        )}
                        
                        <FormField
                          control={cardForm.control}
                          name="badges"
                          render={({ field }) => (
                            <>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((badge, index) => (
                                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {badge}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveBadge(badge)}
                                      className="ml-1 hover:text-red-500"
                                    >
                                      <FiTrash2 className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              {!field.value?.length && (
                                <div className="text-sm text-muted-foreground">
                                  Add at least one badge (max 4)
                                </div>
                              )}
                              <FormMessage />
                            </>
                          )}
                        />
                      </div>
                    </FormItem>

                    <div className="flex gap-4 pt-4">
                      <CustomButton
                        type="submit"
                        className="flex items-center gap-2 green-button"
                        disabled={addResourceCard.isPending || updateResourceCard.isPending || cardForm.watch("badges")?.length > 4}
                      >
                        {addResourceCard.isPending || updateResourceCard.isPending ? (
                          <LoadingSpinner />
                        ) : (
                          <SaveIcon className="w-4 h-4" />
                        )}
                        {editingCard.index === -1 ? 'Add Card' : 'Update Card'}
                      </CustomButton>
                      <CustomButton
                        type="button"
                        onClick={cancelCardEditing}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                    
                    {/* Validation summary */}
                    {Object.keys(cardForm.formState.errors).length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800">
                          Please fix the following errors:
                        </p>
                        <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                          {Object.entries(cardForm.formState.errors).map(([field, error]) => (
                            <li key={field}>
                              {field === "badges" ? "Badges" : field}: {error?.message as string}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesData?.resourceCards?.map((card, index) => (
              <Card key={card.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    {isEditing && (
                      <div className="flex gap-1">
                        <CustomButton
                          onClick={() => startEditingCard(index, card)}
                        >
                          Edit
                        </CustomButton>
                        <CustomButton
                          onClick={() => openDeleteConfirm(index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </CustomButton>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-lg text-white mb-4 whitespace-pre-wrap">{card.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <a
                    href={card.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <span>Visit Resource</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setCardToDelete(null);
        }}
        title="Delete Resource Card"
        description="Are you sure you want to delete this resource card? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setCardToDelete(null);
        }}
        onConfirm={handleDeleteCard}
        isDeleting={deleteResourceCard.isPending}
      />
    </div>
  );
}

export default ResourcesManagement;