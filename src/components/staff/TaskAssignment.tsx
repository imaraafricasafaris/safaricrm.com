import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Staff } from "../../types/staff";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { 
  dialogContentStyles, 
  dialogHeaderStyles, 
  dialogTitleStyles,
  dialogFooterStyles
} from '../ui/dialog-styles';

interface TaskAssignmentProps {
  staff: Staff;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  due_date: Date;
  type: string;
}

export function TaskAssignment({ staff, isOpen, onClose }: TaskAssignmentProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      due_date: new Date(),
      type: 'general'
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Here you would typically make an API call to save the task
      console.log('Assigning task:', data, 'to staff:', staff.id);
      toast.success('Task assigned successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to assign task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(dialogContentStyles, "max-w-[600px]")}>
        <DialogHeader className={dialogHeaderStyles}>
          <DialogTitle className={dialogTitleStyles}>
            Assign Task to {staff.first_name} {staff.last_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    placeholder="Enter task title"
                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500 animate-slideDown">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter task description"
                    className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500 animate-slideDown">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Task Type</Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Task type is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="safari">Safari Related</SelectItem>
                        <SelectItem value="client">Client Related</SelectItem>
                        <SelectItem value="admin">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Controller
                name="due_date"
                control={control}
                rules={{ required: 'Due date is required' }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="rounded-md border shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <DialogFooter className={dialogFooterStyles}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary text-white transition-all duration-200 hover:bg-primary/90"
            >
              Assign Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
