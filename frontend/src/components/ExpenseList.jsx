import { useState, useEffect } from "react"
import { getExpenses } from "../api/expenses";
 
function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getExpenses().then(data => {
            setExpenses(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading expenses…</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div>
            {expenses.map(expense => (
                <p key={expense.id}>
                    £{expense.amount} - {expense.description}
                </p>
            ))}
        </div>
    )
}

export default ExpenseList;