import {ContactPage} from "../ContactPage/ContactPage.tsx";
import {Space} from "antd";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchContacts} from "../../store/reducers/ActionCreators.ts";
import {useEffect} from "react";

export function Contacts() {
    const alphabet1: string[] = "abcdefghijklm".split("");
    const alphabet2: string[] = "nopqrstuvwxyz".split("");
    const letters: string[] = "abcdefghijklmnopqrstuvwxyz".split("");

    const dispatch = useAppDispatch();
    const {contacts} = useAppSelector(state => state.contactReducer);

    useEffect(() => {
        dispatch(fetchContacts());
    },[])

    // собираем информацию о кол-ве контактов по каждой букве
    type Counter = { letter:string; count:number };
    let counters: Counter[] = letters.map(letter => {
        return {
            letter: letter,
            count: contacts.filter(contact => contact.letter === letter).length
        };
    });

    // @ts-ignore
    return (
        <>
            <Space direction="horizontal" size="large"  style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Space direction="vertical" size="middle" style={{ display: 'flex', width: '40rem' }}>
                    {alphabet1.map(letter =>(
                        <ContactPage
                            letter={letter.toUpperCase()}
                            badge={counters.find(counter => counter.letter === letter)?.count ?? 0}
                            contacts={contacts.filter(contact => contact.letter === letter)}
                            key={letter}
                            />
                    ))}
                </Space >
                <Space direction="vertical" size="middle" style={{ display: 'flex', width: '40rem' }}>
                    {alphabet2.map(letter => (
                        <ContactPage
                            letter={letter.toUpperCase()}
                            badge={counters.find(counter => counter.letter === letter)?.count ?? 0}
                            contacts={contacts.filter(contact => contact.letter === letter)}
                            key={letter}
                        />
                    ))}
                </Space>
            </Space>
        </>
    )
}