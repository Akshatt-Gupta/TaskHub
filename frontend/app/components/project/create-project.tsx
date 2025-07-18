import { ProjectStatus, type MemberProps } from "@/type";
import { projectSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import { Checkbox } from "../ui/checkbox";
import {
    DialogContent,
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormMessage,
    FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseCreateProject } from "@/hooks/use-project";
import { toast } from "sonner";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({
    isOpen,
    onOpenChange,
    workspaceId,
    workspaceMembers,
}: CreateProjectDialogProps) => {
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: "", 
        },
    });

    const { mutate, isPending } = UseCreateProject();

    const onSubmit = (values: CreateProjectFormData) => {
        console.log("Form submitted with values:", values); // Debug log
        
        if (!workspaceId) {
            toast.error("Workspace ID is required");
            return;
        }

        mutate({
            projectData: values,
            workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Project Added Successfully");
                form.reset();
                onOpenChange(false);
            },
            onError: (error: any) => {
                console.error("Project creation error:", error); // Better error logging
                const errorMessage = error?.response?.data?.message || 
                                        error?.message || 
                                        "An error occurred while creating the project";
                toast.error(errorMessage);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new Project to get started
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Project Title" />
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
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Project Description"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={
                                                            "w-full justify-start text-left font-normal " +
                                                            (!field.value ? "text-muted-foreground" : "")
                                                        }
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date ? date.toISOString() : "");
                                                        }}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={
                                                            "w-full justify-start text-left font-normal " +
                                                            (!field.value ? "text-muted-foreground" : "")
                                                        }
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date ? date.toISOString() : "");
                                                        }}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Tags separated by commas" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                                const selectedMembers = field.value || [];
                                return (
                                    <FormItem>
                                        <FormLabel>Members</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal min-h-11">
                                                        {selectedMembers.length === 0 ? (
                                                            <span className="text-muted-foreground">Select Members</span>
                                                        ) : selectedMembers.length <= 2 ? (
                                                            selectedMembers.map((m) => {
                                                                const member = workspaceMembers.find((wm) => wm.user._id === m.user);
                                                                return `${member?.user.name} (${member?.role})`;
                                                            }).join(", ")
                                                        ) : (
                                                            `${selectedMembers.length} members selected`
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full max-w-60 overflow-y-auto" align="start">
                                                    <div className="flex flex-col gap-2 ">
                                                        {workspaceMembers.map((member) => {
                                                            const selectedMember = selectedMembers.find((m) => m.user === member.user._id);
                                                            return (
                                                                <div key={member._id} className="flex items-center gap-2 p-2 border rounded">
                                                                    <Checkbox
                                                                        checked={!!selectedMember}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([
                                                                                    ...selectedMembers,
                                                                                    { user: member.user._id, role: "contributor" }
                                                                                ]);
                                                                            } else {
                                                                                field.onChange(
                                                                                    selectedMembers.filter((m) => m.user !== member.user._id)
                                                                                );
                                                                            }
                                                                        }}
                                                                        id={`member-${member.user._id}`}
                                                                    />
                                                                    <span className="truncate flex-1">
                                                                        {member.user.name}
                                                                    </span>
                                                                    {selectedMember && (
                                                                        <Select
                                                                            value={selectedMember.role}
                                                                            onValueChange={(role) => {
                                                                                field.onChange(
                                                                                    selectedMembers.map((m) =>
                                                                                        m.user === member.user._id
                                                                                            ? { ...m, role: role as "contributor" | "manager" | "viewer" }
                                                                                            : m
                                                                                    )
                                                                                );
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Role" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="manager">
                                                                                    Manager
                                                                                </SelectItem>
                                                                                <SelectItem value="contributor">
                                                                                    Contributor
                                                                                </SelectItem>
                                                                                <SelectItem value="viewer">
                                                                                    Viewer
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Project"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};