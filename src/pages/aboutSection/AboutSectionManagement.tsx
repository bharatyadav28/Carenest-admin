import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
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
import { CustomButton } from "@/components/common/CustomInputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "@/components/common/CustomDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import RichTextEditor from "@/components/common/RichTextEditor";

import {
  useAboutUs,
  useUpdateAboutUs,
  useUpdateKeyPeople,
  useUpdateTeamMembers,
  useUpdateOurValues,
} from "@/store/data/cms/aboutus/hook";

// Add the missing type definitions
type KeyPersonType = {
  id: string;
  personName: string;
  personTitle: string;
  personImage: string;
  personDescription: string;
};

type ValueType = {
  id: string;
  valueName: string;
  valueDescription: string;
};

type TeamMemberType = {
  id: string;
  name: string;
  role: string;
  image: string;
};

// Form schemas for different sections
const mainSectionSchema = z.object({
  mainHeading: z.string().min(1, { message: "Main heading is required" }),
  mainDescription: z.string().min(1, { message: "Main description is required" }),
});

const valuesSectionSchema = z.object({
  valuesHeading: z.string().min(1, { message: "Values heading is required" }),
});

const missionSectionSchema = z.object({
  missionDescription: z.string().min(1, { message: "Mission description is required" }),
});

const teamSectionSchema = z.object({
  meetTeamHeading: z.string().min(1, { message: "Team heading is required" }),
  meetTeamDescription: z.string().min(1, { message: "Team description is required" }),
});

// Individual item schemas
const keyPersonSchema = z.object({
  personName: z.string().min(1, { message: "Name is required" }),
  personTitle: z.string().min(1, { message: "Title is required" }),
  personImage: z.string().min(1, { message: "Image is required" }),
  personDescription: z.string().min(1, { message: "Description is required" }),
});

const valueSchema = z.object({
  valueName: z.string().min(1, { message: "Value name is required" }),
  valueDescription: z.string().min(1, { message: "Value description is required" }),
});

const teamMemberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  image: z.string().min(1, { message: "Image is required" }),
});

function AboutSectionManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("main");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; data?: any } | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; index: number } | null>(null);

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data, isFetching, error } = useAboutUs();
  const updateAboutUs = useUpdateAboutUs();
  const updateKeyPeople = useUpdateKeyPeople();
  const updateTeamMembers = useUpdateTeamMembers();
  const updateOurValues = useUpdateOurValues();

  const aboutData = data?.data?.aboutUs;

  // Main form for basic sections
  const mainForm = useForm<z.infer<typeof mainSectionSchema>>({
    resolver: zodResolver(mainSectionSchema),
    defaultValues: {
      mainHeading: "",
      mainDescription: "",
    },
  });

  const valuesForm = useForm<z.infer<typeof valuesSectionSchema>>({
    resolver: zodResolver(valuesSectionSchema),
    defaultValues: {
      valuesHeading: "",
    },
  });

  const missionForm = useForm<z.infer<typeof missionSectionSchema>>({
    resolver: zodResolver(missionSectionSchema),
    defaultValues: {
      missionDescription: "",
    },
  });

  const teamForm = useForm<z.infer<typeof teamSectionSchema>>({
    resolver: zodResolver(teamSectionSchema),
    defaultValues: {
      meetTeamHeading: "",
      meetTeamDescription: "",
    },
  });

  // Forms for individual items
  const keyPersonForm = useForm<z.infer<typeof keyPersonSchema>>({
    resolver: zodResolver(keyPersonSchema),
    defaultValues: {
      personName: "",
      personTitle: "",
      personImage: "",
      personDescription: "",
    },
  });

  const valueForm = useForm<z.infer<typeof valueSchema>>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      valueName: "",
      valueDescription: "",
    },
  });

  const teamMemberForm = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      image: "",
    },
  });

  // Reset forms when data is fetched
  useEffect(() => {
    if (aboutData) {
      mainForm.reset({
        mainHeading: aboutData.mainHeading,
        mainDescription: aboutData.mainDescription,
      });
      valuesForm.reset({
        valuesHeading: aboutData.valuesHeading,
      });
      missionForm.reset({
        missionDescription: aboutData.missionDescription,
      });
      teamForm.reset({
        meetTeamHeading: aboutData.meetTeamHeading,
        meetTeamDescription: aboutData.meetTeamDescription,
      });
    }
  }, [aboutData, mainForm, valuesForm, missionForm, teamForm]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    replacePageName("About Section Management");
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditingItem(null);
      // Reset forms to original data
      if (aboutData) {
        mainForm.reset({
          mainHeading: aboutData.mainHeading,
          mainDescription: aboutData.mainDescription,
        });
        valuesForm.reset({
          valuesHeading: aboutData.valuesHeading,
        });
        missionForm.reset({
          missionDescription: aboutData.missionDescription,
        });
        teamForm.reset({
          meetTeamHeading: aboutData.meetTeamHeading,
          meetTeamDescription: aboutData.meetTeamDescription,
        });
      }
    }
  };

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleSectionSubmit = {
    main: (values: z.infer<typeof mainSectionSchema>) => {
      updateAboutUs.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
    values: (values: z.infer<typeof valuesSectionSchema>) => {
      updateAboutUs.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
    mission: (values: z.infer<typeof missionSectionSchema>) => {
      updateAboutUs.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
    team: (values: z.infer<typeof teamSectionSchema>) => {
      updateAboutUs.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
  };

  const handleAddItem = {
    keyPerson: (values: z.infer<typeof keyPersonSchema>) => {
      const newPerson: KeyPersonType = {
        id: `temp-${Date.now()}`,
        ...values,
      };
      const updatedPeople = [...(aboutData?.keyPeople || []), newPerson];
      updateKeyPeople.mutate(updatedPeople, {
        onSuccess: () => {
          setEditingItem(null);
          keyPersonForm.reset();
        },
      });
    },
    value: (values: z.infer<typeof valueSchema>) => {
      const newValue: ValueType = {
        id: `temp-${Date.now()}`,
        ...values,
      };
      const updatedValues = [...(aboutData?.ourValues || []), newValue];
      updateOurValues.mutate(updatedValues, {
        onSuccess: () => {
          setEditingItem(null);
          valueForm.reset();
        },
      });
    },
    teamMember: (values: z.infer<typeof teamMemberSchema>) => {
      const newMember: TeamMemberType = {
        id: `temp-${Date.now()}`,
        ...values,
      };
      const updatedMembers = [...(aboutData?.teamMembers || []), newMember];
      updateTeamMembers.mutate(updatedMembers, {
        onSuccess: () => {
          setEditingItem(null);
          teamMemberForm.reset();
        },
      });
    },
  };

  const handleEditItem = {
    keyPerson: (values: z.infer<typeof keyPersonSchema>) => {
      if (!editingItem || !aboutData?.keyPeople) return;
      
      const updatedPeople = [...aboutData.keyPeople];
      updatedPeople[editingItem.index] = {
        ...updatedPeople[editingItem.index],
        ...values,
      };
      updateKeyPeople.mutate(updatedPeople, {
        onSuccess: () => {
          setEditingItem(null);
          keyPersonForm.reset();
        },
      });
    },
    value: (values: z.infer<typeof valueSchema>) => {
      if (!editingItem || !aboutData?.ourValues) return;
      
      const updatedValues = [...aboutData.ourValues];
      updatedValues[editingItem.index] = {
        ...updatedValues[editingItem.index],
        ...values,
      };
      updateOurValues.mutate(updatedValues, {
        onSuccess: () => {
          setEditingItem(null);
          valueForm.reset();
        },
      });
    },
    teamMember: (values: z.infer<typeof teamMemberSchema>) => {
      if (!editingItem || !aboutData?.teamMembers) return;
      
      const updatedMembers = [...aboutData.teamMembers];
      updatedMembers[editingItem.index] = {
        ...updatedMembers[editingItem.index],
        ...values,
      };
      updateTeamMembers.mutate(updatedMembers, {
        onSuccess: () => {
          setEditingItem(null);
          teamMemberForm.reset();
        },
      });
    },
  };

  const handleDeleteItem = () => {
    if (!itemToDelete || !aboutData) return;

    const { type, index } = itemToDelete;

    switch (type) {
      case 'keyPerson':
        const updatedPeople = aboutData.keyPeople?.filter((_, i) => i !== index) || [];
        updateKeyPeople.mutate(updatedPeople);
        break;
      case 'value':
        const updatedValues = aboutData.ourValues?.filter((_, i) => i !== index) || [];
        updateOurValues.mutate(updatedValues);
        break;
      case 'teamMember':
        const updatedMembers = aboutData.teamMembers?.filter((_, i) => i !== index) || [];
        updateTeamMembers.mutate(updatedMembers);
        break;
    }

    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const openDeleteConfirm = (type: string, index: number) => {
    setItemToDelete({ type, index });
    setOpenDeleteDialog(true);
  };

  const startEditingItem = (type: string, index: number, data: any) => {
    setEditingItem({ type, index, data });
    switch (type) {
      case 'keyPerson':
        keyPersonForm.reset(data);
        break;
      case 'value':
        valueForm.reset(data);
        break;
      case 'teamMember':
        teamMemberForm.reset(data);
        break;
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    keyPersonForm.reset();
    valueForm.reset();
    teamMemberForm.reset();
  };

  if (isFetching) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6 min-h-screen">
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

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {['main', 'keyPeople', 'values', 'mission', 'team'].map((section) => (
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
            {section === 'keyPeople' && 'Key People'}
            {section === 'values' && 'Our Values'}
            {section === 'mission' && 'Our Mission'}
            {section === 'team' && 'Our Team'}
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
              <form onSubmit={mainForm.handleSubmit(handleSectionSubmit.main)} className="space-y-6">
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
                          disabled={!isEditing}
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
                      disabled={updateAboutUs.isPending}
                    >
                      {updateAboutUs.isPending ? (
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

      {/* Key People Section */}
      {activeSection === 'keyPeople' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Key People</CardTitle>
              {isEditing && (
                <CustomButton
                  onClick={() => setEditingItem({ type: 'keyPerson', index: -1 })}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Key Person
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add/Edit Key Person Form */}
            {editingItem?.type === 'keyPerson' && (
              <Card className="mb-6 border-blue-200 ">
                <CardContent className="pt-6">
                  <Form {...keyPersonForm}>
                    <form onSubmit={keyPersonForm.handleSubmit(
                      editingItem.index === -1 ? handleAddItem.keyPerson : handleEditItem.keyPerson
                    )} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={keyPersonForm.control}
                          name="personName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter person name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={keyPersonForm.control}
                          name="personTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter person title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={keyPersonForm.control}
                        name="personImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image</FormLabel>
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
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={keyPersonForm.control}
                        name="personDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                className="min-h-[200px]"
                                readOnly={!isEditing}
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
                          {editingItem.index === -1 ? 'Add Person' : 'Update Person'}
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

            {/* Key People List */}
            <div className="space-y-6">
              {aboutData?.keyPeople?.map((person, index) => (
                <Card key={person.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{person.personName}</h3>
                        <p className="text-xl text-gray-600">{person.personTitle}</p>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => startEditingItem('keyPerson', index, person)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => openDeleteConfirm('keyPerson', index)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </CustomButton>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={person.personImage}
                          
                          alt={person.personName}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div 
                          className="text-lg prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: person.personDescription }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Our Values Section */}
      {activeSection === 'values' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Our Values</CardTitle>
              {/* {isEditing && (
                <CustomButton
                  onClick={() => setEditingItem({ type: 'value', index: -1 })}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Value
                </CustomButton>
              )} */}
            </div>
          </CardHeader>
          <CardContent>
            {/* Values Heading Form */}
            <Form {...valuesForm}>
              <form onSubmit={valuesForm.handleSubmit(handleSectionSubmit.values)} className="space-y-6 mb-8">
                <FormField
                  control={valuesForm.control}
                  name="valuesHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Values Section Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter values heading"
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
                    disabled={updateAboutUs.isPending}
                  >
                    {updateAboutUs.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Save Heading
                  </CustomButton>
                )}
              </form>
            </Form>

            {/* Add/Edit Value Form */}
            {editingItem?.type === 'value' && (
              <Card className="mb-6 border-green-200 ">
                <CardContent className="pt-6">
                  <Form {...valueForm}>
                    <form onSubmit={valueForm.handleSubmit(
                      editingItem.index === -1 ? handleAddItem.value : handleEditItem.value
                    )} className="space-y-6">
                      <FormField
                        control={valueForm.control}
                        name="valueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter value name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={valueForm.control}
                        name="valueDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value Description</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter value description"
                              
                                readOnly={!isEditing}
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
                          {editingItem.index === -1 ? 'Add Value' : 'Update Value'}
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

            {/* Values List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutData?.ourValues?.map((value, index) => (
                <Card key={value.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold">{value.valueName}</h3>
                      {isEditing && (
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => startEditingItem('value', index, value)}
                          >
                            Edit
                          </CustomButton>
                          {/* <CustomButton
                            onClick={() => openDeleteConfirm('value', index)}
                            variant="destructive"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </CustomButton> */}
                        </div>
                      )}
                    </div>
                    <div 
                      className="text-lg text-white prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: value.valueDescription }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mission Section */}
      {activeSection === 'mission' && (
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...missionForm}>
              <form onSubmit={missionForm.handleSubmit(handleSectionSubmit.mission)} className="space-y-6">
                <FormField
                  control={missionForm.control}
                  name="missionDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Description</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter mission description"
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
                      disabled={updateAboutUs.isPending}
                    >
                      {updateAboutUs.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      Save Mission
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Our Team</CardTitle>
              {isEditing && (
                <CustomButton
                  onClick={() => setEditingItem({ type: 'teamMember', index: -1 })}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Team Member
                </CustomButton>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Team Section Heading and Description */}
            <Form {...teamForm}>
              <form onSubmit={teamForm.handleSubmit(handleSectionSubmit.team)} className="space-y-6 mb-8">
                <FormField
                  control={teamForm.control}
                  name="meetTeamHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Section Heading</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter team heading"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={teamForm.control}
                  name="meetTeamDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          readOnly={!isEditing}
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
                    disabled={updateAboutUs.isPending}
                  >
                    {updateAboutUs.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    Save Team Section
                  </CustomButton>
                )}
              </form>
            </Form>

            {/* Add/Edit Team Member Form */}
            {editingItem?.type === 'teamMember' && (
              <Card className="mb-6 border-purple-200 ">
                <CardContent className="pt-6">
                  <Form {...teamMemberForm}>
                    <form onSubmit={teamMemberForm.handleSubmit(
                      editingItem.index === -1 ? handleAddItem.teamMember : handleEditItem.teamMember
                    )} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={teamMemberForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter team member name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={teamMemberForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter team member role"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={teamMemberForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image</FormLabel>
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
                          {editingItem.index === -1 ? 'Add Team Member' : 'Update Team Member'}
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

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData?.teamMembers?.map((member, index) => (
                <Card key={member.id} className="border text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-xl text-gray-600 mb-4">{member.role}</p>
                    {isEditing && (
                      <div className="flex gap-2 justify-center">
                        <CustomButton
                          onClick={() => startEditingItem('teamMember', index, member)}
                        >
                          Edit
                        </CustomButton>
                        <CustomButton
                          onClick={() => openDeleteConfirm('teamMember', index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </CustomButton>
                      </div>
                    )}
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
        isDeleting={updateKeyPeople.isPending || updateOurValues.isPending || updateTeamMembers.isPending}
      />
    </div>
  );
}

export default AboutSectionManagement;