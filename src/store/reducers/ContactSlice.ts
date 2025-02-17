import {IContact} from '../../model/IContact.ts'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ContactState {
    contacts: IContact[],
}

const initialState: ContactState = {
    contacts: [],
}

export const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        fetchContacts(state, action: PayloadAction<IContact[]>) {
            state.contacts = action.payload;
        },
        addContact(state, action: PayloadAction<IContact>) {
            state.contacts.push(action.payload);
        },
        editContact(state, action: PayloadAction<IContact>) {
            const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
            if (index !== -1) {
                state.contacts[index] = action.payload;
            }
        },
        deleteContact(state, action: PayloadAction<IContact>) {
            state.contacts = state.contacts.filter(contact => contact.id !== action.payload.id);
        },
        clearContacts(state) {
            state.contacts = [];
        }
    }
})

export default contactSlice.reducer;
