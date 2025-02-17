import {Divider, Form, Input, List, Modal} from "antd";
import {useState} from "react";
import {useAppSelector} from "../../hooks/redux.ts";
import {IContact} from "../../model/IContact.ts";

interface SearchModalProps {
    isSearchModalOpen: boolean,
    handleCancel: () => void,
    handleOk?: () => void
}

export function SearchModal({isSearchModalOpen, handleCancel}: SearchModalProps) {
    const [search, setSearch] = useState("");
    const contacts = useAppSelector(state => state.contactReducer.contacts);
    const [form] = Form.useForm();

    const filteredContacts = search ? contacts.filter(contact =>
            contact.name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const handleClose = () => {
        setSearch("");
        form.resetFields();
        handleCancel();
    }

    return (
        <>
            <Modal title="Search contacts" open={isSearchModalOpen} onOk={handleClose} onCancel={handleClose}>
                <Divider/>
                <Form form={form} name="search-form">
                    <Form.Item
                        label="Search"
                        name="search"
                        rules={[
                            {pattern: /^[A-Za-z]+$/, message: "Only latin letters is available"},
                        ]}
                    >
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)} // Обновляем search на лету
                        />
                    </Form.Item>
                </Form>


                <List
                    bordered
                    dataSource={filteredContacts}
                    renderItem={(contact: IContact) => (
                        <List.Item>
                            {contact.name} — {contact.phone}
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    )
}