
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProgressiveTaxBracket } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  threshold: z.coerce.number(),
  rate: z.coerce.number().min(0).max(100),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  applicableToResidents: z.boolean(),
  applicableToNonResidents: z.boolean(),
});

type TaxBracketFormValues = z.infer<typeof formSchema>;

interface TaxBracketEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxBracket: ProgressiveTaxBracket | null;
  onSave: (bracket: ProgressiveTaxBracket) => void;
}

const TaxBracketEditDialog: React.FC<TaxBracketEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  taxBracket, 
  onSave,
}) => {
  const form = useForm<TaxBracketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: taxBracket ? {
      threshold: taxBracket.threshold,
      rate: taxBracket.rate,
      description: taxBracket.description,
      applicableToResidents: taxBracket.applicableToResidents,
      applicableToNonResidents: taxBracket.applicableToNonResidents,
    } : {
      threshold: 0,
      rate: 0,
      description: '',
      applicableToResidents: true,
      applicableToNonResidents: false,
    }
  });

  const onSubmit = (values: TaxBracketFormValues) => {
    if (taxBracket) {
      onSave({
        ...taxBracket,
        ...values,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {taxBracket ? 'Edit Tax Bracket' : 'Add New Tax Bracket'}
            <Button size="icon" variant="ghost" className="h-5 w-5" asChild>
              <a href="https://www.skatteetaten.no/en/rates/tax-rates-2023/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </DialogTitle>
          <DialogDescription>
            {taxBracket ? 'Update the progressive tax bracket details' : 'Create a new progressive tax bracket'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income Threshold (NOK)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Income amount where this bracket starts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Percentage rate applied to income in this bracket
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicableToResidents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Applicable to Residents</FormLabel>
                      <FormDescription>
                        Tax residents of Norway
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicableToNonResidents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Applicable to Non-Residents</FormLabel>
                      <FormDescription>
                        Non-tax residents of Norway
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBracketEditDialog;
