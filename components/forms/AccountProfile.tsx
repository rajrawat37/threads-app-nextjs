"use client"

import Image from "next/image";

//using shadcn/ui library components 
//after installation automatically a ui folder would be generated containing respective components.
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";


//Zod for form validation
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import { ChangeEvent, useState } from "react";

import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { UserValidation } from '@/lib/validations/user';


interface UserProps{
    user:{
        id:string;
        objectId:string;
        username:string;
        name:string;
        bio:string;
        image:string;
    };
    btnTitle:string
}


const AccountProfile = ({user,btnTitle} : UserProps) => {

    const [files,setFiles] =useState<File[]>([]);
    const { startUpload } = useUploadThing("media"); //Hook provided by uploadthing to upload media
    
  //create form schema or define shape of form using useForm() Hook
    const form =useForm({
        resolver:zodResolver(UserValidation),   // zod Resolver for user validation defined by us using Zod
        
        //filling default values in onboarding page from user object(passed from props)
        defaultValues : {
            profile_photo:user?.image || "",
            name:user?.name || "",
            username:user?.username || "",
            bio:user?.bio || "",
        }
    });

    const handleImage = (e:ChangeEvent<HTMLInputElement> , fieldChange : (value:string) => void) => {
        
        //to prevent browser reload
        e.preventDefault();
        
        // console.log(e);
        // console.log("Target value : " , e.target.files);

        // changing image and field when user uploads custom img file
        
        // initializing a file reader
        const fileReader = new FileReader();

        //if e.target.files is not null and if its length is greater than 0
        if(e.target.files && e.target.files.length>0){

            const file=e.target.files[0]; 
            setFiles(Array.from(e.target.files));

            // if not an image type of file then exit out
            if(!file.type.includes('image')) return;

            fileReader.onload = async(event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                console.log(imageDataUrl);
                fieldChange(imageDataUrl);
            }

            //used to read the contents of a file and generate a data URL
            fileReader.readAsDataURL(file);
        }
    }

    //defining submit handler for form
    //this function will re-upload the image(if any) and update the user it in MongoDB database
    //user details typed in form is passed as parameters
    const  onSubmit= async(values: z.infer<typeof UserValidation>) => {
       
      
        const blob = values.profile_photo;

        //If an image file has been uploaded by user then it must have been converted to
        //base64 encoded string by "readAsDataUrl" method of FileReader in handleImage() function ;
        const hasImageChanged = isBase64Image(blob);

        if(hasImageChanged){
            const imgRes=await startUpload(files);  //uploading image using hook provided by Uploadthing

            if(imgRes && imgRes[0].url){
                values.profile_photo=imgRes[0].url;
            }
        }
        //backend function to update user profile
        console.log(values,"😇 Values are 😇");
    }


    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value? (
                    <Image 
                        src={field.value}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain"
                    />
                ):(
                <Image 
                src="/assets/profile.svg"
                alt="profile photo"
                width={24}
                height={24}
                className="rounded-full object-contain"
            />
            )}
            </FormLabel>

              <FormControl className="flex-1 text-base-semibold cursor-pointer  text-gray-200">
                <Input 
                type="file" 
                accept="image/*"
                className='account-form_image-input'
                placeholder="Upload a photo"
                onChange={(e) => {handleImage(e,field.onChange)}}
                />
              </FormControl>
              <FormMessage />
        </FormItem>
          )}
        />

        {/* for name input */}
         <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>

              <FormControl>
                <Input
                 type="text"
                 className="account-form_input no-focus"
                 {...field}
                />
              </FormControl>
              <FormMessage />
        </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>Submit</Button>
      </form>
    </Form>
    )
}

export default AccountProfile;
