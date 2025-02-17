import {AppDispatch} from "../store.ts";
import {IContact} from "../../model/IContact.ts";
import {contactSlice} from "./ContactSlice.ts";

export const fetchContacts = () => (dispatch: AppDispatch) => {
    const keys: string[] = Object.keys(localStorage);
    const contacts: IContact[] = [];
    keys.forEach((key: string) => {
        contacts.push(JSON.parse(<string>localStorage.getItem(key)));
    })
    dispatch(contactSlice.actions.fetchContacts(contacts));
}

export const addContact = (contact: IContact) => (dispatch: AppDispatch) => {
    localStorage.setItem(contact.id, JSON.stringify(contact));
    dispatch(contactSlice.actions.addContact(contact));
}

export const editContact = (contact: IContact) => (dispatch: AppDispatch) => {
    localStorage.removeItem(contact.id);
    localStorage.setItem(contact.id, JSON.stringify(contact));
    dispatch(contactSlice.actions.editContact(contact));
}

export const deleteContact = (contact: IContact) => (dispatch: AppDispatch) => {
    localStorage.removeItem(contact.id);
    dispatch(contactSlice.actions.deleteContact(contact));
}

export const clearContacts = () => (dispatch: AppDispatch) => {
    localStorage.clear();
    dispatch(contactSlice.actions.clearContacts());
}
