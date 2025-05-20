  export interface User {
    _id?: string; // MongoDB uses _id as the default identifier
    name: string; // User's name
    email: string; // User's email
    password?: string; // Optional, for registration/login purposes only
    isAdmin: boolean; // Indicates if the user has admin privileges
    image?: string; // Optional URL for the user's profile image
  }
