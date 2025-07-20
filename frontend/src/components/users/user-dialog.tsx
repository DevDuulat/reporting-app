import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createUser, updateUser } from "@/api/usersApi";
import type { User } from "@/types/user";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: User;
  onSuccess: () => void;
}

export function UserDialog({ open, onClose, initialData, onSuccess }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [role, setRole] = useState(initialData?.role ?? "");

  const handleSubmit = async () => {
    const payload = { name, email, role };

    if (initialData?.id) {
      await updateUser(initialData.id, payload);
    } else {
      await createUser(payload);
    }

    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Редактировать пользователя"
              : "Создать пользователя"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Роль"
          />

          <Button onClick={handleSubmit}>
            {initialData ? "Сохранить изменения" : "Создать"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
