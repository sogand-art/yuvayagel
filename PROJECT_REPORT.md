# Yuvaya Gel Project Report

## Project Overview

Yuvaya Gel is a web-based pet adoption platform built to connect people with cats and dogs that are waiting for a home. The project presents available animals, lets visitors filter pets by species, allows registered users to save liked pets, and provides a conversation system where adopters can ask questions before completing the adoption in person.

The website is designed as a shared adoption network for partner shelters. Its public side focuses on discovery, trust, and communication. Its admin side focuses on shelter operations: adding pet records, monitoring adoption inventory, replying to messages, and marking successful adoptions.

In simple terms, Yuvaya Gel works like an adoption bridge between shelters and adopters:

1. Shelter staff add available pets to the system.
2. Visitors browse cats and dogs.
3. Registered users like pets or send adoption inquiries.
4. Admins reply through a built-in messaging panel.
5. When adoption is completed, the pet is marked as adopted and stored in the adopted pets archive.

## Purpose of the Project

Many adoption processes depend on social media posts, scattered messages, or manual record keeping. Yuvaya Gel organizes this process into one platform. It gives animals a clearer public profile, gives adopters a simple way to communicate with the shelter, and gives staff a practical dashboard for managing pet records and adoption conversations.

The main goals are:

- Make available cats and dogs easy to browse.
- Show important adoption details such as breed, age, medical status, photo, and description.
- Allow users to create accounts and keep track of pets they like.
- Let adopters start conversations about a specific pet.
- Let admins manage pets, messages, and completed adoptions from one panel.
- Support responsible adoption by keeping final adoption decisions in person.

## Target Users

The project has two main user groups.

Adopters are public users who visit the website to find a pet. They can view the home page, browse pets, filter dogs or cats, open detailed pet pages, create an account, like pets, send inquiries, and continue conversations with the shelter team.

Admins are shelter staff. They use a protected admin panel to manage operational tasks. Admins can view dashboard statistics, add new pets, remove pets, mark pets as adopted, review conversations, reply to adopters, finish chats, and view the adopted pets archive.

## Main Public Website Features

### Home Page

The home page introduces Yuvaya Gel as a partner adoption network. It includes a rotating hero section with three slides. The slides explain the adoption network, the partner identity, and the practical shelter communication system.

The home page also includes category cards for dogs and cats. These cards link directly to filtered pet listings, making it quick for users to browse the type of pet they are interested in.

At the bottom of the home page there is a general contact form. When a user sends a message, the system creates a conversation in Firebase and redirects the user to a chat page.

### Pet Listing Page

The pet listing page shows all pets whose availability is marked as `available`. It uses real-time Firebase updates, so when pet information changes in the database, the page can update without a full manual refresh.

Users can filter pets by:

- All pets
- Dogs
- Cats

Each pet card displays:

- Pet photo or placeholder
- Name
- Species
- Breed
- Age in years and months
- Medical status
- Short description
- Like button

The page also reads URL filters such as `/pets?species=dog` and `/pets?species=cat`, so category links from the home page open the listing page already filtered.

### Pet Detail Page

Each pet has a dedicated detail page at `/pets/[id]`. This page gives more complete information about one animal.

It displays:

- Large pet image
- Name
- Species
- Breed
- Age
- Medical status
- Availability
- Description
- Like button
- Inquiry action

If the visitor is not logged in, the page asks them to log in before sending an inquiry. If the user is logged in, the form is prefilled with their name and email from their profile. When they send an inquiry, the system creates:

- A conversation document in the `conversations` collection
- A first message document in the `messages` collection

The user is then redirected to a personal conversation thread.

### Liked Pets Page

The liked pets page is a personal saved list for logged-in users. It checks Firebase Authentication first. If the user is not logged in, they are redirected to the login page.

For logged-in users, the page reads the `likedPets` collection, finds all pet IDs liked by the current user, loads the matching pet records from the `pets` collection, and displays them as cards.

This feature helps adopters compare pets and return to animals they are interested in.

### Messages and Conversation Pages

