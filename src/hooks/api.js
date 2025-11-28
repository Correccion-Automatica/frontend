import { useAuth } from "../context/AuthProvider";
import { api } from "../lib/axios";


export async function getOrganizations() {
    const allOrganizations = await api.get('/organizations');

    console.log(allOrganizations)
    return allOrganizations.data;
}