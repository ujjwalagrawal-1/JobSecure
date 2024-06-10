const zod = require("zod");

const RegisterSchema = zod.object({
  Username: zod
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username can be at most 255 characters" })
    .toLowerCase(),
  Email: zod
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email should be at least 3 characters" })
    .max(255, { message: "Email can be at most 255 characters" })
    .toLowerCase(),
  Password: zod
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 7 characters" })
    .max(1024, { message: "Password must be at most 1024 characters" }),
  ConfirmPassword : zod
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 7 characters" })
    .max(1024, { message: "Password must be at most 1024 characters" }).optional(),
  Avator : zod
    .string({required_error : "Please Provide the Avator"})
    .optional(),
  firstname : zod
    .string({required_error : "Please Provide valid FirstName"})
    .trim()
    .min(3 ,{ message : "Please Provide atleast 3 character for firstname"})
    .max(50,{message : "Please Provide atleast 3 character first name"}),
  lastname : zod
    .string({required_error : "Please Provide valid name"})
    .trim()
    .min(3 ,{ message : "Please Provide atleast 3 character for lastname"})
    .max(50,{message : "Please Provide atleast 50 character fro lastname"})
    .optional(),
  Phone : zod 
  .string({required_error : "Number is Necessary"})
  .length(10, { message: "Phone number must be exactly 10 digits" }),
  Role: zod
    .string()
    .optional()
    .refine((val) => val === "Job Seeker" || val === "Employer", {
      message: "Role must be either 'Job Seeker' or 'Employer'",
    })
});

const SigninSchema = zod.object({
  Username: zod
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(255, { message: "Username can be at most 255 characters" })
    .toLowerCase(),
  Email: zod
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email should be at least 3 characters" })
    .max(255, { message: "Email can be at most 255 characters" }),
  Password: zod
    .string({ required_error: "Password is required" })
    .trim()
    .min(7, { message: "Password must be at least 7 characters" })
    .max(1024, { message: "Password must be at most 1024 characters" })
});
const  ForgotpasswordSchema = zod.object({
  Email : zod
  .string({ required_error: "Email is required" })
  .trim()
  .email({ message: "Invalid email address" })
  .toLowerCase(),
  Username : zod 
  .string({ required_error: "Username is required" })
  .trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(255, { message: "Username can be at most 255 characters" })
  .toLowerCase()
  .optional(),
})
const JobSchema = zod.object({
  title: zod.string({
    required_error: "Please provide a title.",
  })
    .min(3, "Title must contain at least 3 Characters!")
    .max(30, "Title cannot exceed 30 Characters!"),
  description: zod.string({
    required_error: "Please provide a description.",
  })
    .min(5, "Description must contain at least 30 Characters!")
    .max(500, "Description cannot exceed 500 Characters!"),
  category: zod.string({
    required_error: "Please provide a category.",
  }),
  country: zod.string({
    required_error: "Please provide a country name.",
  }),
  city: zod.string({
    required_error: "Please provide a city name.",
  }),
  location: zod.string({
    required_error: "Please provide location.",
  })
    .min(2, "Location must contain at least 2 characters!"),
  fixedSalary: zod.number()
    .min(1000, "Salary must contain at least 4 digits")
    .max(999999999, "Salary cannot exceed 9 digits").optional(),
  salaryFrom: zod.number()
    .min(1000, "Salary must contain at least 4 digits")
    .max(999999999, "Salary cannot exceed 9 digits").optional(),
  salaryTo: zod.number()
    .min(1000, "Salary must contain at least 4 digits")
    .max(999999999, "Salary cannot exceed 9 digits").optional(),
  expired: zod.boolean().optional().default(false),
  jobPostedOn: zod.date().optional().default(new Date()),
  postedBy: zod.optional(),
});
const ApplicationSchema = zod.object({
  name: zod.string({
    required_error: "Please enter your Name!",
  })
    .min(3, "Name must contain at least 3 Characters!")
    .max(30, "Name cannot exceed 30 Characters!"),
  email: zod.string({
    required_error: "Please enter your Email!",
  }).email("Please provide a valid Email!"),
  coverLetter: zod.string({
    required_error: "Please provide a cover letter!",
  }),
  phone: zod.string({
    required_error: "Please enter your Phone Number!",
  }),
  address: zod.string({
    required_error: "Please enter your Address!",
  }),
  resume: zod.object({
    public_id: zod.string({
      required_error: "Public ID is required!",
    }),
    url: zod.string({
      required_error: "URL is required!",
    }),
  }),
  applicantID: zod.object({
    user: zod.string({
      required_error: "User ID is required!",
    }),
    role: zod.enum(["Job Seeker"], {
      required_error: "Role is required and must be 'Job Seeker'!",
    }),
  }),
  employerID: zod.object({
    user: zod.string({
      required_error: "User ID is required!",
    }),
    role: zod.enum(["Employer"], {
      required_error: "Role is required and must be 'Employer'!",
    }),
  }),
});
module.exports = {
  RegisterSchema,
  SigninSchema,
  ForgotpasswordSchema,
  JobSchema,
  ApplicationSchema
};
