
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save } from 'lucide-react';
import { CustomCategory } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface CustomCategoriesManagerProps {
  categories: CustomCategory[];
  onSaveCategory: (category: CustomCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CustomCategoriesManager: React.FC<CustomCategoriesManagerProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const { toast } = useToast();
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryValues, setCategoryValues] = useState<string[]>([]);

  const form = useForm<CustomCategory>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      type: 'custom',
      values: [],
    },
  });

  const openAddDialog = () => {
    form.reset({
      id: `cat-${Date.now()}`,
      name: '',
      description: '',
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      type: 'custom',
      values: [],
    });
    setCategoryValues([]);
    setIsAddingCategory(true);
  };

  const openEditDialog = (category: CustomCategory) => {
    form.reset(category);
    setCategoryValues(category.values || []);
    setEditingCategory(category);
    setIsAddingCategory(true);
  };

  const handleAddValue = () => {
    if (categoryValue.trim()) {
      const newValues = [...categoryValues, categoryValue.trim()];
      setCategoryValues(newValues);
      form.setValue('values', newValues);
      setCategoryValue('');
    }
  };

  const handleRemoveValue = (value: string) => {
    const newValues = categoryValues.filter(v => v !== value);
    setCategoryValues(newValues);
    form.setValue('values', newValues);
  };

  const onSubmit = (data: CustomCategory) => {
    const updatedCategory = {
      ...data,
      values: categoryValues,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    onSaveCategory(updatedCategory);
    setIsAddingCategory(false);
    
    toast({
      title: editingCategory ? "Category Updated" : "Category Created",
      description: `Successfully ${editingCategory ? 'updated' : 'created'} "${data.name}" category.`,
    });
  };

  const handleCloseDialog = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" category? This may affect existing components.`)) {
      onDeleteCategory(id);
      
      toast({
        title: "Category Deleted",
        description: `The "${name}" category has been removed.`,
        variant: "destructive",
      });
    }
  };

  const getCategoryTypeBadge = (type: string) => {
    switch (type) {
      case 'vesselType':
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Vessel Type</Badge>;
      case 'country':
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Country</Badge>;
      case 'residencyStatus':
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Residency</Badge>;
      case 'tax':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Tax</Badge>;
      default:
        return <Badge variant="outline">Custom</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Categories</h3>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Values</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No custom categories defined yet. Click "Add Category" to create one.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{getCategoryTypeBadge(category.type)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {category.values.slice(0, 3).map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                    {category.values.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.values.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {category.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => openEditDialog(category)}
                    >
                      <span className="sr-only">Edit</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isAddingCategory} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? `Modify the details for ${editingCategory.name}` 
                : 'Create a new custom category to organize your salary components'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ship Register, Country, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain what this category represents" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vesselType">Vessel Type</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="residencyStatus">Residency Status</SelectItem>
                        <SelectItem value="tax">Tax Category</SelectItem>
                        <SelectItem value="custom">Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is this category currently in use?
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Category Values</FormLabel>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter a value" 
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddValue}>Add</Button>
                </div>
                {categoryValues.length > 0 && (
                  <div className="border rounded-md p-3 space-y-2">
                    {categoryValues.map((value) => (
                      <div key={value} className="flex items-center justify-between bg-muted/40 p-2 rounded">
                        <span>{value}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveValue(value)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {categoryValues.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add at least one value for this category.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={categoryValues.length === 0}>
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomCategoriesManager;
