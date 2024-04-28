import { Button, Divider, Form, Input, notification, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../services/apiServices';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { email, password } = values;
        setIsLoading(true);
        let res = await postLogin(email, password);
        setIsLoading(false);
        if (res?.data?.user) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(doLoginAction(res.data));
            message.success('Login success');
            navigate('/');
        }
        else {
            notification.error({
                message: "Something error",
                description:
                    res.message && Array.isArray(res.message) > 0 ? res.message[0] : res.message,
                duration: 5
            });
        }
    };

    return (
        <div className='register' style={{ padding: '50px' }}>
            <h3 style={{ textAlign: 'center' }}>Đăng nhập</h3>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                style={{ maxWidth: 600, margin: '0 auto' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit"
                        loading={isLoading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
            <h3 style={{ textAlign: 'center' }}>Hoặc</h3>
            <Divider />
            <span>Bạn chưa có tài khoản? <span className='navigate'
                onClick={() => { navigate('/register') }}
            >Đăng kí</span></span>
        </div>
    )
}

export default LoginPage;