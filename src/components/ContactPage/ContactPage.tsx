import './ContactPage.css'
import {Badge, Collapse} from "antd";
import {Contact} from "../Contact/Contact.tsx";
import {IContact} from "../../model/IContact.ts";

interface IContactPageProps {
    letter: string;
    contacts?: IContact[];
    badge: number;
}

export function ContactPage({letter, contacts, badge}: IContactPageProps){
    return (
        <>
            <Badge.Ribbon text={badge} color={badge > 0 ? 'green': '#BFBFBF'}>
                <Collapse items={[{
                    key: letter,
                    label: letter,
                    children: contacts != undefined ? contacts.map(contact => <Contact contact={contact} key={contact.id} />): []
                }]} collapsible={badge == 0 ? 'disabled': undefined}
                    style={{display: 'flex', flexDirection: 'column'}}/>
            </Badge.Ribbon>
        </>
    )
}
