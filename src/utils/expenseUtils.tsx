import axios from "axios"
import { toast } from "sonner"
import { Expense } from "../types"

export const GetExpenses = async (setExpenses: React.Dispatch<React.SetStateAction<Expense[] | null>>) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/expense/get-expenses`, { withCredentials: true })
        if (response.status === 200) {
            setExpenses(response.data)
        }
    } catch (err) {
        console.log(err)
        toast.error('Unknown Server Error')
    }
}