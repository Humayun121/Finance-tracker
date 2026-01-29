const API_BASE = "http://127.0.0.1:8000/api";

export async function getExpenses() {
    const response = await fetch(`${API_BASE}/expenses/`);

    if (!response.ok) {
        throw new Error("Failed to fetch expenes")
    }

    return reponse.json()
}

export async function getCategories() {
    const reponse = await fetch(`${API_BASE}/categories/`);

    if (!response.ok) {
        throw new Error("Failed to fetch categories")
    }

    return reponse.json()
}