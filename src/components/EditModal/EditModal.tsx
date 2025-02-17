import {Divider, Form, Input, Modal} from "antd";
import PhoneInput from "antd-phone-input";
import {IContact} from "../../model/IContact.ts";
import {useEffect} from "react";
import {editContact} from "../../store/reducers/ActionCreators.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

type FieldType = {
    id:string;
    name: string;
    vacancy: string;
    phone: string;
};

interface SearchModalProps {
    isEditModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    contact: IContact;
}

export function EditModal({isEditModalOpen, handleOk, handleCancel, contact}:SearchModalProps) {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            id: contact.id,
            name: contact.name,
            vacancy: contact.vacancy,
            phone: {countryCode: parseInt(contact.phone.slice(1,2)), areaCode: parseInt(contact.phone.slice(2,5)), phoneNumber: contact.phone.slice(5)}
        })
    }, [contact])

   const onFinish = (values: any) => {
        const newContact: IContact = {
            id: values.id,
            name: values.name,
            vacancy: values.vacancy,
            phone: '+' + values.phone.countryCode + values.phone.areaCode + values.phone.phoneNumber,
            letter: values.name.slice(0, 1),
        };
        dispatch(editContact(newContact));
        form.resetFields();
        handleOk();
    };

    // @ts-ignore
    const validator = (_, {valid}) => {
        if (valid(true)) return Promise.resolve();
        return Promise.reject("Invalid phone number");
    }

    return (
        <>
            <Modal title="Edit contact" open={isEditModalOpen} onOk={()=> form.submit()} onCancel={handleCancel}>
                <Divider />
                <Form form={form} name="edit-form" onFinish={onFinish}>
                    <Form.Item<FieldType> name="id" style={{ display: 'none' }}>
                        <Input/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Name"
                        name="name"
                        validateTrigger="onBlur"
                        rules={[
                            { pattern: /^[A-Za-z]+$/, message: "Only latin letters is available" },
                            { required: true, message: 'Please input name!' },
                            { min: 3, message: 'Min length is 3 characters!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Vacancy"
                        name="vacancy"
                        rules={[
                            { pattern: /^[A-Za-z]+$/, message: "Only latin letters is available" },
                            { required: true, message: 'Please input vacancy!' },
                            { min: 3, message: 'Min length is 3 characters!' }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Phone"
                        name="phone"
                        rules={[{validator}]}
                    >
                        <PhoneInput
                            disableDropdown
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}