The public messaging system lets users continue adoption or general contact conversations.

The `My Messages` page lists conversations connected to the logged-in user. Each item shows the conversation title, status, and last updated date.

The individual chat page at `/messages/[token]` shows the conversation history in real time. Messages are separated by sender:

- User messages appear on one side.
- Admin messages appear on the other side.

For adoption conversations, the chat page also shows a small pet summary card with the pet image, breed, species, and age. If a conversation is finished, the chat becomes read-only. The public chat page also contains display logic for scheduled appointments if a `scheduledTime` value exists in the conversation.

### Account System

The project uses Firebase Authentication for user accounts.

The signup form collects:

- Name
- Family name
- Email
- Password
- Confirm password

The form validates email format and requires passwords to have at least 6 characters and one uppercase letter. After signup, the user profile is stored in the Firestore `users` collection.

The login form signs users in with email and password. It also supports redirect URLs, so if a user tries to access a protected page, they can be sent back to their intended page after login.

The forgot password page uses Firebase password reset email functionality.

## Admin Panel Features

### Admin Security

The admin section is protected by Firebase Authentication and a role check. A user must be logged in and have `role: "admin"` in their Firestore user document. If they are not an admin, they are redirected to the admin login page.

This separates normal adopters from staff users.

### Admin Dashboard

The dashboard gives a quick overview of shelter inventory. It reads all records from the `pets` collection and calculates:

- Total pets
- Number of dogs
- Number of cats
- Available pets
- Adopted pets

This gives staff a fast operational summary.

### Manage Pets

The manage pets page combines an add-pet form and a pet list.

The add-pet form allows admins to enter:

- Name
- Species: dog or cat
- Breed
- Age in years and months
- Medical status
- Description
- Photo URL

When saved, the pet is added to Firestore with:

- `availability: "available"`
- `createdAt`
- `updatedAt`

The pet list shows current non-adopted pets. Admins can mark a pet as adopted or delete it permanently.

### Admin Messages

The admin messages page shows all conversations ordered by most recent update. Each conversation displays:

- Pet or inquiry title
- User name
- User email
- Status
- Appointment time if present
- Creation date

Admins can open a conversation and reply in real time. The admin chat page supports:

- Reading all user/admin messages
- Sending admin replies
- Marking an adoption as completed
- Finishing a conversation
- Viewing the conversation history after it is finished

When an admin marks a pet as adopted from an adoption conversation, the system:

1. Creates a record in the `adoptedPets` collection.
2. Updates the pet in the `pets` collection to `availability: "adopted"`.
3. Updates the conversation status to `finished`.

The admin chat page has a Schedule button and state variable, and the public chat page can display scheduled appointment information, but the current code does not yet include the visible schedule form or save action.

### Adopted Pets Archive

The adopted pets page reads from the `adoptedPets` collection and shows completed adoptions. Each record includes:

- Pet name
- Pet image
- Breed
- Species
- Adopter name
- Adopter email
- Adoption date

This works as a history page for successful adoptions.

## How the System Works

Yuvaya Gel is built with a client-side Next.js application connected to Firebase services.

The flow works like this:

1. The admin logs in through the admin login page.
2. The admin adds pet information through the manage pets form.
3. Pet data is stored in the Firestore `pets` collection.
4. Public users browse available pets from Firestore.
5. A logged-in user can like a pet, which stores a record in `likedPets`.
6. A logged-in user can send an adoption inquiry from a pet detail page.
7. The inquiry creates a `conversations` document and a first `messages` document.
8. Admins see the conversation in the admin messages panel.
9. User and admin exchange messages through Firestore.
10. If the adoption is successful, the admin marks the pet as adopted.
11. The pet is removed from the available listings and recorded in `adoptedPets`.

## Firebase Data Model

The project uses several Firestore collections.

### `users`

Stores user profile information and admin roles.

Important fields:

- `name`
- `familyName`
- `email`
- `role` for admin users

### `pets`

Stores pet records.

Important fields:

