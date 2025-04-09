
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { VESSEL_TYPES, RESIDENCY_STATUSES, COMMON_TAGS } from './EmployeeEditDialog';
import { Employee } from '@/types/types';

const TagsClassificationsTab = () => {
  const [customTag, setCustomTag] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>(COMMON_TAGS);
  const form = useFormContext<Employee>();

  const handleAddTag = () => {
    if (customTag && !form.getValues().tags.includes(customTag)) {
      const currentTags = form.getValues().tags || [];
      form.setValue('tags', [...currentTags, customTag]);
      
      // Add to available tags if not already there
      if (!availableTags.includes(customTag)) {
        setAvailableTags([...availableTags, customTag]);
      }
      
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handleSelectTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="vesselType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VESSEL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Type of vessel the employee works on
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="residencyStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residency Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select residency status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RESIDENCY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Tax residency status
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <FormLabel>Employee Tags</FormLabel>
        <FormDescription>
          Add tags to categorize this employee
        </FormDescription>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {form.watch('tags')?.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 items-center">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add custom tag"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <FormLabel>Common Tags</FormLabel>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge 
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => handleSelectTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsClassificationsTab;
