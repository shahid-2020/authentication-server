import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const UserStatusEnum = z.enum(
	['active', 'inactive', 'suspended', 'deleted'],
	{
		message: 'Status must be active, inactive, suspended, or deleted',
	},
);

export const GenderEnum = z.enum(['male', 'female', 'others', 'undisclosed'], {
	message: 'Gender must be male, female, others, or undisclosed',
});

export const UserSchema = z.object({
	id: z
		.string({ message: 'User ID is required' })
		.pipe(z.uuid('Invalid user ID format')),
	email: z
		.string({ message: 'Email is required' })
		.toLowerCase()
		.pipe(z.email('Invalid email format')),
	isEmailVerified: z.boolean({
		message: 'Email verification status is required',
	}),
	phoneNumber: z
		.string()
		.regex(phoneRegex, {
			message:
				'Invalid phone number format. Use international format (e.g., +1234567890)',
		})
		.max(20, { message: 'Phone number must not exceed 20 characters' })
		.nullable(),
	isPhoneNumberVerified: z.boolean({
		message: 'Phone verification status is required',
	}),
	status: UserStatusEnum,
	firstName: z
		.string({ message: 'First name is required' })
		.min(1, { message: 'First name cannot be empty' })
		.max(75, { message: 'First name must not exceed 75 characters' }),
	middleName: z
		.string()
		.max(75, { message: 'Middle name must not exceed 75 characters' })
		.nullable(),
	lastName: z
		.string()
		.max(75, { message: 'Last name must not exceed 75 characters' })
		.nullable(),
	displayName: z
		.string({ message: 'Display name is required' })
		.min(1, { message: 'Display name cannot be empty' })
		.max(150, { message: 'Display name must not exceed 150 characters' }),
	dateOfBirth: z.coerce
		.date({ message: 'Invalid date format for date of birth' })
		.refine(
			(date) => {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return date < today;
			},
			{ message: 'Date of birth must be in the past' },
		)
		.transform((date) => {
			const dateOnly = new Date(date);
			dateOnly.setHours(0, 0, 0, 0);
			return dateOnly;
		})
		.nullable(),
	gender: GenderEnum.nullable(),
	avatarUrl: z
		.url({ message: 'Invalid avatar URL format' })
		.max(512, { message: 'Avatar URL must not exceed 512 characters' })
		.nullable(),
	bio: z
		.string()
		.max(500, { message: 'Bio must not exceed 500 characters' })
		.nullable(),
	timezone: z
		.string()
		.max(100, { message: 'Timezone must not exceed 100 characters' })
		.nullable(),
	locale: z
		.string()
		.max(20, { message: 'Locale must not exceed 20 characters' })
		.nullable(),
	createdAt: z.date({ message: 'Creation date is required' }),
	updatedAt: z.date({ message: 'Update date is required' }),
	deletedAt: z.date({ message: 'Invalid deletion date format' }).nullable(),
});

export const CreateUserSchema = z.object({
	email: z
		.string({ message: 'Email is required' })
		.toLowerCase()
		.pipe(z.email('Invalid email format')),
	phoneNumber: z
		.string()
		.regex(phoneRegex, {
			message:
				'Invalid phone number format. Use international format (e.g., +1234567890)',
		})
		.max(20, { message: 'Phone number must not exceed 20 characters' })
		.optional(),
	firstName: z
		.string({ message: 'First name is required' })
		.min(1, { message: 'First name cannot be empty' })
		.max(75, { message: 'First name must not exceed 75 characters' }),
	middleName: z
		.string()
		.max(75, { message: 'Middle name must not exceed 75 characters' })
		.optional(),
	lastName: z
		.string()
		.max(75, { message: 'Last name must not exceed 75 characters' })
		.optional(),
	displayName: z
		.string({ message: 'Display name is required' })
		.min(1, { message: 'Display name cannot be empty' })
		.max(150, { message: 'Display name must not exceed 150 characters' }),
	dateOfBirth: z.coerce
		.date({ message: 'Invalid date format for date of birth' })
		.refine(
			(date) => {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return date < today;
			},
			{ message: 'Date of birth must be in the past' },
		)
		.transform((date) => {
			const dateOnly = new Date(date);
			dateOnly.setHours(0, 0, 0, 0);
			return dateOnly;
		})
		.optional(),
	gender: GenderEnum.optional(),
	avatarUrl: z
		.url({ message: 'Invalid avatar URL format' })
		.max(512, { message: 'Avatar URL must not exceed 512 characters' })
		.optional(),
	bio: z
		.string()
		.max(500, { message: 'Bio must not exceed 500 characters' })
		.optional(),
	timezone: z
		.string()
		.max(100, { message: 'Timezone must not exceed 100 characters' })
		.optional(),
	locale: z
		.string()
		.max(20, { message: 'Locale must not exceed 20 characters' })
		.optional(),

	password: z
		.string({ message: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters long' })
		.max(128, { message: 'Password must not exceed 128 characters' })
		.regex(/[A-Z]/, {
			message: 'Password must contain at least one uppercase letter',
		})
		.regex(/[a-z]/, {
			message: 'Password must contain at least one lowercase letter',
		})
		.regex(/[0-9]/, { message: 'Password must contain at least one number' })
		.regex(/[^A-Za-z0-9]/, {
			message: 'Password must contain at least one special character',
		}),
});

export const UpdateUserSchema = z.strictObject({
	email: z
		.string({ message: 'Email is required' })
		.toLowerCase()
		.pipe(z.email('Invalid email format'))
		.optional(),
	phoneNumber: z
		.string()
		.regex(phoneRegex, {
			message:
				'Invalid phone number format. Use international format (e.g., +1234567890)',
		})
		.max(20, { message: 'Phone number must not exceed 20 characters' })
		.nullable()
		.optional(),
	status: UserStatusEnum.optional(),
	firstName: z
		.string()
		.min(1, { message: 'First name cannot be empty' })
		.max(75, { message: 'First name must not exceed 75 characters' })
		.optional(),
	middleName: z
		.string()
		.max(75, { message: 'Middle name must not exceed 75 characters' })
		.nullable()
		.optional(),
	lastName: z
		.string()
		.max(75, { message: 'Last name must not exceed 75 characters' })
		.nullable()
		.optional(),
	displayName: z
		.string()
		.min(1, { message: 'Display name cannot be empty' })
		.max(150, { message: 'Display name must not exceed 150 characters' })
		.optional(),
	dateOfBirth: z.coerce
		.date({ message: 'Invalid date format for date of birth' })
		.refine(
			(date) => {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return date < today;
			},
			{ message: 'Date of birth must be in the past' },
		)
		.transform((date) => {
			const dateOnly = new Date(date);
			dateOnly.setHours(0, 0, 0, 0);
			return dateOnly;
		})
		.nullable()
		.optional(),
	gender: GenderEnum.nullable().optional(),
	avatarUrl: z
		.url({ message: 'Invalid avatar URL format' })
		.max(512, { message: 'Avatar URL must not exceed 512 characters' })
		.nullable()
		.optional(),
	bio: z
		.string()
		.max(500, { message: 'Bio must not exceed 500 characters' })
		.nullable()
		.optional(),
	timezone: z
		.string()
		.max(100, { message: 'Timezone must not exceed 100 characters' })
		.nullable()
		.optional(),
	locale: z
		.string()
		.max(20, { message: 'Locale must not exceed 20 characters' })
		.nullable()
		.optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserStatus = z.infer<typeof UserStatusEnum>;
export type Gender = z.infer<typeof GenderEnum>;
