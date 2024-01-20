import { createContext, Dispatch, SetStateAction } from 'react'
import { User } from '../types/index.ts'

interface UserProfileContextType {
	userProfile: User | null
	setUserProfile: Dispatch<SetStateAction<User | null>>
}

const UserProfileContext = createContext<UserProfileContextType>(
	{} as UserProfileContextType
)

export const UserProfileProvider = UserProfileContext.Provider
export default UserProfileContext