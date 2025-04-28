'use client';

import { forwardRef } from "react";
import { Button } from "../ui/button";
import { Input } from '../ui/input';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(({ onSubmit, isLoading }, ref) => {
    return (
        <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Input 
                    id="file" 
                    type="file"
                    name="file" 
                    accept="application/pdf" 
                    required 
                    className={cn(isLoading && 'opacity-50 cursor-not-allowed')}
                    disabled={isLoading}
                />
                <Button disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                    'Upload PDF'
                )}
                </Button>
            </div>
        </form>
    );
})

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;