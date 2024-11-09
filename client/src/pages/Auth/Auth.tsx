import React, {SyntheticEvent, useRef} from 'react';
import {Button, InputText, Toast, useForm} from 'ui-kit-dynamics';
import {login, registration} from "../../http/auth-http";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as s from './Auth.module.css';
import {ToastRef} from "ui-kit-dynamics/lib/components/Toast/types/Message";

export type Form = {
    login: string,
    password: string,
    email: string
}

const Auth = () => {
    const ref = useRef(null);
    const {formState, register, isValid} = useForm<Form>(ref);
    const location = useLocation();
    const navigate = useNavigate();
    const toastRef = useRef<ToastRef>(null);

    const submitLogin = (evt: SyntheticEvent) => {
        evt.preventDefault();
        if(!checkFill()) return;

        const ua: string = navigator.userAgent;

        login(formState.values.login, formState.values.password, ua)
            .then(({data}) => {
                localStorage.setItem('accessToken', data.accessToken);
                window.postMessage('updateData', '*');
                window.location.href = 'http://localhost:8080/';
            })
            .catch(({response}) => {
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: response.data?.message ?? 'Фнутрення ошибка',
                    life: 5000
                });
            });
    }

    const submitRegistration = (evt: SyntheticEvent) => {
        evt.preventDefault();
        if(!checkFill()) return;

        registration(formState.values.login, formState.values.email, formState.values.password)
            .then(() => {
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Успех',
                    detail: 'Пользователь зарегестрирован, ссылка на активизацию почтового ящика отправлена на почту',
                    life: 5000
                });
                navigate('/login');
            })
            .catch(({response}) => {
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: response.data?.message ?? 'Фнутрення ошибка',
                    life: 5000
                });
            });
    }

    const checkFill = (): boolean => {
        if (!formState.values.login && !formState.values.password) {
            toastRef.current.show({
                severity: 'info',
                summary: 'Не все поля заполнены',
                life: 5000
            });
            return false;
        }

        return true;
    }

    return (
        <>
            <form className={s.panelForm} ref={ref}>
                <label className={s.label} htmlFor="login">Логин</label>
                <InputText id="login" className={s.input} {...register<number>('login', [{
                    required: true,
                    message: 'Поле обязательно для ввода'
                }])}/>
                <span className={s.error}>{formState.errors['login']}</span>

                {location.pathname === '/registration' &&
                    <>
                        <label className={s.label} htmlFor="email">E-mail</label>
                        <InputText id="email" className={s.input} {...register<number>('email', [{
                            required: true,
                            message: 'Поле обязательно для ввода'
                        }])}/>
                        <span className={s.error}>{formState.errors['email']}</span>
                    </>
                }

                <label className={s.label} htmlFor="password">Пароль</label>
                <InputText id="password" type="password" className={s.input} {...register<number>('password', [{
                    required: true,
                    message: 'Поле обязательно для ввода'
                }])}/>
                <span className={s.error}>{formState.errors['password']}</span>
                <Button label={location.pathname === '/registration' ? 'Зарегестрироваться' : 'Войти'}
                        disabled={!isValid}
                        onClick={(evt: SyntheticEvent) => location.pathname === '/registration' ? submitRegistration(evt) : submitLogin(evt)}>
                </Button>
                <NavLink className={s.link} to={location.pathname === '/registration' ? '/login' : '/registration'}>
                    {location.pathname === '/registration' ? 'Войти' : 'Зарегестрироваться'}
                </NavLink>
            </form>
            <Toast ref={toastRef} position="top right"/>
        </>
    );
};

export default Auth;
