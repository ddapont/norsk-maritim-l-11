
import React from 'react';
import { Employee } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  employeeToDelete: Employee | null;
  handleDeleteConfirm: () => void;
}

const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({
  isOpen,
  setIsOpen,
  employeeToDelete,
  handleDeleteConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center rounded-md bg-amber-50 border border-amber-200 p-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
          <span className="text-sm text-amber-700">
            All payroll data for this employee will be inaccessible after deletion.
          </span>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;
