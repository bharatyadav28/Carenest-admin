import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FiSave as SaveIcon,
  FiEdit as EditIcon,
  FiX as CloseIcon
} from "react-icons/fi";

import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";

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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import TextEditor from "@/components/common/RichTextEditor";

import {
  usePolicy,
  useCreateOrUpdatePolicy,
  type PolicyTypeEnum,
} from "@/store/data/cms/policies/hook";

// Schema
const policySchema = z.object({
  type: z.enum(["privacy", "terms", "legal"]),
  content: z.string().min(1, { message: "Policy content is required" }),
});

type PolicyFormData = z.infer<typeof policySchema>;

function PolicyManagement() {
  const location = useLocation();

  // Detect policy from route
  const getPolicyFromRoute = (): PolicyTypeEnum => {
    if (location.pathname.includes("privacy")) return "privacy";
    if (location.pathname.includes("terms")) return "terms";
    return "legal";
  };

  const activePolicyType = getPolicyFromRoute();

  const [isEditing, setIsEditing] = useState(false);

  const { data: policyData, isFetching: isFetchingPolicy } = usePolicy(activePolicyType);
  const createOrUpdatePolicy = useCreateOrUpdatePolicy();

  const currentPolicy = policyData?.data?.policy;

  const policyForm = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      type: activePolicyType,
      content: "",
    },
  });

  // Load data into form
  useEffect(() => {
    if (currentPolicy) {
      policyForm.reset({
        type: currentPolicy.type,
        content: currentPolicy.content,
      });
    } else {
      policyForm.reset({
        type: activePolicyType,
        content: "",
      });
    }
  }, [currentPolicy, activePolicyType]);

  const handleCancel = () => {
    setIsEditing(false);

    if (currentPolicy) {
      policyForm.reset({
        type: currentPolicy.type,
        content: currentPolicy.content,
      });
    }
  };

  const handleSubmit = (values: PolicyFormData) => {
    createOrUpdatePolicy.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const pageTitleMap = {
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    legal: "Legal Information",
  };

  if (isFetchingPolicy && !policyData) return <PageLoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
 

      {/* Policy Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* <CardTitle>{pageTitleMap[activePolicyType]}</CardTitle> */}

            </div>

            {!isEditing && (
              <CustomButton onClick={() => setIsEditing(true)}>
                <EditIcon className="w-4 h-4" /> Edit
              </CustomButton>
            )}

            {isEditing && (
              <CustomButton onClick={handleCancel} >
                <CloseIcon className="w-4 h-4" /> Cancel
              </CustomButton>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Form {...policyForm}>
            <form onSubmit={policyForm.handleSubmit(handleSubmit)} className="space-y-6">

              {/* Hidden Type */}
              <FormField
                control={policyForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Editor */}
              <FormField
                control={policyForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Content</FormLabel>
                    <FormControl>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        readOnly={!isEditing}
                        placeholder={`Write your ${pageTitleMap[activePolicyType].toLowerCase()} here...`}
                        className="min-h-[400px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              {isEditing && (
                <CustomButton
                  type="submit"
                  className="flex items-center gap-2 green-button"
                  disabled={createOrUpdatePolicy.isPending}
                >
                  {createOrUpdatePolicy.isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <SaveIcon className="w-4 h-4" />
                  )}
                  Save
                </CustomButton>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PolicyManagement;
