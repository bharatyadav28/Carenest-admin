import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  FiSave as SaveIcon, 
  FiEdit as EditIcon, 
  FiPlus as PlusIcon, 
  FiTrash2 as TrashIcon,
  FiEye as ViewIcon,
  FiCalendar,
  FiUser,
  // FiSearch,
  FiChevronLeft,
  FiChevronRight,
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
import { DeleteDialog } from "@/components/common/CustomDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/common/RichTextEditor"; // Add this import

import {
  useBlogs,
  useBlog,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/store/data/cms/blog/hook";

// Form schema
const blogSchema = z.object({
  mainImage: z.string().min(1, { message: "Main image is required" }),
  title: z.string().min(1, { message: "Title is required" }).max(255, { message: "Title must be less than 255 characters" }),
  description: z.string().min(1, { message: "Description is required" }),
  authorName: z.string().min(1, { message: "Author name is required" }).max(255, { message: "Author name must be less than 255 characters" }),
  authorProfilePic: z.string().optional().or(z.literal("")),
  blogDate: z.string().min(1, { message: "Blog date is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFilters {
  page: number;
  limit: number;
  sort_by: string;
  order: "asc" | "desc";
  search: string;
}

function BlogManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [viewingBlog, setViewingBlog] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 10,
    sort_by: "createdAt",
    order: "desc",
    search: "",
  });

  const replacePageName = useGeneral((state) => state.replacePageName);

  const { data: blogsData, isFetching: isFetchingBlogs } = useBlogs(filters);
  const { data: blogData } = useBlog(editingBlog || viewingBlog || "");
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const blogs = blogsData?.data?.blogs || [];
  const pagination = blogsData?.data?.pagination;
  const currentBlog = blogData?.data?.blog;

  const blogForm = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      mainImage: "",
      title: "",
      description: "",
      authorName: "",
      authorProfilePic: "",
      blogDate: new Date().toISOString().split('T')[0],
      content: "",
    },
  });

  useEffect(() => {
    replacePageName("Blog Management");
  }, []);

  useEffect(() => {
    if (currentBlog && (editingBlog || viewingBlog)) {
      blogForm.reset({
        mainImage: currentBlog.mainImage,
        title: currentBlog.title,
        description: currentBlog.description,
        authorName: currentBlog.authorName,
        authorProfilePic: currentBlog.authorProfilePic || "",
        blogDate: new Date(currentBlog.blogDate).toISOString().split('T')[0],
        content: currentBlog.content,
      });
    }
  }, [currentBlog, editingBlog, viewingBlog, blogForm]);

  const handleImageUpload = (field: any, url: string) => {
    field.onChange(url);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingBlog(null);
    setViewingBlog(null);
    blogForm.reset({
      mainImage: "",
      title: "",
      description: "",
      authorName: "",
      authorProfilePic: "",
      blogDate: new Date().toISOString().split('T')[0],
      content: "",
    });
  };

  const handleEditBlog = (id: string) => {
    setEditingBlog(id);
    setIsCreating(false);
    setViewingBlog(null);
  };

  const handleViewBlog = (id: string) => {
    setViewingBlog(id);
    setEditingBlog(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingBlog(null);
    setViewingBlog(null);
    blogForm.reset();
  };

  const handleSubmit = (values: BlogFormData) => {
    const submitData = {
      ...values,
      blogDate: new Date(values.blogDate).toISOString(),
    };

    if (editingBlog) {
      updateBlog.mutate(
        { id: editingBlog, updateData: submitData },
        {
          onSuccess: () => {
            setEditingBlog(null);
          },
        }
      );
    } else {
      createBlog.mutate(submitData, {
        onSuccess: () => {
          setIsCreating(false);
          blogForm.reset();
        },
      });
    }
  };

  const handleDeleteBlog = () => {
    if (!blogToDelete) return;

    deleteBlog.mutate(blogToDelete, {
      onSuccess: () => {
        setOpenDeleteDialog(false);
        setBlogToDelete(null);
      },
    });
  };

  const openDeleteConfirm = (id: string) => {
    setBlogToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // const handleSearch = (searchTerm: string) => {
  //   setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  // };

  const handleSortChange = (sort_by: string, order: "asc" | "desc") => {
    setFilters(prev => ({ ...prev, sort_by, order }));
  };

  if (isFetchingBlogs && !blogsData) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-end  items-center">
       
        
        <CustomButton
          onClick={handleCreateNew}
          className="flex items-center gap-2 green-button"
        >
          <PlusIcon className="w-4 h-4" />
          New Blog Post
        </CustomButton>
      </div>

      {/* Blog Form Section */}
      {(isCreating || editingBlog || viewingBlog) && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {viewingBlog ? "View Blog Post" : editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
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
            <Form {...blogForm}>
              <form onSubmit={blogForm.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Image Upload Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Image */}
                  <FormField
                    control={blogForm.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Blog Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <ImageUpload
                              onImageUpload={(url) => handleImageUpload(field, url)}
                              currentImage={field.value}
                              disabled={!!viewingBlog}
                            />
                            {field.value && (
                              <div className="mt-2">
                                <Input
                                  {...field}
                                  readOnly={!!viewingBlog}
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

                  {/* Author Profile Picture */}
                  <FormField
                    control={blogForm.control}
                    name="authorProfilePic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Profile Picture (Optional)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <ImageUpload
                              onImageUpload={(url) => handleImageUpload(field, url)}
                              currentImage={field.value}
                              disabled={!!viewingBlog}
                            />
                            {field.value && (
                              <div className="mt-2">
                                <Input
                                  {...field}
                                  readOnly={!!viewingBlog}
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
                </div>

                {/* Title and Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={blogForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog title"
                            {...field}
                            disabled={!!viewingBlog}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={blogForm.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter author name"
                            {...field}
                            disabled={!!viewingBlog}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Blog Date */}
                <FormField
                  control={blogForm.control}
                  name="blogDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={!!viewingBlog}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={blogForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter blog description"
                          {...field}
                          disabled={!!viewingBlog}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content - Updated to RichTextEditor */}
                <FormField
                  control={blogForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          readOnly={!!viewingBlog}
                          placeholder="Enter blog content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!viewingBlog && (
                  <div className="flex gap-4 pt-4">
                    <CustomButton
                      type="submit"
                      className="flex items-center gap-2 green-button"
                      disabled={createBlog.isPending || updateBlog.isPending}
                    >
                      {(createBlog.isPending || updateBlog.isPending) ? (
                        <LoadingSpinner />
                      ) : (
                        <SaveIcon className="w-4 h-4" />
                      )}
                      {editingBlog ? 'Update Blog' : 'Create Blog'}
                    </CustomButton>
                    <CustomButton
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </CustomButton>
                  </div>
                )}
              </form>
            </Form>

            {viewingBlog && (
              <div className="flex gap-4 pt-4">
                <CustomButton
                  onClick={() => handleEditBlog(viewingBlog)}
                  className="flex items-center gap-2"
                >
                  <EditIcon className="w-4 h-4" />
                  Edit Blog
                </CustomButton>
                <CustomButton
                  onClick={handleCancel}
                >
                  Back to List
                </CustomButton>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blogs List Section */}
      {!isCreating && !editingBlog && !viewingBlog && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Blog Posts ({pagination?.totalItems || 0})</CardTitle>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search blogs..."
                    className="pl-10 w-full sm:w-64"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div> */}
                
                <Select
                  value={`${filters.sort_by}-${filters.order}`}
                  onValueChange={(value) => {
                    const [sort_by, order] = value.split('-') as [string, "asc" | "desc"];
                    handleSortChange(sort_by, order);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="blogDate-desc">Blog Date (Newest)</SelectItem>
                    <SelectItem value="blogDate-asc">Blog Date (Oldest)</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isFetchingBlogs ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filters.search ? 'No blog posts found matching your search.' : 'No blog posts found. Create your first blog post!'}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <Card key={blog.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Blog Image */}
                          <div className="lg:w-48 lg:h-32 flex-shrink-0">
                            <img
                              src={blog.mainImage}
                              alt={blog.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/192/128';
                              }}
                            />
                          </div>
                          
                          {/* Blog Content */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                              <div className="flex gap-2">
                                <CustomButton
                                  onClick={() => handleViewBlog(blog.id)}
                                  className="flex items-center gap-1"
                                >
                                  <ViewIcon className="w-3 h-3" />
                                  View
                                </CustomButton>
                                <CustomButton
                                  onClick={() => handleEditBlog(blog.id)}
                                  className="flex items-center gap-1"
                                >
                                  <EditIcon className="w-3 h-3" />
                                  Edit
                                </CustomButton>
                                <CustomButton
                                  onClick={() => openDeleteConfirm(blog.id)}
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </CustomButton>
                              </div>
                            </div>
                            
                            <p className="text-white mb-3 line-clamp-2">{blog.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white">
                              <div className="flex items-center gap-1">
                                <FiUser className="w-4 h-4" />
                                <span>{blog.authorName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>{new Date(blog.blogDate).toLocaleDateString()}</span>
                              </div>
                          
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
                    <div className="text-sm text-gray-500">
                      Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                      {pagination.totalItems} entries
                    </div>
                    <div className="flex gap-2">
                      <CustomButton
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </CustomButton>
                      <CustomButton
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </CustomButton>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={() => {
          setOpenDeleteDialog(false);
          setBlogToDelete(null);
        }}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        Icon={TrashIcon}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteBlog}
        isDeleting={deleteBlog.isPending}
      />
    </div>
  );
}

export default BlogManagement;