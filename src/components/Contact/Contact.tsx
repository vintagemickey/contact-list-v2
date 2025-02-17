import "./Contact.css"
import {Button, Space, Typography} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";
import {EditModal} from "../EditModal/EditModal.tsx";
import {useAppDispatch} from "../../hooks/redux.ts";
import {IContact} from "../../model/IContact.ts";
import {deleteContact} from "../../store/reducers/ActionCreators.ts";

const { Text } = Typography;

export function Contact({ contact }: { contact: IContact }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    const showModal = () => {
        setIsEditModalOpen(true);
    };

    const handleOk = () => {
        setIsEditModalOpen(false);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };

    const handleDeleteContact = () => {
        dispatch(deleteContact(contact));
    }

    return (
        <>
            <Space direction="horizontal" size={[8, 16]} className="contact">
                <Text>{contact.name}</Text>
                <Text>{contact.vacancy}</Text>
                <Text>{contact.phone}</Text>
                <Button onClick={showModal} icon={<EditOutlined />}></Button>
                <Button onClick={handleDeleteContact} icon={<DeleteOutlined />}></Button>
            </Space>
            <EditModal isEditModalOpen={isEditModalOpen} handleOk={handleOk} handleCancel={handleCancel} contact={contact} />
        </>
    )
}