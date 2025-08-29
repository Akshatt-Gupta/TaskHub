import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { workspaceSchema } from "@/lib/schema";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,DialogFooter } from "../ui/dialog";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {cn} from "@/lib/utils";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreating: boolean) => void;
}

export const colorOptions = [
  "FF5733",
  "33C1FF", 
  "28A745",
  "FFC300",
  "8E44AD",
  "E67E22",
  "2ECC71",
  "34495E"
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });
  const {mutate,isPending} = useCreateWorkspace();
  const navigate = useNavigate();
  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data:any) => {
        form.reset();
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully!");
        
        navigate(`/workspaces/${data._id}`);
      },
      onError: (error:any) => {
        const errorMessage = error.response?.data?.message || "Failed to create workspace.";
        if (errorMessage) {
          toast.error(errorMessage);
        }
        console.error("Error creating workspace:", error);
      },
    });
  };

  return (
    <Dialog
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      modal={true}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Workspace Name" />
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
                      <Textarea {...field} placeholder="Workspace Description" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-3 flex-wrap">
                        {colorOptions.map((color) => (
                          <Button
                            key={color}
                            type="button"  
                            variant="outline"
                            className={cn(
                              "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                              field.value === color && "ring-2 ring-offset-2 ring-blue-500"
                            )}
                            style={{ backgroundColor: `#${color}` }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;