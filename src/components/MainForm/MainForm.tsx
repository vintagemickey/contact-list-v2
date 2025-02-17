import './MainForm.css'
import {Button, Divider, Form, Input, Space} from "antd"
import {useState} from "react";
import {SearchModal} from "../SearchModal/SearchModal.tsx";
import PhoneInput from "antd-phone-input";
import {useAppDispatch} from "../../hooks/redux.ts";
import {IContact} from "../../model/IContact.ts";
import {addContact} from "../../store/reducers/ActionCreators.ts";
import {clearContacts} from "../../store/reducers/ActionCreators.ts";

type FieldType = {
    name: string;
    vacancy: string;
    phone: string;
};

export function MainForm(){
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const showModal = () => {
        setIsSearchModalOpen(true);
    };

    const handleOk = () => {
        setIsSearchModalOpen(false);
    };

    const handleCancel = () => {
        setIsSearchModalOpen(false);
    };

    const onFinish = (values: any) => {
        const newContact: IContact = {
            id: Date.now().toString(),
            name: values.name,
            vacancy: values.vacancy,
            phone: '+' + values.phone.countryCode + values.phone.areaCode + values.phone.phoneNumber,
            letter: values.name.slice(0, 1),
        };
        dispatch(addContact(newContact));
        form.resetFields();
    }

    const handleClearContacts = () => {
        dispatch(clearContacts());
    }

    const validator = (_: unknown, { valid }: { valid: (arg: boolean) => boolean }) => {
        if (valid(true)) return Promise.resolve();
        return Promise.reject("Invalid phone number");
    }

    return (
        <>
            <Divider/>
            <Form form={form} layout="inline" name="form" className="main-form" onFinish={onFinish} >
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
                    <Input />
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

                <Form.Item>
                    <Space size={[8, 16]} wrap>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>

                        <Button onClick={showModal}>
                            Search
                        </Button>

                        <Button type="primary" onClick={handleClearContacts} danger>
                            Clear contacts
                        </Button>
                    </Space>
                </Form.Item>

            </Form>
            <Divider/>
            <SearchModal isSearchModalOpen={isSearchModalOpen} handleOk={handleOk} handleCancel={handleCancel} />
        </>
    )
}