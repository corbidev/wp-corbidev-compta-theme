import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Dialog        = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal  = DialogPrimitive.Portal;
const DialogClose   = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef( ( { className, ...props }, ref ) => (
    <DialogPrimitive.Overlay
        ref={ ref }
        className={ cn(
            'fixed inset-0 z-[99990] bg-black/60 ' +
            'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
        ) }
        { ...props }
    />
) );
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef( ( { className, children, ...props }, ref ) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ ref }
            className={ cn(
                'fixed left-1/2 top-1/2 z-[99991] -translate-x-1/2 -translate-y-1/2 ' +
                'grid w-full max-w-lg gap-4 bg-white p-6 shadow-2xl sm:rounded-xl ' +
                'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
                'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] ' +
                'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                className
            ) }
            { ...props }
        >
            { children }
        </DialogPrimitive.Content>
    </DialogPortal>
) );
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ( { className, ...props } ) => (
    <div className={ cn( 'flex flex-col space-y-1.5', className ) } { ...props } />
);

const DialogFooter = ( { className, ...props } ) => (
    <div
        className={ cn( 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className ) }
        { ...props }
    />
);

const DialogTitle = React.forwardRef( ( { className, ...props }, ref ) => (
    <DialogPrimitive.Title
        ref={ ref }
        className={ cn( 'text-lg font-semibold leading-none tracking-tight', className ) }
        { ...props }
    />
) );
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef( ( { className, ...props }, ref ) => (
    <DialogPrimitive.Description
        ref={ ref }
        className={ cn( 'text-sm text-neutral-500', className ) }
        { ...props }
    />
) );
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose,
    DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
};
