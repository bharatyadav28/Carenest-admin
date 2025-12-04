import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon,
  FiPlus as PlusIcon,
  FiTrash2 as TrashIcon,
  FiX as CloseIcon,
  FiHelpCircle as HelpIcon
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

import {
  useAllFAQs,
  useFAQsByType,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
  useAddFAQItem,
  useUpdateFAQItem,
  useDeleteFAQItem,
} from "@/store/data/cms/faq/hook";

// Form schemas
const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
  answer: z.string().min(1, "Answer is required"),
});

const faqSchema = z.object({
  faqType: z.string().min(1, "FAQ type is required").max(100, "FAQ type must be less than 100 characters"),
  sectionTitle: z.string().max(255, "Section title must be less than 255 characters").optional(),
});

type FAQItemData = z.infer<typeof faqItemSchema>;
type FAQData = z.infer<typeof faqSchema>;

// Function to format FAQ type for display
const formatFAQType = (faqType: string): string => {
  const typeMap: { [key: string]: string } = {
    companionCare: "Companion Care",
    homeCare: "Home Care",
    personalCare: "Personal Care",
    sitter: "Sitter Services",
    specalizedCare: "Specialized Care",
    transportation: "Transportation"
  };
  
  return typeMap[faqType] || faqType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

function FAQManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeFAQType, setActiveFAQType] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; data?: any; faqId?: string } | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<{ id: string; data: any } | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id?: string; itemId?: string; index?: number } | null>(null);
  const [creatingNewFAQ, setCreatingNewFAQ] = useState(false);
  const [newFAQItems, setNewFAQItems] = useState<FAQItemData[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<FAQItemData>({ question: '', answer: '' });

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data: allFAQsData, isFetching: isFetchingAll, error } = useAllFAQs();
  const { data: faqsByTypeData } = useFAQsByType(activeFAQType);
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();
  const addFAQItem = useAddFAQItem();
  const updateFAQItem = useUpdateFAQItem();
  const deleteFAQItem = useDeleteFAQItem();

  const allFAQs = allFAQsData?.data?.faqs || [];
  const currentFAQs = faqsByTypeData?.data?.faqs || [];

  // Get unique FAQ types from API data
  const availableFAQTypes = Array.from(new Set(allFAQs.map(faq => faq.faqType)));

  // Set initial active FAQ type when data loads
  useEffect(() => {
    if (availableFAQTypes.length > 0 && !activeFAQType) {
      setActiveFAQType(availableFAQTypes[0]);
    }
  }, [availableFAQTypes, activeFAQType]);

  // Forms
  const faqForm = useForm<FAQData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      faqType: "",
      sectionTitle: "",
    },
  });

  const faqItemForm = useForm<FAQItemData>({
    resolver: zodResolver(faqItemSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  useEffect(() => {
    replacePageName("FAQ Management");
  }, []);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditingItem(null);
      setEditingFAQ(null);
      setCreatingNewFAQ(false);
      setNewFAQItems([]);
      setIsAddingQuestion(false);
      setNewQuestion({ question: '', answer: '' });
    }
  };

  const handleCreateNewFAQ = () => {
    setCreatingNewFAQ(true);
    setEditingFAQ(null);
    setNewFAQItems([]);
    setIsAddingQuestion(false);
    setNewQuestion({ question: '', answer: '' });
    faqForm.reset({
      faqType: "",
      sectionTitle: "",
    });
  };

  const handleEditFAQ = (faq: any) => {
    setEditingFAQ({ id: faq.id, data: faq });
    setCreatingNewFAQ(false);
    faqForm.reset({
      faqType: faq.faqType,
      sectionTitle: faq.sectionTitle || "",
    });
  };

  const handleCancelCreate = () => {
    setCreatingNewFAQ(false);
    setEditingFAQ(null);
    setNewFAQItems([]);
    setIsAddingQuestion(false);
    setNewQuestion({ question: '', answer: '' });
    faqForm.reset();
  };

  const handleFAQSubmit = (values: FAQData) => {
    if (editingFAQ) {
      // Update existing FAQ
      updateFAQ.mutate({
        id: editingFAQ.id,
        updateData: values,
      }, {
        onSuccess: () => {
          setEditingFAQ(null);
          faqForm.reset();
          // Refresh the active tab if the FAQ type changed
          if (values.faqType !== editingFAQ.data.faqType) {
            setActiveFAQType(values.faqType);
          }
        },
      });
    } else {
      // Create new FAQ with items
      const faqData = {
        ...values,
        faqItems: newFAQItems,
      };

      createFAQ.mutate(faqData, {
        onSuccess: () => {
          setCreatingNewFAQ(false);
          setNewFAQItems([]);
          faqForm.reset();
          setActiveFAQType(values.faqType);
        },
      });
    }
  };

  const handleAddFAQItem = (values: FAQItemData) => {
    if (!editingItem?.faqId) return;

    if (editingItem.index === -1) {
      // Add new item
      addFAQItem.mutate({
        faqId: editingItem.faqId,
        itemData: values,
      }, {
        onSuccess: () => {
          setEditingItem(null);
          faqItemForm.reset();
        },
      });
    } else {
      // Update existing item
      const itemId = currentFAQs
        .find(faq => faq.id === editingItem.faqId)
        ?.faqItems[editingItem.index]?.id;

      if (itemId) {
        updateFAQItem.mutate({
          faqId: editingItem.faqId,
          itemId,
          itemData: values,
        }, {
          onSuccess: () => {
            setEditingItem(null);
            faqItemForm.reset();
          },
        });
      }
    }
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    const { type, id, itemId } = itemToDelete;

    switch (type) {
      case 'faq':
        if (id) {
          deleteFAQ.mutate(id);
        }
        break;
      case 'faqItem':
        if (id && itemId) {
          deleteFAQItem.mutate({
            faqId: id,
            itemId: itemId,
          });
        }
        break;
    }

    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const openDeleteConfirm = (type: string, id?: string, itemId?: string, index?: number) => {
    setItemToDelete({ type, id, itemId, index });
    setOpenDeleteDialog(true);
  };

  const startEditingItem = (faqId: string, index: number, data?: any) => {
    setEditingItem({ type: 'faqItem', index, data, faqId });
    if (data) {
      faqItemForm.reset(data);
    } else {
      faqItemForm.reset({
        question: "",
        answer: "",
      });
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    faqItemForm.reset();
  };

  // Functions for handling new FAQ items
  const handleAddNewQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.answer.trim()) {
      setNewFAQItems([...newFAQItems, { ...newQuestion }]);
      setNewQuestion({ question: '', answer: '' });
      setIsAddingQuestion(false);
    }
  };

  const handleRemoveNewQuestion = (index: number) => {
    setNewFAQItems(newFAQItems.filter((_, i) => i !== index));
  };

  const handleEditNewQuestion = (index: number) => {
    const question = newFAQItems[index];
    setNewQuestion(question);
    setNewFAQItems(newFAQItems.filter((_, i) => i !== index));
  };

  const handleToggleAddingQuestion = () => {
    setIsAddingQuestion(!isAddingQuestion);
    if (!isAddingQuestion) {
      setNewQuestion({ question: '', answer: '' });
    }
  };

  const handleCancelAddingQuestion = () => {
    setIsAddingQuestion(false);
    setNewQuestion({ question: '', answer: '' });
  };

  if (isFetchingAll && !allFAQsData) {
    return <PageLoadingSpinner />;
  }

  const setOpenDialog = setOpenDeleteDialog;

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
              Manage FAQs
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

      {/* FAQ Type Tabs */}
      {availableFAQTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b pb-4">
          {availableFAQTypes.map((faqType) => (
            <button
              key={faqType}
              onClick={() => setActiveFAQType(faqType)}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                activeFAQType === faqType
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {formatFAQType(faqType)}
            </button>
          ))}
        </div>
      )}

      {/* Create New FAQ Section with Questions */}
      {isEditing && creatingNewFAQ && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl">
              Create New FAQ Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...faqForm}>
              <form onSubmit={faqForm.handleSubmit(handleFAQSubmit)} className="space-y-6">
                {/* FAQ Section Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={faqForm.control}
                    name="faqType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FAQ Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., companionCare, homeCare, personalCare"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-white mt-1">
                          Use existing types like: companionCare, homeCare, personalCare, sitter, specalizedCare, transportation
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={faqForm.control}
                    name="sectionTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., What You Need To Know"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Questions Section */}
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      FAQ Questions ({newFAQItems.length})
                    </h3>
                    <CustomButton
                      type="button"
                      onClick={handleToggleAddingQuestion}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      {isAddingQuestion ? 'Cancel Adding Question' : 'Add Question'}
                    </CustomButton>
                  </div>

                  {/* Add Question Form */}
                  {isAddingQuestion && (
                    <Card className="border-green-200">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Question
                            </label>
                            <Input
                              value={newQuestion.question}
                              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                              placeholder="Enter the question"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Answer
                            </label>
                            <Textarea
                              value={newQuestion.answer}
                              onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                              placeholder="Enter the answer"
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <CustomButton
                              type="button"
                              onClick={handleAddNewQuestion}
                              disabled={!newQuestion.question.trim() || !newQuestion.answer.trim()}
                              className="flex items-center gap-2"
                            >
                              <SaveIcon className="w-4 h-4" />
                              Save Question
                            </CustomButton>
                            <CustomButton
                              type="button"
                              onClick={handleCancelAddingQuestion}
                            >
                              Cancel
                            </CustomButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* List of Added Questions */}
                  {newFAQItems.length > 0 && (
                    <div className="space-y-3">
                      {newFAQItems.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-inherit">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium bg-inherit px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <h4 className="font-semibold text-lg">
                                  {item.question}
                                </h4>
                              </div>
                              <p className="text-white mt-2 whitespace-pre-wrap">
                                {item.answer}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <CustomButton
                                type="button"
                                onClick={() => handleEditNewQuestion(index)}
                              >
                                Edit
                              </CustomButton>
                              <CustomButton
                                type="button"
                                onClick={() => handleRemoveNewQuestion(index)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </CustomButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {newFAQItems.length === 0 && !isAddingQuestion && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <HelpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        No questions added yet. Click "Add Question" to start.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={createFAQ.isPending || newFAQItems.length === 0}
                  >
                    {createFAQ.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Create FAQ Section with {newFAQItems.length} Question(s)
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={handleCancelCreate}
                  >
                    Cancel
                  </CustomButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Edit FAQ Section (existing FAQ) */}
      {isEditing && editingFAQ && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>
              Edit FAQ Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...faqForm}>
              <form onSubmit={faqForm.handleSubmit(handleFAQSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={faqForm.control}
                    name="faqType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FAQ Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., companionCare, homeCare, personalCare"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-white mt-1">
                          Use existing types like: companionCare, homeCare, personalCare, sitter, specalizedCare, transportation
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={faqForm.control}
                    name="sectionTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., What You Need To Know"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <CustomButton
                    type="submit"
                    className="flex items-center gap-2 green-button"
                    disabled={updateFAQ.isPending}
                  >
                    {updateFAQ.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Update FAQ Section
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={handleCancelCreate}
                  >
                    Cancel
                  </CustomButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Add FAQ Section Button */}
      {isEditing && !creatingNewFAQ && !editingFAQ && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <CustomButton
                onClick={handleCreateNewFAQ}
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create New FAQ Section
              </CustomButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit FAQ Item Form (for existing FAQs) */}
      {editingItem?.type === 'faqItem' && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>
              {editingItem.index === -1 ? 'Add New FAQ Item' : 'Edit FAQ Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...faqItemForm}>
              <form onSubmit={faqItemForm.handleSubmit(handleAddFAQItem)} className="space-y-6">
                <FormField
                  control={faqItemForm.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the question"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={faqItemForm.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the answer"
                          {...field}
                          className="min-h-[120px]"
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
                    {editingItem.index === -1 ? 'Add FAQ Item' : 'Update FAQ Item'}
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

      {/* Current FAQs List */}
      <div className="space-y-6">
        {!activeFAQType ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <HelpIcon className="w-16 h-16 mx-auto text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No FAQ Types Available
                </h3>
                <p className="text-white">
                  No FAQ data found. {isEditing && "Create a new FAQ section to get started."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : currentFAQs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <HelpIcon className="w-16 h-16 mx-auto text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No FAQs Found
                </h3>
                <p className="text-white">
                  No {formatFAQType(activeFAQType)} FAQs available. {isEditing && "Create a new FAQ section to get started."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          currentFAQs.map((faq) => (
            <Card key={faq.id} className="border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">
                      {faq.sectionTitle || `${formatFAQType(faq.faqType)} FAQs`}
                    </CardTitle>
                    <p className="text-white text-sm mt-1">
                      {faq.faqItems?.length || 0} question(s)
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <CustomButton
                        onClick={() => handleEditFAQ(faq)}
                      >
                        Edit Section
                      </CustomButton>
                      <CustomButton
                        onClick={() => startEditingItem(faq.id, -1)}
                        className="flex items-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Question
                      </CustomButton>
                      <CustomButton
                        onClick={() => openDeleteConfirm('faq', faq.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </CustomButton>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Questions are now always visible */}
                <div className="space-y-4">
                  {faq.faqItems && faq.faqItems.length > 0 ? (
                    faq.faqItems.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-white">
                              {item.question}
                            </h4>
                            <p className="text-white mt-2 whitespace-pre-wrap">
                              {item.answer}
                            </p>
                          </div>
                          {isEditing && (
                            <div className="flex gap-2 ml-4">
                              <CustomButton
                                onClick={() => startEditingItem(faq.id, index, item)}
                              >
                                Edit
                              </CustomButton>
                              <CustomButton
                                onClick={() => openDeleteConfirm('faqItem', faq.id, item.id, index)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </CustomButton>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <HelpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        No questions in this FAQ section yet.
                        {isEditing && " Click 'Add Question' to add some."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
        }}
        title={itemToDelete?.type === 'faq' ? "Delete FAQ Section" : "Delete FAQ Item"}
        description={
          itemToDelete?.type === 'faq' 
            ? "Are you sure you want to delete this FAQ section? This will remove all questions in this section. This action cannot be undone."
            : "Are you sure you want to delete this FAQ item? This action cannot be undone."
        }
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteItem}
        isDeleting={deleteFAQ.isPending || deleteFAQItem.isPending}
      />
    </div>
  );
}

export default FAQManagement;