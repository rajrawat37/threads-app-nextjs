import * as z from 'zod';


//Zod  allows us to create schemas for form fields easily

export const UserValidation = z.object({
    profile_photo:z.string().url().nonempty(),  //photo should be string s url and non empty
    name:z.string().min(3,{message : 'MINIMUM 3 characters'}).max(30), //a string with min length 3 and max length 30
    username:z.string().min(3,{message : 'MINIMUM 3 characters'}).max(30), // a string with 3<length<=30
    bio:z.string().min(3).max(1000), 
});
