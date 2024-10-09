import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "../../hooks/use-toast";


interface NameUpdatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onUpdateName: (newName: string) => void;
}

const NameUpdatePopup : React.FC<NameUpdatePopupProps> = ({ isOpen, onClose, currentName, onUpdateName }) => {
  const [name, setName] = React.useState(currentName);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/info', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Name updated successfully",
          duration: 3000,
        });
        onUpdateName(name);
        onClose();
      } else {
        throw new Error(data.message || 'Failed to update name');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setName(currentName);
  }, [currentName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameUpdatePopup;