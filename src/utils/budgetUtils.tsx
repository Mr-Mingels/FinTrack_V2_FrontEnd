import axios from "axios"
import { toast } from "sonner"
import { Budget } from "../types"

export const GetBudgets = async (setBudgets: React.Dispatch<React.SetStateAction<Budget[] | null>>) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/budget/get-budgets`, { withCredentials: true })
        if (response.status === 200) {
            setBudgets(response.data)
        }
    } catch (err) {
        console.log(err)
        toast.error('Unknown Server Error')
    }
}