- `name`
- `species`
- `breed`
- `age` in months
- `description`
- `medicalStatus`
- `availability`
- `imageUrl`
- `createdAt`
- `updatedAt`

### `likedPets`

Stores which user liked which pet.

Important fields:

- `userId`
- `petId`
- `createdAt`

### `conversations`

Stores conversation metadata.

Important fields:

- `conversationType`
- `petId`
- `petName`
- `petImage`
- `petBreed`
- `petSpecies`
- `petAge`
- `userName`
- `userEmail`
- `userId`
- `status`
- `scheduledTime`
- `createdAt`
- `updatedAt`

### `messages`

Stores individual chat messages.

Important fields:

- `conversationId`
- `sender`
- `text`
- `createdAt`

### `adoptedPets`

Stores completed adoption records.

Important fields:

- `petId`
- `petName`
- `petImage`
- `petBreed`
- `petSpecies`
- `adopterName`
- `adopterEmail`
- `adopterId`
- `conversationId`
- `adoptedAt`

## Technology Stack

The project uses:

- Next.js 16 for the web application and file-based routing
- React 19 for interactive components
- TypeScript for safer code structure
- Tailwind CSS 4 for styling
- Firebase Authentication for user and admin login
- Cloud Firestore for pets, users, likes, conversations, messages, and adoptions
- Firebase Storage and Functions are initialized in the Firebase library file, although the currently visible app mainly uses Authentication and Firestore

## Visual Design

The design combines warm adoption-focused colors with a practical admin interface.

Main colors include:

- Indigo: used for trust, structure, navigation, and admin areas
- Red: used for calls to action and emotional emphasis
- Green: used for success, growth, and adoption progress
- Cream/paper tones: used for warmth and friendly public pages
- Black/dark ink: used for strong contrast

The project also uses two partner logos together in the navbar, hero section, and footer. This communicates that Yuvaya Gel is a shared adoption experience connected to partner shelters.

## Key Strengths

- Clear separation between public adopters and admin staff
- Real-time pet listings and message updates through Firestore
- Full adoption inquiry flow from pet detail page to admin conversation
- Saved liked pets for registered users
- Admin dashboard with useful shelter statistics
- Adoption archive for completed cases
- Responsive navigation with desktop and mobile menus
- Consistent visual identity across public and admin pages

## Current Limitations and Possible Improvements

The project is functional, but some improvements could make it stronger:

- Add a complete schedule form in the admin chat so admins can set appointment dates directly.
- Replace photo URL input with Firebase Storage image upload.
- Add edit functionality for existing pet records.
- Add stronger Firestore security rules for admin-only writes and user-owned messages.
- Improve metadata title and description from the default Create Next App values.
- Add automated tests for authentication redirects, pet filtering, liking, and messaging.
- Add loading and error handling in more places for network failures.
- Add adoption application questions before a conversation starts.

## Poster-Ready Summary

Yuvaya Gel is a full-stack pet adoption platform that helps shelters present available cats and dogs, communicate with potential adopters, and manage completed adoptions. Users can browse pets, filter by cats or dogs, save liked animals, create an account, send adoption inquiries, and chat with shelter staff. Admins can add pets, view inventory statistics, reply to messages, mark pets as adopted, and keep an archive of successful adoptions. The project is built with Next.js, React, TypeScript, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

## Suggested Poster Sections

For a project poster, the clearest layout would be:

1. Title: Yuvaya Gel - Pet Adoption Platform
2. Problem: Pet adoption needs organized listings, communication, and records.
3. Solution: A web platform connecting adopters with shelter pets.
4. Main Users: Adopters and admins.
5. Main Features: Browse pets, filter cats/dogs, liked pets, messaging, admin dashboard, adopted pets archive.
6. Workflow Diagram: Admin adds pet -> user browses -> user sends inquiry -> admin replies -> adoption completed.
7. Technology Stack: Next.js, React, TypeScript, Tailwind CSS, Firebase Auth, Firestore.
8. Database Collections: users, pets, likedPets, conversations, messages, adoptedPets.
9. Impact: Easier discovery, better communication, and more organized shelter operations.
