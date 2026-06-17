'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ResponsiveEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSave: () => void
  isSaving?: boolean
}

export function ResponsiveEditor({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  isSaving = false,
}: ResponsiveEditorProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left border-b pb-4">
            <DrawerTitle className="text-lg">{title}</DrawerTitle>
            {description && (
              <DrawerDescription className="text-sm">{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {children}
          </div>
          <DrawerFooter className="border-t pt-4">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button
                className="flex-1"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-sm">{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {children}
        </div>
        <SheetFooter className="p-6 pt-4 border-t bg-muted/30">
          <div className="flex gap-3 w-full justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
