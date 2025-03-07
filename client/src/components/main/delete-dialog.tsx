import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDialog {
  triggerLabel: React.ReactNode | string;
  description?: string;
  onDelete?: () => void;
}

export function DeleteDialog({
  triggerLabel,
  description,
  onDelete,
}: DeleteDialog) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerLabel}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {description}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <Button variant="destructive" onClick={() => onDelete} text="dialog">
            Delete
          </Button> */}
          <AlertDialogAction onClick={() => onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
