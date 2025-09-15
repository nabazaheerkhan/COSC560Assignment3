# Frontend Development Report - ReactJS with TypeScript


Repository Link: https://github.com/nabazaheerkhan/COSC560Assignment3


**Overview**
This report goes through the implementation of the React frontend for a Blog application. The frontend was built with TypeScript and connected to a Laravel backend API. The main goal was to create a modern, responsive interface that lets users manage blog posts with full CRUD functionality (create, read, update, delete).

# 1. Project Structure

The project followed a clear directory structure so everything stayed organised:

frontend/src/
├── components/       # React components
├── contexts/         # Context providers
├── services/         # API services
├── types/            # TypeScript interfaces
├── App.tsx           # Main app
└── index.tsx         # Entry point

# 2. TypeScript Usage

I created interfaces for core entities like User, Post, and Category. This helped a lot in keeping the code predictable and safe when working with API responses. For example:

	interface Post {
  	id: number;
  	title: string;
  	content: string | null;
  	user_id: number;
  	category_id: number;
  	is_active: 'Yes' | 'No';
  	created_at: string;
  	updated_at: string;
  	user: User;
  	category: Category;
	}


This kind of setup meant I didn’t have to second-guess what a Post object looked like when passing it around.

# 3. Components

I split the frontend into reusable components:

App Component: handled routing and authentication context.

Navigation: a responsive navbar that changed depending on whether a user was logged in.

Posts List: displayed posts in a grid with cards, along with actions like view, edit, delete.

Post Detail: full post view with metadata and owner actions.

Post Create/Edit: forms with validation, category dropdowns, and status options.

Auth Components: login and register forms with error handling.


I used a custom Auth Context to manage user state, tokens, and authentication actions. This made it easier to share login/logout across components without prop-drilling.

# 5. API Integration

I set up an Axios instance with a base URL (http://localhost:8000/api). It included an interceptor that automatically added the token to headers if available. I built three service layers:

1. AuthAPI (login, register, logout, profile)
1. PostsAPI (CRUD for posts)
1. CategoriesAPI (fetch categories for forms)


# 6. Forms

Forms were built as controlled components with client-side validation in TypeScript. They included required field checks, password confirmation, and character limits. Real-time feedback helped improve the user experience.

# Challenges 
One of the main challenges was getting the TypeScript interfaces for the API responses right. At first, the nested objects (like posts including users and categories) felt messy, but after defining proper interfaces, it became a lot smoother.

Another smaller issue was keeping the validation consistent between the create and edit post forms. I solved this by sharing the same validation logic and types between both components.

# Conclusion

Overall, the React frontend was successfully built with TypeScript and integrated with Laravel. Key achievements included:

- Full CRUD operations for blog posts
- Token-based authentication
- Responsive design for mobile and desktop
- Type-safe development with TypeScript
- Context API for clean state management
- Bootstrap styling with custom tweaks

The final result is a modern, user-friendly frontend that works seamlessly with the backend API. It’s ready for production and can easily be extended with new features.
- Modern React patterns with hooks and context
- Professional UI with React Bootstrap
- Comprehensive error handling and user feedback

The frontend successfully integrates with the Laravel backend API, providing a seamless user experience while maintaining code quality and performance. The application is ready for production deployment and can be easily extended with additional features.
